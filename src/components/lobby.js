import { setAudioModeAsync } from 'expo-av/build/Audio';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { Header } from 'react-native/Libraries/NewAppScreen';
import Fire from '../../firebaseConfig';
import data from '../lobby.json';
import GameRoom from './gameRoom';
import * as firebase from 'firebase'

const Lobby = (props) => {
  let Games = Fire.db
  const [startGame, setStartGame] = useState(false)
  const [inGame, setInGame] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [playerID, setPlayerID] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [joined, setJoined] = useState(false)
  const [joining, setJoining] = useState(false)
  const [host, setHost] = useState('')
  const [status, setStatus] = useState('')
  const [GameCode, setGameCode] = useState('')
  const [playerCounter, setPlayerCounter] = useState(0)
  const [gameCount, setGameCount] = useState(0)
  const [gamesList, setGamesList] = useState([])
  const [loading, setLoading] = useState(true)
  const snapshotToObject = (snapshot) => {
    const returnObj = {};
    snapshot.forEach((childSnapshot) => {
      var key = childSnapshot.key;
      var info = childSnapshot.val();
      returnObj[key] = info;
    })
    return returnObj;
  }

  const fetchData = async () => {
    Fire.db.getRef("games/").on("child_added", data => {
      setGamesList([]);
      var currentList = gamesList;
      currentList.push(snapshotToObject(data));
      setGamesList(currentList);
      setLoading(false);
    })
  }

  useEffect(() => {
    fetchData();
  }, []);



  canUserJoinGame = async (gameID) => {
    console.log('Checking if game is valid...');
    try {
      let snapshot = await Games.getRef(`games`).orderByChild("GameCode").equalTo(gameID).once('value');
      if (snapshot.val() == null) {
        // Check if the game exists
        console.log(`Game ${gameID} does not exist`);
        return false;
      }
      else if (snapshot.val()[gameID].question !== 0 || snapshot.val()[gameID].status !== 'lobby') {
        // Check to make sure game hasn't started yet
        console.log(`Game ${snapshot.val()[gameID].question} has already started`);
        alert('Game Already Started')
        return false;
      }
      else if (snapshot.val()[gameID].playerCount == 4) {
        console.log('Max player count reached')
        alert('Game is full')
        return false;
      }
      console.log('it worked')
      setJoined(true);
      return true;

    } catch {
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
    if (await canUserJoinGame(gameID)) {
      finalizeJoin(playerName.trim(), gameID)
    }
  }
  function finalizeJoin(name, gameID) {
    Games.getRef('games/' + gameID + '/playerCount').set(firebase.database.ServerValue.increment(1))
    Games.getRef('players/' + gameID).push(name)
    setPlayerName(name);
    setJoinCode(gameID);
  }
  return (
    //Main Container
    <View style={styles.mainContainer}>
      {/* BACK BUTTON */}
      {
        joining
          ?
          <TouchableOpacity
            onPress={() => {
              setJoinCode(''),
                setJoining(false),
                setHost('')
            }}
            style={styles.backButtonArea}>
            <Image style={styles.backButtonImage} source={require('../images/back.png')} />
          </TouchableOpacity>
          :
          <TouchableOpacity
            onPress={() => props.home(false)}
            style={styles.backButtonArea}>
            <Image style={styles.backButtonImage} source={require('../images/back.png')} />
          </TouchableOpacity>
      }
      {/* REFRESH BUTTON */}
      <TouchableOpacity
        onPress={() => fetchData()}
        style={styles.refreshButtonArea}>
        <Image style={styles.backButtonImage} source={require('../images/refresh.png')} />
      </TouchableOpacity>
      {/* MAIN PAGE */}
      {
        // Loading Page to load data from backend
        loading
          ?
          <View style={styles.container}>
            <Text style={styles.title}>Loading ...</Text>
          </View>
          :
          joined //After Joinning a Game
            ?
            <View style={styles.container}>
              <Text>{'\n\n\n'}</Text>
              <GameRoom
                style={{ alignItems: 'center' }}
                playerName={playerName}
                playerid={playerID}
                setPlayerID={setPlayerID}
                gameID={joinCode}
                home={props.home}
              />
            </View>
            :
            <View style={styles.container}>
              <Text style={styles.title}>
                {joining ? host : "Lobby"}
              </Text>
              {
                joining
                  ?
                  <View style={styles.lobby}>
                    <Text style={styles.title}>
                      {host}
                    </Text>
                    <TextInput
                      style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: 'white' }}
                      value={playerName}
                      onChangeText={name => setPlayerName(name)}
                      placeholder='Enter your name'
                    >
                    </TextInput>

                    <TouchableOpacity
                      onPress={() => pressSubmit()}>
                      <Text>Join Game</Text>
                    </TouchableOpacity>

                  </View>
                  :
                  <ScrollView>
                    {
                      gamesList.map((item, idx) =>
                        <View key={idx} style={styles.singleGame}>
                          {console.log("----------------------GAME INFO----------------------", item)}
                          <Text style={styles.roomName}>
                            {item.host}
                          </Text>
                          <View style={styles.horizonBox}>
                            <Image style={{ width: 30, height: 30 }} source={require('../images/human.png')} />
                            <Text style={styles.text}>
                              {item.playerCount}/4
                            </Text>
                          </View>
                          {
                            item.playerCount < 4
                              ?
                              <TouchableOpacity
                                style={styles.joinButtonArea}
                                onPress={() => {
                                  setJoinCode(item.key),
                                    setJoining(true),
                                    setHost(item.host)
                                }}>
                                <Image style={styles.joinButtonImage} source={require('../images/back.png')} />
                              </TouchableOpacity>
                              :
                              <Image style={styles.joinButtonImage} source={require('../images/noenter.png')} />
                          }
                        </View>
                      )
                    }
                  </ScrollView>
              }

            </View>
      }
    </View>
  )
}
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#2b2d40'
  },
  backButtonArea: {
    position: 'absolute',
    width: 54,
    top: 10,
    start: 10,
    zIndex: 1,
    borderColor: 'yellow',
    borderWidth: 1,
  },
  refreshButtonArea: {
    position: 'absolute',
    width: 54,
    top: 10,
    right: 10,
    zIndex: 1,
    borderColor: 'yellow',
    borderWidth: 1,
  },
  backButtonImage: {
    width: 50,
    height: 50
  },
  container: {
    height: '100%'
  },
  lobby: {
    height: '100%',
    borderColor: 'orange',
    borderWidth: 1
  },
  horizonBox: {
    flexDirection: "row",
    width: '25%',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
  singleGame: {
    flexDirection: "row",
    width: '100%',
    height: 100,
    paddingLeft: '2%',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    borderColor: 'green',
    borderWidth: 1,
    backgroundColor: '#2b2d40'
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    backgroundColor: '#2b2d40',
    color: 'white',
    paddingBottom: '10%',
  },
  roomName: {
    width: '40%',
    fontSize: 30,
    color: 'white'
  },
  joinButtonArea: {
    width: 50
  },
  joinButtonImage: {
    width: 40,
    height: 40,
    transform: [{ rotate: '180deg' }]
  },
  text: {
    fontSize: 30,
    color: 'white'
  }
})

export default Lobby;