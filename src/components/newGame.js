import React, { useEffect, useState } from 'react';
import data from "../games.json";
import { StyleSheet, Text, View, Image, Alert, Button, ScrollView, SafeAreaView, FlatList, TextInput, Keyboard } from 'react-native';
import Fire from '../../firebaseConfig';
import GameRoom from './gameRoom';
//for creating games
const Game = (props) => {
  //fix errors with useEffect( games = fire.db)
  useEffect(() =>{
    Games = Fire.db
  })
  const[name, setName] = useState('')
  const[playerID, setPlayerID] = useState('')
  const[created, setCreated] = useState(false)
  const[gameCode, setGameCode] = useState('')
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
    //Randomly generated gameID made with makeGameID function
    let newGameID = makeGameID();
    while (await isNotValidGameID(newGameID)) {
      newGameID = makeGameID();
    }
    try {
      //creats new game table for each game
      let gameRef = Games.getRef('games');
      await gameRef.child(newGameID).set({ 
        'timestamp': Date.now(),
        'question': 0,
        'status': 'lobby',
        'playerCount': 0,
        'currentPlayer': '',
        'turnStartTimestamp': '',
        'score': {'team': 0},
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
      setGameCode(newGameID);
      
      //this.props.updateGameID(newGameID);
      await cleanDatabase();
      return true;
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
    <View style={styles.container}>
      <Text>{'\n\n\n'}</Text>
    <GameRoom
      style={{ alignItems: 'center' }}
      hostid = {playerID}
      hostname = {name}
      gameID = {gameCode}
      />
      </View>)
  }
  else{
    return (
      <View style={styles.container}>
        <Text onPress={() => props.home(false)} style={styles.Text}>Back</Text>
        <Text style={styles.Title}>Create Game</Text>
        
        <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1, color:'white'}}
      value={name}
      onChangeText={text => setName(text)}
      placeholder='Name'
      >
      </TextInput>
      
      <Button title = 'Create Game' onPress={() => test() ? setCreated(true) : console.log('did not work')}></Button>
  
  
  
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
      </View>
  
    );
  }

}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#2b2d40',
    height: '100%',
    width: '100%',
  },
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