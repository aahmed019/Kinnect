import { setAudioModeAsync } from 'expo-av/build/Audio';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Alert, Button, TouchableOpacity, ScrollView, TextInput, Image, KeyboardAvoidingView } from 'react-native';
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
  const [endGame, setEndGame] = useState('yeet')
  const [winners, setWinners] = useState([])
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

  const detachListener = () => {
    Fire.db.getRef("games/").off("value", response => { console.log("Listener Detached") });
  }

  useEffect(() => {
    fetchData();
    // return detachListener();
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
    let users = String(roomInfo.currentPlayers + name + ",");
    Games.getRef(`games/${gameID}`).update({ "currentPlayers": users, "playerCount": roomInfo.playerCount + 1 })
    setPlayerName(name);
    setJoinCode(gameID);
  }
  return (
    //Main Container
    <SafeAreaView style={styles.mainContainer}>

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
            ? endGame === 'yeet'
              ?
              <View style={styles.container}>
                {console.log("Endgame State: ", endGame)}
                <GameRoom
                  isHost={false}
                  username={playerName}
                  gameID={joinCode}
                  home={props.home}
                  handleVictory={setWinners}
                  handleDefeat={setEndGame}
                />
              </View>
              : endGame === 'defeat'
                ?
                <View style={styles.defeatContainer}>
                  {/* {console.log("Endgame State: ", endGame)} */}
                  <Text
                    style={styles.endGameTitle}
                    onPress={() => { props.home(false) }}
                  >Defeated</Text>

                </View>
                :
                <View style={styles.victoryContainer}>
                  {console.log("Endgame State: ", endGame)}
                  <Text style={styles.endGameTitle}>Victory</Text>

                  {console.log("Winners are: ", winners)}
                  <ScrollView style={styles.winnerBox}>
                    {winners.map((user, idx) => {
                      if (user !== '') {
                        null
                      } else {
                        return (
                          <View style={styles.horizontalBox} key={idx}>
                            <Image style={{ width: 40, height: 40, marginRight: 10 }} source={require('../images/human.png')} />
                            <Text style={styles.text}>{user}</Text>
                          </View>
                        )
                      }
                    })}
                  </ScrollView>
                  <Text
                    style={styles.text}
                    onPress={() => { props.home(false) }}
                  >←</Text>
                </View>
            : // LOBBY
            <View style={styles.container}>
              <View
                style={{
                  width: '100%',
                  height: '15%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row'
                }}>
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
                      <Text style={{ fontSize: 30, color: 'green' }}> Enter </Text>
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
                            <Image style={{ width: 30, height: 30, marginRight: 5 }} source={require('../images/human.png')} />
                            <Text style={styles.text}>
                              {item.playerCount}/{item.capacity}
                            </Text>
                          </View>
                          {
                            item.playerCount < item.capacity && item.status == 'lobby'
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
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundColor: '#2b2d40'
  },
  defeatContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-evenly'
  },
  victoryContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerBox: {
    maxHeight: '50%',
    width: '90%',
    marginHorizontal: '5%',
  },
  horizontalBox: {
    flexDirection: "row",
    width: '100%',
    paddingHorizontal: '3%',
    alignContent: 'center',
    alignItems: 'center',
    height: 60
  },
  backButtonArea: {
    position: 'absolute',
    start: '2%',
    zIndex: 99,
  },
  refreshButtonArea: {
    position: 'absolute',
    end: '2%',
    zIndex: 99
  },
  backButtonImage: {
    width: 40,
    height: 40
  },
  container: {
    height: '100%'
  },
  lobby: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  descriptionBox: {
    height: '100%',
    width: '96%',
    marginHorizontal: '2%',
    flex: 1,
    justifyContent: 'flex-start',
    // borderColor: 'orange',
    // borderWidth: 1
  },
  scrollView: {
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 3,
    borderRadius: 20,
    borderColor: '#3eb489',
    maxHeight: '80%',
    margin: '2.5%'
  },
  input: {
    marginLeft: '2.5%',
    marginRight: '2.5%',
    marginBottom: 0,
    paddingHorizontal: 5,
    color: 'white',
    height: 40,
    borderColor: 'orange',
    borderWidth: 1
  },
  joinGameButton: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'green',
    marginBottom: '2%'
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
    width: '94%',
    height: 100,
    marginHorizontal: '3%',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    marginBottom: 10,
    borderBottomWidth: 3,
    borderRadius: 20,
    borderColor: '#3eb489',
    backgroundColor: '#2b2d40'
  },
  title: {
    fontSize: 45,
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontWeight: '900',
  },
  endGameTitle: {
    fontSize: 60,
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontWeight: '900',
  },
  roomName: {
    width: '40%',
    fontSize: 30,
    marginHorizontal: '2%',
    color: 'white',
    fontWeight: '700'
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