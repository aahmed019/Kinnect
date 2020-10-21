import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, Button, ScrollView, TextInput } from 'react-native';
import Fire from '../../firebaseConfig';
import data from '../lobby.json';
import GameRoom from './gameRoom';
const Lobby = (props) => {
  Games = Fire.db
  const [startGame, setStartGame] = useState(false)
  const [inGame, setInGame] = useState(false)
  const[playerName, setPlayerName] = useState('')
  const[playerID, setPlayerID] = useState('')
  const[joinCode, setJoinCode] = useState('')
  const[joined, setJoined] = useState(false)
  
  canUserJoinGame = async (gameID) => { 
    console.log('Checking if game is valid...');
    try {
      let snapshot = await Games.getRef(`games`).orderByKey().equalTo(gameID).once('value');
      if (snapshot.val() == null) { 
        // Check if the game exists
        console.log(`Game ${gameID} does not exist`);
        return false;

      }
      else if (snapshot.val()[gameID].round !== '' 
        //||snapshot.val()[gameID].status !== Screens.LOBBY
        ) { 
        // Check to make sure game hasn't started yet
        console.log(`Game ${snapshot.val()[gameID].round} has already started`);
        //this.setState({
          //disableButton: false,
          //isLoading: false,
          //error: `Uh oh, it looks like that game has already started`
        //});
        alert('Game Already Started')
        return false;
      }
      console.log('it worked')
      setJoined(true);
      return true;

    } catch {
      console.log(`Could not check if game ${gameID} exists`);
      //this.setState({ disableButton: false, isLoading: false })
      return false;
    }
  }
  pressSubmit = async () => {
    let gameID = joinCode.toUpperCase();
    if (playerName.trim() < 1) {
      alert('You must enter a name')
      return
    }
    if (gameID.length !== 4) {
      alert('game code should be 4 characters')
      return
    }
    //this.setState({ disableButton: true })
    if (await canUserJoinGame(gameID)) {
      finalizeJoin(playerName.trim(), gameID)
      if (playerID === '') { //If host was already added, don't add again
      // Add player to the list of players for the game
      Games.getRef('players/' + joinCode.toUpperCase()).push(playerName)
      .then((value) => {
        setPlayerID(value.key)
        // Add player to 'waiting' state to indicate (to others) they haven't submitted words
        Games.getRef(`games/${gameID}/waiting/${value.key}`).set(playerName);
      });
    }
    }
  }
  function finalizeJoin(name, gameID) {
    setPlayerName(name);
    setJoinCode(gameID);
    
  }

  return (
    <View style={styles.container}>
      

  <Text>{'\n\n\n\n'}</Text>
      <Text style={styles.Title}>Joining a game</Text>
      

      <TextInput
    style={{ height: 40, borderColor: 'gray', borderWidth: 1, color:'white'}}
    value={playerName}
    onChangeText={name => setPlayerName(name)}
    placeholder='Enter Game Code'
    >
    </TextInput>

      <TextInput
    style={{ height: 40, borderColor: 'gray', borderWidth: 1, color:'white'}}
    value={joinCode}
    onChangeText={code => setJoinCode(code)}
    placeholder='Enter Game Code'
    >
    </TextInput>
    
    <Button title = 'Join Game' onPress={() => pressSubmit()}></Button>

    <Button title="Back" onPress={() => props.home(false)} style={styles.backButton} />
        

          {/* this part will be replace with data loaded from backend, each game should have their own Unique ID, so when pressed, the ID is sent to retrieve game information */}

          {/* QUESTION 1: SHOULD PLAYER BE ABLE TO REJOIN THE GAME IF THE APPLICATION CRASHED? If so we need a new wireframe for that page
QUETION2 : .... */}

      </View>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: 'orange',
    borderWidth: 2,
    backgroundColor: '#2b2d40'
  },
  lobby: {
    flex: 1,
    borderColor: 'orange',
    borderWidth: 2,
    backgroundColor: '#2b2d40'
  },
  singleGame: {
    flex: 1,
    flexDirection: "row",
    paddingBottom: '5%',
    borderColor: 'yellow',
    borderWidth: 2,
    backgroundColor: '#2b2d40'
  },
  title: {
    fontSize: 50,
    textAlign: "center",
    backgroundColor: '#2b2d40',
    color: 'white',
    paddingBottom: '10%',
  },
  backButton: {
    fontSize: 20,
    paddingBottom: '10%',
    justifyContent: 'flex-start',
    backgroundColor: '#2b2d40',
    color: 'white'
  },
  text: {
    fontSize: 20,
    flex: 1,
    padding: 20,
    backgroundColor: '#2b2d40',
    textAlign: 'center',
    color: 'white'
  }
})

export default Lobby;