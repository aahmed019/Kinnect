import { setAudioModeAsync } from 'expo-av/build/Audio';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, Button, ScrollView, TextInput } from 'react-native';
import Fire from '../../firebaseConfig';
import data from '../lobby.json';
import GameRoom from './gameRoom';
const Lobby = (props) => {
  
  const [startGame, setStartGame] = useState(false)
  const [inGame, setInGame] = useState(false)
  const[playerName, setPlayerName] = useState('')
  const[playerID, setPlayerID] = useState('')
  const[joinCode, setJoinCode] = useState('')
  const[joined, setJoined] = useState(false)
  const[host, setHost] = useState('')
  const[status, setStatus] = useState('')
  const[GameCode, setGameCode] = useState('')
  const[playerCount, setPlayerCount] = useState(0)

  useEffect(() =>{
    Games = Fire.db
    //var gamess = Fire.db.getRef("games/")
    Games.getRef("games/").on("child_added", function(data){
      var newGame = data.val();
      setHost(newGame.host)
      setStatus(newGame.status)
      setPlayerCount(newGame.playerCount)
      setGameCode(newGame.GameCode)
      //console.log("Host " + newGame.host)
      //console.log("Status " + newGame.status)
      //console.log("player count " + newGame.playerCount)
      //console.log("Game Code: " + newGame.GameCode)

    })
  })
  
  canUserJoinGame = async (gameID) => { 
    console.log('Checking if game is valid...');
    try {
      let snapshot = await Games.getRef(`games`).orderByChild().equalTo(gameID).once('value');
      if (snapshot.val() == null) { 
        // Check if the game exists
        console.log(`Game ${gameID} does not exist`);
        return false;

      }
      else if (snapshot.val()[gameID].question !== 0 ||snapshot.val()[gameID].status !== 'lobby'
        ) { 
        // Check to make sure game hasn't started yet
        console.log(`Game ${snapshot.val()[gameID].question} has already started`);
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
    }
  }
  function finalizeJoin(name, gameID) {
    setPlayerName(name);
    setJoinCode(gameID);
    
  }

  if(joined){
    return(
      <View style={styles.container}>
        <Text>{'\n\n\n'}</Text>
      <GameRoom
      style={{ alignItems: 'center' }}
      playerName = {playerName}
      playerid = {playerID}
      setPlayerID = {setPlayerID} 
      gameID = {joinCode}
      />
      </View>
    )
  }


  return (
    <ScrollView style={styles.container}>
      

  <Text>{'\n\n\n\n'}</Text>
      <Text style={styles.title}>Joining a game</Text>

      <View>
  <Text style={styles.title}>{host}</Text>
  <Text style={styles.title}>{status}</Text>
  <Text style={styles.title}>{playerCount}</Text>
  <Text style={styles.title}>{GameCode}</Text>
  <Text>{'\n\n\n\n'}</Text>
    </View>
     
      
    {/*
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

    <Button title="Back" onPress={() => props.home(false)} style={styles.backButton} />*/}
        

      </ScrollView>

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