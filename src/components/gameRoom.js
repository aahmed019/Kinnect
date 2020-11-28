import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Alert, Button, SafeAreaView, TextInput } from 'react-native';
import PictureQuestion from './Games/pictureQuestion';
import Hangman from './Games/hangman';
import sampleGames from './Games/sampleQuestions.json';
import Riddle from './Games/riddle';
import * as firebase from 'firebase';
import Fire from '../../firebaseConfig';


// props THIS COMPONENT WILL RECEIVE
//  - an Exit function to go back to home page
//  - username
//  - gameID

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
  // this room will receive data from backend, then generate question type base on the data receive
  const [insideAQuestion, setInsideAQuestion] = useState(false) // check if the player inside the game or not (or if they are ready). If they are not inside the game, check if they won or lost =>  4 states: "inProgress", "Win", "Lose", false
  const [gameOver, setGameOver] = useState(false) // used to keep track when the game is over
  const [winner, setWinner] = useState(false) // answered correctly all the question
  const [numberOfQuestions, setNumberOfQuestion] = useState(sampleGames.length) // number of question should be passed inside "props" when generate request
  const [nthQuestion, setNthQuestion] = useState(0) // keep track of which question the player is on (should be inside the database as well so once requested the player is moved to where it is currently is)
  const [currentAnswer, setCurrentAnswer] = useState(true) // will be used to decide if current question answered correctly
  // if currentAnswer is correct, a request for next question will be sent. Once the data received, "currentAnswer" set to False
  const [questionData, setQuestionData] = useState({}) // everything needed to render a question
  const [questionType, setQuestionType] = useState('')
  const [ready, setReady] = useState(0)
  const [readied, setReadied] = useState(false)
  const [roomCode] = useState(props.gameID.toUpperCase())
  const [Timer, setTimer] = useState(3)

  //similar to componentDidMount & unMount
  useEffect(() => {
    Games = Fire.db
    //updates the next round
    nextRound = () => {
      if (nthQuestion === 3) {
        setWinner(true)
      } else {
        Games.getRef(`games/${props.gameID}/question`).set(nthQuestion + 1);
        setNthQuestion(nthQuestion + 1)
      }
    }

  })


  // -------------------HELPER FUNCTIONS ------------------------
  const getQuestion = (gameID, nthQUESTION, currentANSWER) => {
    currentANSWER === true
      ?
      (
        console.log("request sent for next question"),
        // request will be sent with given information
        //setQuestionData("whatever will be received"),
        setCurrentAnswer(false),
        setInsideAQuestion(true),
        setQuestionType(questionData.type)
      )
      : console.log("the condition is not met to move on")

  } // used to get question data, "gameId, and nthQuestion" is received from the props
  const handleRightAnswer = () => {
    setCurrentAnswer(true)
    console.log("currently at ", nthQuestion, "/", numberOfQuestions)
    nthQuestion == numberOfQuestions - 1
    console.log(numberOfQuestions + 'this number of')
      ? //if current question is last question => they won
      (
        setWinner(true),
        setInsideAQuestion(false)
      )
      : // else update current pointer and request for next question
      (
        setNthQuestion(nthQuestion++),
        getQuestion(gameId, nthQuestion, currentAnswer)
      )
    //Games.getRef(`games/${roomCode}/question`).set(nthQuestion+1);
  }
  const handleWrongAnswer = () => {
    setCurrentAnswer(false)
    setInsideAQuestion(false)
    setGameOver(true)
    setCurrentAnswer(true)
    setNthQuestion(0)
    alert('Sorry You Lost!')
  }
  const addPlayer = () => {
    Games.getRef(`games/${props.gameID}/ready`).set(firebase.database.ServerValue.increment(1))
    setReadied(true)


  }
  // tempGetQuestion is for prototype and to read data from JSON file not from backend
  const tempGetQuestion = () => {
    Fire.db.getRef(`games/${props.gameID}/status`).set('in-game');
    currentAnswer
      ?
      (
        setQuestionData(sampleGames[nthQuestion]),
        setCurrentAnswer(false),
        setInsideAQuestion(true)
      )
      :
      console.log("tempGetQuestion press")

  }
  const tempHandleRightAnswer = () => {
    console.log("Answer correctly, and now at question-nth: ", nthQuestion, "/", numberOfQuestions),
      (
        nthQuestion == numberOfQuestions - 1
          ? (setCurrentAnswer(false),
            setInsideAQuestion(false),
            setWinner(true),
            setCurrentAnswer(true))
          //setNthQuestion(0))
          : (setCurrentAnswer(true),
            //setNthQuestion(nthQuestion + 1),
            nextRound(nthQuestion),
            setQuestionData(sampleGames[nthQuestion])
          )
      )
  }

  const exitGame = () => {


    Games.getRef(`games/${props.gameID}`).remove()
      .then(() => {
        console.log(`Game (${props.gameID}) was deleted`);
      })
      .catch((error) => 'Game deletion failed: ' + error.message);
    props.home(false)
  }

  // -------------------END OF HELPER FUNCTIONS-------------------
  // -------------------RENDERING CASES---------------------------
  // Is it inside a question?
  // True => What type
  // False => Because of room just created or the game ended ?
  //Loading page 
  //if(ready === 4){
  //if(Timer !== 0){
  //setInterval(() => {
  //setTimer(Timer <= Timer - 1);
  //if (Timer <= 0) {setNewTest(true)};
  //}, 1000);
  //tempGetQuestion();
  // }




  return (

    <View>
      <Button title="Exit" onPress={() => { setExit(true) }} />
      {!insideAQuestion
        ? winner
          ? // WINNING PAGE
          <View>
            <Button onPress={() => { addPlayer() }} style={styles.text} disabled={readied} title='press'>Press here when ready!</Button>
            <Text style={styles.text}>{ready}/4</Text>
            <Text style={styles.text} onPress={() => {
              tempGetQuestion()
              //if(ready === 4){
              //setTimeout(() => {
              //setTimer(Timer <= Timer - 1); 
              //if(Timer == 0){
              //tempGetQuestion()
              //}
              //}, 1000);
              //}
            }}>Play!</Text>
            <Text style={styles.text}>{Timer}</Text>
            <Text>{'\n\n\n\n'} </Text>
            <Text style={styles.text} onPress={() => { tempGetQuestion() }}>DEV</Text>
          </View>
          : gameOver// LOSING PAGE
            ?
            <View >
              <Text style={styles.text}>Sorry You Lost!</Text>
              <Text style={styles.text} onPress={() => exitGame()}>Back</Text>
            </View>
            : // GET READY PAGE
            <View>
              <Button onPress={() => addPlayer()} style={styles.text} disabled={readied} title='Press here when ready!' />
              <Text style={styles.text}>{ready}/4</Text>
              <Text style={styles.text}>Timer {Timer}</Text>
              <Text style={styles.text} onPress={() => { tempGetQuestion() }}>START</Text>
            </View>

        : currentAnswer //if true that means waiting for next question
          ? <View>
            <Text>Loading...</Text>
            <Button title="Ready?" onPress={() => { setCurrentAnswer(false) }} />
          </View>
          :
          <View>
            <Text style={styles.text} onPress={() => exitGame()}>Exit</Text>
            {
              nthQuestion == '0'
                ? <PictureQuestion
                  data={sampleGames[nthQuestion]}
                  rightAnswer={() => { tempHandleRightAnswer() }}
                  wrongAnswer={() => { handleWrongAnswer() }} />
                : nthQuestion == '1'
                  ? <Hangman
                    data={sampleGames[nthQuestion]}
                    rightAnswer={() => { tempHandleRightAnswer() }}
                    wrongAnswer={() => { handleWrongAnswer() }} />
                  : nthQuestion == '2'
                    ? <Riddle
                      data={sampleGames[nthQuestion]}
                      rightAnswer={() => { tempHandleRightAnswer() }}
                      wrongAnswer={() => { handleWrongAnswer() }} />
                    : console.log('works')
            }
          </View>
      }
    </View>


    // render question from passed data in props, but for prototype we only need read from JSON
  )
}

const styles = StyleSheet.create({
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