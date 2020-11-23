import React, { useEffect, useState } from 'react';
import data from "../games.json";
import { StyleSheet, Text, View, Image, Alert, Button, ScrollView, SafeAreaView, FlatList, TextInput, Keyboard, TouchableOpacity } from 'react-native';
import Fire from '../../firebaseConfig';
import GameRoom from './gameRoom';
//for creating games
const Game = (props) => {
  //fix errors with useEffect( games = fire.db)
  useEffect(() => {
    fetchData()
  }, [])

  // NEW GAME DATA
  const [name, setName] = useState('')
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
    console.log('TYPE OF RETURNARRAY', typeof (returnArray))
    console.log(returnArray)
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
  const test = async () => {
    Keyboard.dismiss();
    //Randomly generated gameID made with makeGameID function
    let newGameID = makeGameID();
    while (await isNotValidGameID(newGameID)) {
      newGameID = makeGameID();
    }
    try {
      //create new game table for each game
      let gameRef = Games.getRef('games');
      let tempObject = {
        'timestamp': Date.now(),
        'name': gameInfo.name,
        'atQuestion': 0,
        'totalQuestion': gameInfo.numOfQuestions,
        'capacity': gameInfo.numOfPlayers,
        'status': 'lobby',
        'playerCount': 1,
        'ready': 0,
        'GameCode': newGameID,
        'host': name,
        'currentPlayer': [{ name: 0 }], //0 == NOT ready, 1 == ready
        'turnStartTimestamp': '',
        'turnTime': 60000,
        'challenges': gameInfo.challenges
      }
      await gameRef.child(newGameID).set(tempObject)
      console.log(`Game created. ID: ${newGameID}`);
      // Add host to game
      // let ref = await Games.getRef(`games/${newGameID}/players/`).push(name.trim())
      // setPlayerID(ref.key)
      // Add player to 'waiting' state to indicate (to others) they haven't submitted words
      // Games.getRef(`games/${newGameID}/waiting/${ref.key}`).set(name.trim());
      // Games.getRef(`games/${newGameID}/host`).set(name.trim());
      setGameCode(newGameID);

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
      <View style={styles.container}>
        <GameRoom
          style={{ alignItems: 'center' }}
          hostid={playerID}
          hostname={name}
          gameID={gameCode}
          home={props.home}
        />
      </View>)
  }
  else {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity
          style={styles.backButtonArea}
          onPress={() => props.home(false)} >
          <Image style={styles.backButtonImage} source={require('../images/back.png')} />
        </TouchableOpacity>
        <Text style={styles.Title} >Create Game Page</Text>
        {loading
          ?
          <Text>LOADING ...</Text>
          :
          <View style={{ paddingHorizontal: '2%' }}>
            {page == 0
              ?
              <View>
                <Text style={styles.gameTitle}>Enter Your Name</Text>
                <TextInput
                  style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: 'white' }}
                  value={name}
                  onChangeText={text => setName(text)}
                  placeholder='Name'
                />
                <TouchableOpacity onPress={() => { setPage(page + 1) }}>
                  <Text>Next</Text>
                </TouchableOpacity>
              </View>
              : page == 1
                ?
                <View>
                  <Text style={styles.gameTitle}>Pick A Theme</Text>
                  {data.map((item, idx) => {
                    return (
                      <View key={idx}>
                        <Text style={styles.gameTitle}>{item.DOC_DATA.name}</Text>
                        <View style={{ flexDirection: 'row', }}>
                          <View style={{ width: '80%' }}>
                            <Text>Capacity: {item.DOC_DATA.numOfPlayers}</Text>
                            <Text>Trials: {item.DOC_DATA.numOfQuestions}</Text>
                            <Text>Description: {item.DOC_DATA.description}</Text>
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
                </View>
                : page == 2
                  ?
                  <View>
                    <Text>Room Information: {JSON.stringify(gameInfo, null, 2)}</Text>
                    <Button title='Create Game' onPress={() => test() ? setCreated(true) : console.log('did not work')}></Button>
                  </View>
                  : null
            }

          </View>
        }
      </ScrollView>
    );
  }

}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2b2d40',
    width: '100%',
    borderWidth: 1,
    borderColor: 'yellow'
  },
  Games: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: '20%',
  },
  Title: {
    fontSize: 30,
    backgroundColor: '#2b2d40',
    textAlign: 'center',
    paddingTop: 20,
    color: 'white',
    paddingBottom: 30,
    borderWidth: 1,
    borderColor: 'orange',
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
  gameText: {
    fontSize: 20,
    padding: 20,
    backgroundColor: '#2b2d40',
    textAlign: 'center',
    color: 'white'
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
  backButtonArea: {
    position: 'absolute',
    width: 50,
    top: 23,
    start: 5,
    zIndex: 1,
  },
  backButtonImage: {
    width: 30,
    height: 30
  },
  selectButtonImage: {
    width: 40,
    height: 40,
    transform: [{ rotate: '180deg' }]
  },
  gameTitle: {
    fontSize: 25,
  }
})
export default Game;