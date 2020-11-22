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
      id: data.id,
      title: data.title,
      question: data.question,
      totalAttempts: data.totalAttempts,
      words: data.words,
    })
    const[mistake, setMistake] = useState(0);
    const[Guessed, setGuessed] = useState(new Set()); //use .has, .delete, and .add
    const[totalGuess, setTotalGuess] = useState(0)
    const[answer, setAnswer] = useState(randomword())
    const defaults= {
        images: [img0,img1,img2,img3,img4,img5,img6]
    }
    function randomword(){
      return question.words[Math.floor(Math.random() * question.words.length)].toLowerCase()
  }

    function Guess(){
        return answer.split("").map(letter => (Guessed.has(letter) ? letter : ' _ '))
    }
    
    function generateKeyboard(){
        return "abcdefghijklmnopqrstuvwxyz".split("").map(letter => (
          <TouchableOpacity style = {{
          elevation: 8,
         
          borderRadius: 10,
          
          paddingHorizontal: 12
          }}
            style={{fontSize: 20, color: 'green'}}
            styleDisabled={{color: 'red'}} title={letter}
            key={letter}
            value={letter}
            onPress= {() =>{
                setGuessed(Guessed.add(letter))
                console.log(Guessed)
                setMistake(mistake + (answer.includes(letter) ? 0 : 1))
                setTotalGuess(totalGuess+1)
            }}
            disabled={Guessed.has(letter)}
            >
                
               <Text style ={{
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
    

    const GameOver = mistake >= question.totalAttempts;
    const isWinner = Guess().join("") === answer
    let gameKeys = generateKeyboard();

    if(isWinner){
        alert("You Won!")
        props.rightAnswer()
    }

    else if(GameOver){
        alert("You Lost! The answer was "+ answer)
        props.rightAnswer()
    }

  return (
    <View style={{ backgroundColor: '#2b2d40' }}>
  <Text style={styles.Text}>{question.title}:</Text>
  <Text style={styles.Text}>{question.question}</Text>
  <Text style={styles.Text}>Wrong Guesses: {mistake} of {question.totalAttempts}</Text>
  <Text>{'\n'}</Text>
  
  <Image style={styles.Images} source={defaults.images[mistake]}></Image>
  <Text style={styles.Text}>
      {!GameOver ? Guess() : answer}
  </Text>
  <Text>{'\n'}</Text>
  <View style={styles.Keyboard}>{gameKeys}</View>
  {console.log(answer)}
  
     
    </View>
  );
}

const styles = StyleSheet.create({
    Title: {
      fontSize: 50,
      textAlign: "center",
      backgroundColor: '#2b2d40',
      color: 'white',
      
    },
    Text: {
      fontSize: 20,
      paddingTop: '10%',
      backgroundColor: '#2b2d40',
      color: 'white',
      textAlign:'center'
    },
    Images: {
      width: 212,
      height: 230,
      alignSelf:'center'
    },
    gameText: {
      fontSize: 20,
      flex: 1,
      padding: 20,
      backgroundColor: '#2b2d40',
      textAlign: 'center',
      color: 'white'
    },
    Keyboard:{
        flexWrap: "wrap",
        flexDirection:'row',
        justifyContent:'center'
    }
  })
export default Hangman;