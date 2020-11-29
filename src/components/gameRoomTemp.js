import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Alert, ScrollView, Button, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import PictureQuestion from './Games/pictureQuestion';
import Hangman from './Games/hangman';
import Riddle from './Games/riddle';
import * as firebase from 'firebase';
import Fire from '../../firebaseConfig';


// props THIS COMPONENT WILL RECEIVE
//  - an Exit function to go back to home page
//  - username
//  - gameID
//  - host : true / false

// upon receive gameID => proceed to listen to changes made into that gameID
// this room will have 2 parts
//  - Waiting for all players to be ready
//    - display names of all players in the room and a color dot indicator next to their name
//    - if numOfPlayers == numOfReadyPlayers || numOfReadyPlayers == capacity => start the game 
//    - update(status: in-game)
//  - When game started
//    HEADER - current question + number of players remainning
//    BODY - game room 
//    - handleRightAnswer => update(currentQuestionIndex + 1) to db 
//    - handleWrongAnswer => update(currentplayers.pop(username), numOfPlayers -1)
//    - if number of remaining players == 0 => remove the room

export default function GameRoom(props) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(props.username);
  const [gameID, setGameID] = useState(props.gameID);
  const [isHost, setIsHost] = useState(props.isHost);
  const [ready, setReady] = useState(false);
  const [roomState, setRoomState] = useState("!ready"); //!ready , ready, ingame, win, lost
  const [roomInfo, setRoomInfo] = useState({});
  const [users, setUsers] = useState([]);
  const [currentChallengeType, setCurrentChallengeType] = useState("");

  const fetchData = async () => {
    await Fire.db.getRef("games/" + props.gameID).on("value", data => {
      setRoomInfo(data.val());
      setUsers(data.val().currentPlayers.split(","));
      setCurrentChallengeType(data.val().challenges[data.val().atQuestion].type);
      if (data.val().ready < data.val().playerCount) {
        setRoomState('!ready')
      } else {
        if (data.val().status === 'lobby') { setRoomState('ready') }
        else { setRoomState(data.val().status) }
      }
      setLoading(false);
    })
  }
  const detachListener = () => { Fire.db.getRef("games/" + props.gameID).off("value", data) }

  useEffect(() => {
    fetchData()
  }, [])


  // ------------------------HELPER FUNCTIONS------------------------
  // READY FUNCTION
  const getReady = () => {
    setReady(true)
    Fire.db.getRef("games/" + props.gameID).update({ "ready": firebase.database.ServerValue.increment(1) })
  }
  // START GAME FUNCTION
  const startGame = () => {
    Fire.db.getRef("games/" + props.gameID).update({ "status": "ingame", "atQuestion": 0 })
  }
  // SUBMIT RIGHT ANSWER
  const handleRightAnswer = () => {
    // if not last question
    if (roomInfo.atQuestion + 1 < roomInfo.totalQuestion) {
      Fire.db.getRef("games/" + props.gameID).update({ "atQuestion": firebase.database.ServerValue.increment(1) })
    } else { // if last question
      Fire.db.getRef("games/" + props.gameID).update({ "status": "win" })
    }
  }
  // SUBMIT WRONG ANSWER
  // - will not be removed from the game, the app will stop listen to changes or just render blue screen of dead
  const handleWrongAnswer = () => {
    // if not last person in the game
    if (roomInfo.playerCount > 1) {
      Fire.db.getRef("games/" + props.gameID).update({ "playerCount": roomInfo.playerCount - 1 })
    } else {
      Fire.db.getRef("games/" + props.gameID).update({ "playerCount": roomInfo.playerCount - 1, "status": "lost" })
    }
    setRoomState('lost')
  }

  const deleteRoom = () => {
    Games.getRef(`games/${props.gameID}`).remove()
      .then(() => {
        console.log(`Game (${props.gameID}) was deleted`);
      })
      .catch((error) => 'Game deletion failed: ' + error.message);
    props.home(false)
  }

  // -------------------END OF HELPER FUNCTIONS-------------------
  // -------------------RENDERING CASES---------------------------
  // LOADING PAGE
  if (loading == true) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  } else { // WAITING ROOM
    return (
      <View style={styles.mainView}>
        {roomState === "!ready" || roomState === "ready"
          ?
          <View>
            <Text style={styles.title}>{roomInfo.theme}</Text>
            <Text style={styles.subtitle}>Hey {username},</Text>
            <ScrollView style={{ height: '60%', marginBottom: '5%' }}>
              {users.map((user, idx) => {
                return (
                  <View style={styles.horizontalBox} key={idx}>
                    <Image style={{ width: 40, height: 40 }} source={require('../images/human.png')} />
                    <Text style={styles.text}>{user}</Text>
                  </View>
                )
              })}
            </ScrollView>
            <Text style={styles.subtitle2}>Ready Players: {roomInfo.ready} / {roomInfo.playerCount}</Text>
            <View style={styles.buttonArea}>
              {
                !ready
                  ?
                  <TouchableOpacity
                    onPress={() => { getReady() }}
                    style={styles.button}>
                    <Text style={styles.text}>Ready</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity
                    onPress={() => { getReady() }}
                    style={styles.buttonDisabled}>
                    <Text style={styles.text}>Ready</Text>
                  </TouchableOpacity>
              }
              <TouchableOpacity
                onPress={() => { startGame() }}
                style={styles.button}>
                <Text style={styles.text}>Start</Text>
              </TouchableOpacity>
              <Button title="Back" onPress={() => { props.home(false) }} />
            </View>
          </View>
          : roomState === "ingame" // IN-GAME
            ?
            <View key={roomInfo.atQuestion}>
              {/* <Riddle
                number={roomInfo.atQuestion}
                data={roomInfo.challenges[roomInfo.atQuestion]}
                rightAnswer={() => { handleRightAnswer() }}
                wrongAnswer={() => { handleWrongAnswer() }}
              /> */}
              <Hangman
              data={roomInfo.challenges[roomInfo.atQuestion]}
              rightAnswer={() => { handleRightAnswer() }}
              wrongAnswer={() => { handleWrongAnswer() }}
              />
            </View>
            : roomState === "win" // WIN PAGE
              ?
              <View>
                <Text>Congratulations</Text>
                <Button title="Back" onPress={() => { props.home(false) }} />
              </View>
              : // LOST PAGE
              <View>
                <Text>Mission Failed, We'll Success Next Time</Text>
                <Button title="Back" onPress={() => { props.home(false) }} />
              </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainView: {
    width: '90%',
    marginTop: '2%',
    marginHorizontal: '5%'
  },
  horizontalBox: {
    flexDirection: "row",
    width: '100%',
    paddingHorizontal: '3%',
    alignContent: 'center',
    alignItems: 'center',
    height: 60
  },
  title: {
    fontSize: 40,
    textAlign: "center",
    backgroundColor: '#2b2d40',
    color: 'white',
    paddingBottom: '5%',
  },
  subtitle: {
    fontSize: 30,
    textAlign: "center",
    backgroundColor: '#2b2d40',
    color: 'white',
    paddingBottom: '5%',
  },
  subtitle2: {
    fontSize: 25,
    textAlign: "center",
    color: 'white',
  },
  buttonArea: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    borderWidth: 0.5,
    borderColor: 'green',
    backgroundColor: 'green'
  },
  buttonDisabled: {
    borderWidth: 0.5,
    borderColor: 'gray',
    backgroundColor: 'gray'
  },
  text: {
    fontSize: 25,
    color: 'white',
    padding: 10,
  }
})