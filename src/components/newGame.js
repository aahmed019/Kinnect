import React, { useState } from 'react';
import data from "../games.json";
import { StyleSheet, Text, View, Image, Alert, Button, ScrollView, SafeAreaView, FlatList, TextInput, Keyboard } from 'react-native';
import Fire from '../../firebaseConfig';
import GameRoom from './gameRoom';

const Game = (props) => {
  Games = Fire.db
  const[name, setName] = useState('')
  const[playerID, setPlayerID] = useState('')
  const[created, setCreated] = useState(false)
  const gameExpiration = {
    quarterDay: 21600000,
    halfDay: 43200000,
    oneDay: 86400000,
    twoDay: 172800000,
  }
  const gameExpirationLength = gameExpiration.oneDay
//Creates Game ID
  function makeGameID() {
    let id = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 4; i++) {
      id += characters.charAt(Math.floor(Math.random()*characters.length));
    }
    return id;
  }

  //Checks if GameID is not taken
  const isNotValidGameID = async (id) => {
    if (id === '') {
      return true;
    }
    try {
      let snapshot = await Games.getRef(`games`).orderByKey().equalTo(id).once('value');
      if (snapshot.val() == null) { // We want to make sure the game doesn't exist yet
        console.log(`Game ID (${id}) is valid`)
        return false;
      } else {
        console.log(`Game id (${id}) is not valid`); 
        return true;
      }
    } catch {
      console.log(`Failed to check if game id ${id} is valid`);
      return true;
    }
  }

  //function for creating game lobby
  const test = async() => {
    Keyboard.dismiss();

    if (name.trim() < 1) {
      alert("You must enter a name")
      return
    }
    //this.setState({ disableButton: true, isLoading: true });

    let newGameID = makeGameID();
    while (await isNotValidGameID(newGameID)) {
      newGameID = makeGameID();
    }
    try {
      let gameRef = Games.getRef('games');
      await gameRef.child(newGameID).set({ 
        'timestamp': Date.now(),
        'round': '',
        'currentPlayer': '',
        'turnStartTimestamp': '',
        'score': {'team1': 0, 'team2': 0},
        'turnTime': 60000
      })
      console.log(`Game created. ID: ${newGameID}`);
      // Add host to game
      let ref = await Games.getRef(`players/${newGameID}`).push(name.trim())
      setPlayerID(ref.key)
      // Add player to 'waiting' state to indicate (to others) they haven't submitted words
      Games.getRef(`games/${newGameID}/waiting/${ref.key}`).set(name.trim());
      Games.getRef(`games/${newGameID}/host`).set({[ref.key]: name.trim()});
      setName(name.trim());
      
      //this.props.updateGameID(newGameID);
      await cleanDatabase();
      setCreated(true);
    } 
    catch (error) {
      //this.setState({ disableButton: false, isLoading: false });
      console.log('Game creation failed: ' + error.message);
    }
  }

  const validateGame = (game) => {
    return (!!game.timestamp && typeof game.timestamp === "number")
  }

  cleanDatabase = async () => {
    try {
      let gameExpiredTimestamp = Date.now() - gameExpirationLength;
      let gameRef = Games.getRef('Games');
      let oldGames = await gameRef.orderByChild("timestamp").endAt(gameExpiredTimestamp).once("value");
      console.log(`Games older than this will be deleted: ${(new Date(gameExpiredTimestamp).toString())}`);
      if (oldGames.val() !== null) {
        const IDs = Object.keys(oldGames.val());
        let validGameIDs = [];
        IDs.forEach((ID) => {
          if (validateGame(oldGames.val()[ID])) {
            validGameIDs.push(ID);
            console.log(`${ID}: ${(new Date(oldGames.val()[ID].timestamp)).toString()}`);
          }
        })
        validGameIDs.forEach(validID => {
          Games.getRef(`games/${validID}`).remove();
          Games.getRef(`players/${validID}`).remove();
          Games.getRef(`words/${validID}`).remove();
        })
      }
    }
    catch(err) {
      console.log("Unable to properly clean database")
      console.log(err)
      return
    }
  }
  if(created){
    return(
      <GameRoom/>
    );
  }

  return (
    
    <ScrollView style={{ backgroundColor: '#2b2d40' }}>
      <Text onPress={() => props.home(false)} style={styles.Text}>Back</Text>
      <Text style={styles.Title}>Create Game</Text>
      
      <TextInput
    style={{ height: 40, borderColor: 'gray', borderWidth: 1, color:'white'}}
    value={name}
    onChangeText={text => setName(text)}
    placeholder='Name'
    >
    </TextInput>
    
    <Button title = 'Create Game' onPress={() => test()}></Button>



      {/* {data.map((item) => {
        return (
          <View style={styles.Games}>
            <Image source={{ uri: item.image }} style={styles.Images} />
            <Text
              style={styles.gameText}>
              {item.desc}{'\n'}
            </Text>
          </View>
        );
      })} */}
    </ScrollView>

  );
}
const styles = StyleSheet.create({
  Games: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: '20%',
  },
  Title: {
    fontSize: 50,
    textAlign: "center",
    backgroundColor: '#2b2d40',
    color: 'white',
    paddingBottom: '10%',
  },
  Text: {
    fontSize: 30,
    padding: 30,
    paddingTop: '20%',
    backgroundColor: '#2b2d40',
    color: 'white'
  },
  Images: {
    width: 212,
    height: 212
  },
  gameText: {
    fontSize: 20,
    flex: 1,
    padding: 20,
    backgroundColor: '#2b2d40',
    textAlign: 'center',
    color: 'white'
  }
})
export default Game;