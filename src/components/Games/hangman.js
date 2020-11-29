import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Alert, Button, ScrollView, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';


import img0 from "../../images/hangman0.jpg"
import img1 from "../../images/hangman1.jpg"
import img2 from "../../images/hangman2.jpg"
import img3 from "../../images/hangman3.jpg"
import img4 from "../../images/hangman4.jpg"
import img5 from "../../images/hangman5.jpg"
import img6 from "../../images/hangman6.jpg"


const Hangman = (props) => {
  const data = props.data
  const [question, setQuestion] = useState({
    question: data.question,
    attempts: data.attempts,
    answer: data.answer,
    hint: data.hint
  })
  const [mistake, setMistake] = useState(0);
  const [Guessed, setGuessed] = useState(new Set()); //use .has, .delete, and .add
  const [totalGuess, setTotalGuess] = useState(0)
  const [answer, setAnswer] = useState(question.answer)
  const defaults = {
    images: [img0, img1, img2, img3, img4, img5, img6]
  }


  function Guess() {
    return answer.split("").map(letter => (Guessed.has(letter) ? letter : ' _ '))
  }

  function generateKeyboard() {
    return "abcdefghijklmnopqrstuvwxyz".split("").map(letter => (
      <TouchableOpacity style={{
        elevation: 8,
        borderRadius: 10,
        paddingHorizontal: 12
      }}
        style={{ fontSize: 20, color: 'green' }}
        styleDisabled={{ color: 'red' }} title={letter}
        key={letter}
        value={letter}
        onPress={() => {
          setGuessed(Guessed.add(letter))
          console.log(Guessed)
          setMistake(mistake + (answer.includes(letter) ? 0 : 1))
          setTotalGuess(totalGuess + 1)
        }}
        disabled={Guessed.has(letter)}
      >

        <Text style={{
          fontSize: 18,
          color: "#fff",
          paddingVertical: 6,
          paddingHorizontal: 12,
          fontWeight: "bold",
          alignSelf: "center",
          textTransform: "uppercase"
        }}>{letter}</Text>
      </TouchableOpacity>
    ))
  }


  const GameOver = mistake >= question.attempts;
  const isWinner = Guess().join("") === answer
  let gameKeys = generateKeyboard();

  if (isWinner) {
    alert("You Won!")
    props.rightAnswer()
  }

  else if (GameOver) {
    alert("You Lost! The answer was " + answer)
    props.rightAnswer()
  }

  return (
    <View style={styles.mainView}>
      <View>
        <Text style={styles.Text}>No.{props.number + 1}</Text>
        <Text style={styles.Text}>{question.question}</Text>
        <Text style={styles.Text}>Wrong Guesses: {mistake} of {question.attempts}</Text>
      </View>

      <Image style={styles.Images} source={defaults.images[mistake]}></Image>
      <View>
        <Text style={styles.Text}>
          {!GameOver ? Guess() : answer}
        </Text>
        <View style={styles.Keyboard}>{gameKeys}</View>
        {console.log(answer)}
        <Text style={styles.Text}>Hint: {question.hint}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    marginTop: '5%',
    width: '100%',
    height: '95%',
    backgroundColor: '#2b2d40',
    justifyContent: 'space-between'
  },
  Text: {
    fontSize: 20,
    backgroundColor: '#2b2d40',
    color: 'white',
    textAlign: 'center',
    paddingBottom: 5,
  },
  Images: {
    width: 212,
    height: 230,
    alignSelf: 'center'
  },
  gameText: {
    fontSize: 20,
    flex: 1,
    padding: 10,
    backgroundColor: '#2b2d40',
    textAlign: 'center',
    color: 'white'
  },
  Keyboard: {
    flexWrap: "wrap",
    flexDirection: 'row',
    justifyContent: 'center'
  }
})
export default Hangman;