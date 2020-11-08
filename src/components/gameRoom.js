import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Alert, Button, SafeAreaView, TextInput } from 'react-native';
import PictureQuestion from './Games/pictureQuestion';
import Hangman from './Games/hangman';
import sampleGames from './Games/sampleQuestions.json';
import Riddle from './Games/riddle';
import * as firebase from 'firebase'
import Fire from '../../firebaseConfig';

export default function GameRoom(props) {
  // this room will receive data from backend, then generate question type base on the data receive
  const [exit, setExit] = useState(false) //option to leave the game
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
  const[hostName, setHostname] = useState(props.hostname)
  const[hostid, setHostid] = useState(props.hostid)
  const [player, setPlayer] = useState(props.playerid)
  const [roomCode] = useState(props.gameID.toUpperCase())
  const[gameStatus, setGameStatus] = useState('lobby')
  const [Timer, setTimer] = useState(3)

  
  //similar to componentDidMount & unMount
 useEffect(() =>{
   Games = Fire.db
  //updates the next round
  nextRound  = () => {
  if (nthQuestion === 3) {
    alert('you won!')
  } else {
      Games.getRef(`games/${props.gameID}/question`).set(nthQuestion + 1);
      setNthQuestion(nthQuestion + 1)
   }
  }
  //Listens to ready changes
  Games.getRef(`games/${props.gameID}/ready`).on('value', (snapshot) =>{
    let readyState = snapshot.val()
    setReady(readyState)
  });
  //Listens to round changes
  Games.getRef(`games/${props.gameID}/question`).on('value', (snapshot) => {
    let questState = snapshot.val();
    console.log(questState)
    setNthQuestion(questState);
    setQuestionData(sampleGames[questState])
    //setQuestionType(questionData.type)
  });


  deletePlayers = () =>{
    Games.getRef(`players/${props.gameID}`).remove()
    .then(()=> {
      console.log(`Players from (${props.gameID}) were deleted`);
      })
    .catch((error) => 'Player deletion failed: ' + error.message);

    props.home(false)
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
const addPlayer = () =>{
  Games.getRef(`games/${props.gameID}/ready`).set(firebase.database.ServerValue.increment(1))
  setReadied(true)
}
  // tempGetQuestion is for prototype and to read data from JSON file not from backend
  const tempGetQuestion = () => {
    Games.getRef(`games/${props.gameID}/status`).set('in-game');
    currentAnswer
      ?
      (
        console.log("Initialize data", typeof sampleGames[nthQuestion]),
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
    .then(()=> {
      console.log(`Game (${props.gameID}) was deleted`);
      })
    .catch((error) => 'Game deletion failed: ' + error.message);  

    deletePlayers()

    props.home(false)
  }
  
  // -------------------END OF HELPER FUNCTIONS-------------------
  // -------------------RENDERING CASES---------------------------
  // Is it inside a question?
  // True => What type
  // False => Because of room just created or the game ended ?
  //Loading page

  if(ready == 4 && Timer){
    let interval = null;
    interval = setInterval(() => {
      setTimer(Timer => Timer - 1);
    }, 1000);
    if(Timer <= 0){
    setTimer(false)
    tempGetQuestion()
    }
  }

  
  return (
    // <Button title="Exit" onPress={() => { setExit(true) }} />
    !insideAQuestion
      ? winner
        ? // if Won the game
        <View>
          <Text style={styles.text}>Congratulations!</Text>

          <Text onPress={() => exitGame()} style={styles.Text}>Back</Text>
        </View>
        : gameOver// If lose the game
          ?
          <View >
            <Text style={styles.text}>Sorry You Lost!</Text>
            <Text style={styles.text} onPress={() => exitGame()}>Back</Text>
          </View>
          : // If room just created
          <View>
            <Button onPress={() => addPlayer() } style={styles.text} disabled={readied} title = 'press'>Press here when ready!</Button>
            
            <Text style={styles.text}>{ready}/4</Text>
            <Text style={styles.text}>{Timer}</Text>
  <Text>{'\n\n\n\n'} </Text>
  <Text style={styles.text} onPress ={() => {tempGetQuestion()}}>DEV</Text>
          </View>

      : // If the user inside a question, see what type of question and render
      currentAnswer //if true that means waiting for next question
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