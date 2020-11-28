import { setAudioModeAsync } from 'expo-av/build/Audio';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, ScrollView, TextInput, Image, KeyboardAvoidingView } from 'react-native';
import { Header } from 'react-native/Libraries/NewAppScreen';
import Fire from '../../firebaseConfig';
import data from '../lobby.json';
import GameRoom from './gameRoomTemp';
import * as firebase from 'firebase'

const Lobby = (props) => {
  let Games = Fire.db
  const [playerName, setPlayerName] = useState('')
  const [playerID, setPlayerID] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [joined, setJoined] = useState(false)
  const [joining, setJoining] = useState(false)
  const [theme, setTheme] = useState('')
  const [gamesList, setGamesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [roomInfo, setRoomInfo] = useState({})
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
    Fire.db.getRef("games/").on("value", data => {
      var currentList = [];
      setGamesList([]);
      data.forEach((childSnapshot) => {
        currentList.push(childSnapshot.val());
      })
      setGamesList(currentList);
      setLoading(false);
    })
  }

  const listenForData = async () => {
    fetchData();
    Fire.db.getRef("games/").on("child_added", data => {
      var currentList = gamesList;
      currentList.push(snapshotToObject(data));
      setGamesList(currentList);
      setLoading(false);
    })
  }
  const detachListener = async () => {
    Fire.db.getRef("games/").off("value", listener);
  }

  useEffect(() => {
    joined ? detachListener() : listenForData();
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
      else if (snapshot.val()[gameID].status !== 'lobby') {
        // Check to make sure game hasn't started yet
        console.log(`Game ${snapshot.val()[gameID].question} has already started`);
        alert('Game Already Started')
        return false;
      }
      else if (snapshot.val()[gameID].playerCount == roomInfo.capacity) {
        console.log('Max player count reached')
        alert('Game is full')
        return false;
      }
      console.log('it worked')
      setJoined(true);
      return true;

    } catch {
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
  finalizeJoin = (name, gameID) => {
    Games.getRef('games/' + gameID + '/playerCount').set(firebase.database.ServerValue.increment(1))
    let users = String(roomInfo.currentPlayers + "," + name);
    Games.getRef(`games/${gameID}`).update({ "currentPlayers": users })
    setPlayerName(name);
    setJoinCode(gameID);
  }
  return (
    //Main Container
    <View style={styles.mainContainer}>

      {/* MAIN PAGE */}
      {
        // Loading Page to load data from backend
        loading
          ?
          <View style={styles.container}>
            <Text style={styles.title}>Loading ...</Text>
          </View>
          :
          joined //INSIDE ROOM
            ?
            <View style={styles.container}>
              <GameRoom
                isHost={false}
                username={playerName}
                gameID={joinCode}
                home={props.home}
              />
            </View>
            : // LOBBY
            <View style={styles.container}>
              {/* BACK BUTTON */}
              {
                joining
                  ?
                  <TouchableOpacity
                    onPress={() => {
                      setJoinCode(''),
                        setJoining(false),
                        setTheme('')
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
              {/* LOBBY - THEME OF THE GAME */}
              <View style={{ marginHorizontal: 30 }}>
                <Text style={styles.title}>
                  {joining ? theme : "Lobby"}
                </Text>
              </View>
              {
                joining
                  ?
                  // JOINNING A ROOM
                  <View style={styles.lobby}>
                    <KeyboardAvoidingView
                      style={styles.descriptionBox}
                      behavior='padding'
                      keyboardVerticalOffset={'170'}
                    >
                      <View style={styles.scrollView}>
                        <ScrollView>
                          <Text style={styles.descriptionText}>
                            {roomInfo.description}
                          </Text>
                        </ScrollView>
                      </View>
                      <TextInput
                        style={styles.input}
                        value={playerName}
                        onChangeText={name => setPlayerName(name)}
                        placeholder='Enter your name'
                      >
                      </TextInput>
                    </KeyboardAvoidingView>

                    <TouchableOpacity
                      style={styles.joinGameButton}
                      onPress={() => pressSubmit()}>
                      <Text style={{ fontSize: 30, color: 'green' }}>Enter</Text>
                    </TouchableOpacity>
                  </View>
                  : // LISTING ALL THE ROOMS IN THE DATABASE
                  <ScrollView>
                    {
                      gamesList.map((item, idx) =>
                        <View key={idx} style={styles.singleGame}>
                          <Text style={styles.roomName}>
                            {item.name}
                          </Text>
                          <View style={styles.horizonBox}>
                            <Image style={{ width: 30, height: 30 }} source={require('../images/human.png')} />
                            <Text style={styles.text}>
                              {item.playerCount}/{item.capacity}
                            </Text>
                          </View>
                          {
                            item.playerCount < item.capacity && item.status != 'in-game'
                              ?
                              <TouchableOpacity
                                style={styles.joinButtonArea}
                                onPress={() => {
                                  setJoinCode(item.GameCode),
                                    setJoining(true),
                                    setTheme(item.theme),
                                    setRoomInfo(item)
                                }}>
                                <Image style={styles.joinButtonImage} source={require('../images/back.png')} />
                              </TouchableOpacity>
                              :
                              <View style={styles.joinButtonArea}>
                                <Image style={styles.joinButtonImage} source={require('../images/noenter.png')} />
                              </View>
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
    width: 50,
    top: '7%',
    start: 5,
    zIndex: 1,

  },
  refreshButtonArea: {
    position: 'absolute',
    width: 50,
    top: '7%',
    right: 5,
    zIndex: 1
  },
  backButtonImage: {
    width: 50,
    height: 50
  },
  container: {
    height: '100%'
  },
  lobby: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  descriptionBox: {
    maxHeight: '80%',
    flex: 1,
    justifyContent: 'flex-start',
    borderColor: 'orange',
    borderWidth: 1
  },
  scrollView: {
    borderColor: 'orange',
    borderWidth: 1,
    maxHeight: '80%',
    margin: '2.5%'
  },
  input: {
    marginLeft: '2.5%',
    marginRight: '2.5%',
    marginBottom: 0,
    height: 40,
    borderColor: 'orange',
    borderWidth: 1
  },
  joinGameButton: {
    height: 40,
    borderWidth: 1,
    borderColor: 'green'
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
  descriptionText: {
    fontSize: 18,
    color: 'white'
  },
  text: {
    fontSize: 30,
    color: 'white'
  }
})

export default Lobby;