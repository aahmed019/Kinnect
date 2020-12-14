import React, { useEffect, useState } from 'react';
import data from "../games.json";
import { StyleSheet, Text, View, Image, Alert, Button, ScrollView, SafeAreaView, FlatList, TextInput, Keyboard, TouchableOpacity } from 'react-native';
import Fire from '../../firebaseConfig';
import GameRoom from './gameRoomTemp';
//for creating games
const Game = (props) => {
  //fix errors with useEffect( games = fire.db)
  Games = Fire.db
  useEffect(() => {
    fetchData()
  }, [])

  // NEW GAME DATA
  const [name, setName] = useState('')
  const [roomName, setRoomName] = useState('')
  const [endGame, setEndGame] = useState('yeet')
  const [winners, setWinners] = useState([])
  const [gameInfo, setGameInfo] = useState({})
  const [playerID, setPlayerID] = useState('')
  const [created, setCreated] = useState(false)
  const [gameCode, setGameCode] = useState('')
  const gameExpiration = {
    quarterDay: 21600000,
    halfDay: 43200000,
    oneDay: 86400000,
    twoDay: 172800000,
  }
  const gameExpirationLength = gameExpiration.oneDay
  // DATA RETRIEVE FROM DATABASE
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const ref = Fire.db.getCollection('games'); //COLLECTION NAME TO GET GAME DATA

  //-----------------------------------HELPER FUNCTIONS-----------------------------------

  // CONVERT SNAPSHOT TO OBJECT / READABLE LIST 
  const snapshotToObject = (snapshot) => {
    const returnArray = []
    snapshot.forEach(doc => {
      var tempObject = {};
      // var temp = doc.data();
      tempObject["DOC_ID"] = doc.id;
      tempObject["DOC_DATA"] = doc.data();
      returnArray.push(tempObject);
    })
    return returnArray;
  }
  // FETCH DATA
  const fetchData = async () => {
    var tempArrary = []
    ref.get()
      .then((snapshot) => {
        tempArrary = snapshotToObject(snapshot);
        setData(tempArrary);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error retrieving data: ", error)
        setLoading(true)
      })
  };

  //Creates Game ID
  const makeGameID = () => {
    let id = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 4; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
  }

  //Checks if GameID is not taken
  const isNotValidGameID = async (id) => {
    if (id === '') {
      return true;
    }
    try {
      let snapshot = await Games.getRef(`games`).orderByKey().equalTo(id).once('value').then(snapshot => {
        if (snapshot.val() == null) { // We want to make sure the game doesn't exist yet
          console.log(`Game ID (${id}) is valid`)
          return false;
        } else {
          console.log(`Game id (${id}) is not valid`);
          return true;
        }
      }).catch(error => { console.log("error", error) });

    } catch (err) {
      console.log(`Failed to check if game id ${id} is valid ${err}`);
      return true;
    }
  }

  //function for creating game lobby
  const test = async () => {
    Keyboard.dismiss();
    //Randomly generated gameID made with makeGameID function
    let newGameID = makeGameID();
    while (await isNotValidGameID(newGameID)) {
      newGameID = makeGameID();
    }
    setGameCode(newGameID);
    try {
      //create new game table for each game
      let gameRef = Games.getRef('games');
      let tempObject = {
        'timestamp': Date.now(),
        'name': roomName,
        'theme': gameInfo.name,
        'description': gameInfo.description,
        'atQuestion': 0,
        'totalQuestion': gameInfo.numOfQuestions,
        'capacity': gameInfo.numOfPlayers,
        'status': 'lobby',
        'playerCount': 1,
        'ready': 0,
        'GameCode': newGameID,
        'host': name,
        'currentPlayers': name + ',',
        'readyPlayers': [], //0 == NOT ready, 1 == ready
        'turnStartTimestamp': '',
        'turnTime': 60000,
        'challenges': gameInfo.challenges
      }
      console.log(tempObject)
      await gameRef.child(newGameID).set(tempObject).then(res => { alert("Game Added Successfully") }).catch(error => { console.log("Error in creating new room", error) })
      console.log(`Game created. ID: ${newGameID}`);
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
          //Games.getRef(`games/players/${validID}`).remove();
        })
      }
    }
    catch (err) {
      console.log("Unable to properly clean database")
      console.log(err)
      return
    }
  }
  //-----------------------------------END OF HELPER FUNCTIONS-----------------------------------
  if (created) {
    return (
      <SafeAreaView style={styles.container}>
        {endGame === 'yeet'
          ?
          <View style={styles.container}>
            {console.log("Endgame State: ", endGame)}
            <GameRoom
              isHost={true}
              username={name}
              gameID={gameCode}
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
                    return (
                      <View style={styles.horizontalBox} key={idx}>
                        <Image style={{ width: 40, height: 40, marginRight: 10 }} source={require('../images/human.png')} />
                        <Text style={styles.text}>{user}</Text>
                      </View>
                    )
                  } else { null }
                })}
              </ScrollView>
              <Text
                style={styles.text}
                onPress={() => { props.home(false) }}
              >←</Text>
            </View>}
      </SafeAreaView>
    )
  }
  else {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{
          width: '100%',
          height: '20%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row'
        }}>
          <TouchableOpacity
            style={styles.backButtonArea}
            onPress={() => props.home(false)}
          >
            <Image style={styles.backButtonImage} source={require('../images/back.png')} />
          </TouchableOpacity>
          <Text style={styles.Title}>
            {
              page == 0
                ? 'New Room'
                : page == 1
                  ? 'Theme'
                  : 'Verify'
            }
          </Text>
        </View>
        {loading
          ?
          <Text>LOADING ...</Text>
          :
          <View style={{ paddingHorizontal: '2%', height: '80%' }}>
            {page == 0
              ?
              <View style={styles.roomInfo}>
                <View>
                  <Text style={styles.gameTitle}>Enter Room Name</Text>
                  <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: 'white', marginBottom: 20 }}
                    value={roomName}
                    onChangeText={text => setRoomName(text)}
                    placeholder="Room's Name"
                  />
                </View>
                <View>
                  <Text style={styles.gameTitle}>Enter Your Name</Text>
                  <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: 'white', marginBottom: 40 }}
                    value={name}
                    onChangeText={text => setName(text)}
                    placeholder='Name'
                  />
                </View>
                <TouchableOpacity
                  style={styles.nextButtonArea}
                  onPress={() => { setPage(page + 1) }}>
                  <Text style={styles.nextButton}>Next</Text>
                </TouchableOpacity>
              </View>
              : page == 1
                ?
                <ScrollView style={styles.body}>
                  {data.map((item, idx) => {
                    return (
                      <View style={styles.themeBox} key={idx}>
                        <Text style={styles.gameTitle}>{item.DOC_DATA.name}</Text>
                        <View style={{ flexDirection: 'row', }}>
                          <View style={{ width: '80%' }}>
                            <Text style={styles.gameText}>Capacity: {item.DOC_DATA.numOfPlayers}</Text>
                            <Text style={styles.gameText}>Trials: {item.DOC_DATA.numOfQuestions}</Text>
                            <Text style={styles.gameText}
                              numberOfLines={3}>Description: {item.DOC_DATA.description}</Text>
                          </View>
                          <TouchableOpacity
                            key={idx}
                            style={{ width: '20%' }}
                            onPress={() => { setGameInfo(item.DOC_DATA), setPage(page + 1) }}>
                            <Image style={styles.selectButtonImage} source={require('../images/back.png')} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )
                  })}
                </ScrollView>
                : page == 2
                  ?
                  <ScrollView style={styles.body}>
                    <View style={{ width: '80%' }}>
                      <Text style={styles.gameText}>Room Owner: {name} </Text>
                      <Text style={styles.gameText}>Room's Name: {roomName} </Text>
                      <Text style={styles.gameText}>Capacity: {gameInfo.numOfPlayers}</Text>
                      <Text style={styles.gameText}>Trials: {gameInfo.numOfQuestions}</Text>
                      <Text style={styles.gameText}
                        numberOfLines={3}>Theme: {gameInfo.name}</Text>
                    </View>

                    <Button
                      title='Create Game'
                      onPress={async () => {
                        await test()
                          ? setCreated(true)
                          : alert("Error Creating New Room")
                      }} />
                  </ScrollView>
                  : null
            }

          </View>
        }
      </SafeAreaView>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2b2d40',
    width: '100%',
    height: '100%',
  },
  body: {
    height: '80%',
    width: '100%',
  },
  roomInfo: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-start',
  },

  Title: {
    fontSize: 40,
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontWeight: '900',
  },
  Text: {
    fontSize: 20,
    padding: 30,
    paddingTop: '20%',
    backgroundColor: '#2b2d40',
    color: 'white'
  },
  Images: {
    width: 212,
    height: 212
  },
  themeBox: {
    paddingBottom: 20,
    marginBottom: 10,
    borderBottomWidth: 3,
    borderRadius: 20,
    borderColor: 'red'
  },
  gameText: {
    fontSize: 15,
    color: 'white'
  },
  gameTitle: {
    fontSize: 25,
    color: 'white',
    paddingBottom: 10,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderColor: 'orange'
  },
  touchableOp: {
    borderWidth: 1,
    borderColor: 'orange'
  },
  nextButtonArea: {
    marginHorizontal: 100,
    marginVertical: 5,
    paddingVertical: 20,
    backgroundColor: 'rgb(62,180,137)',
    borderRadius: 5,
  },
  backButtonArea: {
    position: 'absolute',
    start: '2%',
    zIndex: 99
  },
  backButtonImage: {
    width: 40,
    height: 40
  },
  selectButtonImage: {
    width: 40,
    height: 40,
    transform: [{ rotate: '180deg' }]
  },
  nextButton: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
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
  endGameTitle: {
    fontSize: 60,
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontWeight: '900',
  },
  text: {
    fontSize: 30,
    color: 'white'
  }
})
export default Game;