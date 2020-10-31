import { setAudioModeAsync } from 'expo-av/build/Audio';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Alert, Button, ScrollView, TextInput } from 'react-native';
import { Header } from 'react-native/Libraries/NewAppScreen';
import Fire from '../../firebaseConfig';
import data from '../lobby.json';
import GameRoom from './gameRoom';


const Lobby = (props) => {
  let Games = Fire.db
  const [startGame, setStartGame] = useState(false)
  const [inGame, setInGame] = useState(false)
  const[playerName, setPlayerName] = useState('')
  const[playerID, setPlayerID] = useState('')
  const[joinCode, setJoinCode] = useState('')
  const[joined, setJoined] = useState(false)
  const [joining, setJoining] = useState(false)
  const[host, setHost] = useState('')
  const[status, setStatus] = useState('')
  const[GameCode, setGameCode] = useState('')
  const[playerCount, setPlayerCount] = useState(0)
  const[gameCount, setGameCount] = useState(0)
  const gamesList = useRef(null)
  const[read, setRead] = useState(false)
  const[loading, setLoading] = useState(true)


  useEffect(() =>{
    Games = Fire.db
    var tempData = []
    Games.getRef("games/").on("child_added", data => {
      var key = data.key
      var value = data.val();
      tempData.push({ key: key, value: value })
      gamesList.current = tempData
      setRead(true)
    })
    //Time to allow data to populate (1 second loading page)
    setTimeout(() =>{setLoading(false)},1000)
    
  })
  
  
  canUserJoinGame = async (gameID) => { 
    console.log('Checking if game is valid...');
    try {
      let snapshot = await Games.getRef(`games`).orderByChild("GameCode").equalTo(gameID).once('value');
      console.log(snapshot.val())
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

    } catch{
      //console.error(error);
      console.log(`Could not check if game ${gameID} exists`);
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
  //Joining game
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
      home = {props.home}
      />
      </View>
    )
  }
  //Loading page
  if(loading){
    return(
      <View style={styles.container}>
        <Text>{'\n\n\n'}</Text>
      <Text style={styles.title}>Loading ...</Text>
      </View>
    )
  }
  return (
    <ScrollView style={styles.container}>
      
      
  <Text>{'\n\n\n\n'}</Text>
  <Button title="Back" onPress={() => props.home(false)} style={styles.backButton} />
      <Text style={styles.title}>Joining a game</Text>

      <View>
        {
          read
          ? joining
          ?
          <View>
          <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, color:'white'}}
          value={playerName}
          onChangeText={name => setPlayerName(name)}
          placeholder='Enter Game Code'
          >
          </TextInput>
          
          <Button title = 'Join Game' onPress={() => pressSubmit()}></Button>
      
          <Button title="Back" onPress={() => props.home(false)} style={styles.backButton} />
          </View>
            : gamesList.current.map((el, i) =>
            <View key={gamesList.current[i].key}>
              <View style={styles.singleGame}>
              <Text style={styles.text}>{gamesList.current[i].value.host}</Text>
              <Text style={styles.text}>{gamesList.current[i].value.playerCount}/4</Text>
              </View>
  
              <View style={styles.singleGame}>
              <Text style={styles.text}>status: {gamesList.current[i].value.status}</Text>
              <Button title ="Join" onPress ={() => {setJoinCode(gamesList.current[i].key), setJoining(true)}}></Button>
              </View>
  
          <Text>{'\n\n'}</Text>
            </View>
            )

          : console.log('should not get here')
          
        }     
 
    </View>
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