import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Alert, Button, SafeAreaView, TextInput } from 'react-native';
import PictureQuestion from './Games/pictureQuestion';
import Hangman from './Games/hangman';
import sampleGames from './Games/sampleQuestions.json';
import Riddle from './Games/riddle';

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

  // -------------------HELPER FUNCTIONS ------------------------
  const getQuestion = (gameID, nthQUESTION, currentANSWER) => {
    currentANSWER === true
      ?
      (
        console.log("request sent for next question"),
        // request will be sent with given information
        setQuestionData("whatever will be received"),
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
  }
  const handleWrongAnswer = () => {
    setCurrentAnswer(false)
    setInsideAQuestion(false)
    setGameOver(true)
    setCurrentAnswer(true)
    setNthQuestion(0)
    alert('Sorry You Lost!')
  }

  // tempGetQuestion is for prototype and to read data from JSON file not from backend
  const tempGetQuestion = () => {
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
            setCurrentAnswer(true),
            setNthQuestion(0))
          : (setCurrentAnswer(true),
            setNthQuestion(nthQuestion + 1),
            setQuestionData(sampleGames[nthQuestion + 1])
          )
      )
  }
  // -------------------END OF HELPER FUNCTIONS-------------------
  // -------------------RENDERING CASES---------------------------
  // Is it inside a question?
  // True => What type
  // False => Because of room just created or the game ended ?
  return (
    // <Button title="Exit" onPress={() => { setExit(true) }} />
    !insideAQuestion
      ? winner
        ? // if Won the game
        <View>
          <Text>Congratulations!</Text>
        </View>
        : gameOver// If lose the game
          ?
          <View>
            <Text>Sorry You Lost!</Text>
          </View>
          : // If room just created
          <View>
            <Text onPress={() => tempGetQuestion()}>Click Here When Ready!</Text>
          </View>
      : // If the user inside a question, see what type of question and render
      currentAnswer //if true that means waiting for next question
        ? <View>
          <Text>Loading...</Text>
          <Button title="Ready?" onPress={() => { setCurrentAnswer(false) }} />
        </View>
        :
        <View>
          {
            questionData.type == 'picture'
              ? <PictureQuestion
                data={questionData}
                rightAnswer={() => { tempHandleRightAnswer() }}
                wrongAnswer={() => { handleWrongAnswer() }} />
              : questionData.type == 'hangman'
                ? <Hangman
                  data={questionData}
                  rightAnswer={() => { tempHandleRightAnswer() }}
                  wrongAnswer={() => { handleWrongAnswer() }} />
                : questionData.type == 'riddle'
                  ? <Riddle
                    data={questionData}
                    rightAnswer={() => { tempHandleRightAnswer() }}
                    wrongAnswer={() => { handleWrongAnswer() }} />
                  : console.log('works')
          }
        </View>


    // render question from passed data in props, but for prototype we only need read from JSON
  )
}