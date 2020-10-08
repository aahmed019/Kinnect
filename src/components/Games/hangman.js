import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Alert, Button, ScrollView, SafeAreaView, FlatList } from 'react-native';
import hangmanData from './hangmanQ.json';


import img0 from "../../images/hangman0.jpg"
import img1 from "../../images/hangman1.jpg"
import img2 from "../../images/hangman2.jpg"
import img3 from "../../images/hangman3.jpg"
import img4 from "../../images/hangman4.jpg"
import img5 from "../../images/hangman5.jpg"
import img6 from "../../images/hangman6.jpg"


function randomword(){
    return hangmanData.words[Math.floor(Math.random() * hangmanData.words.length)].toLowerCase()
}

console.log(hangmanData.images[0])

const Hangman = (props) => {
    const[mistake, setMistake] = useState(0);
    const[Guessed, setGuessed] = useState(new Set()); //use .has, .delete, and .add
    const[totalGuess, setTotalGuess] = useState(0)
    const[answer, setAnswer] = useState(randomword())
    const defaults= {
        images: [img0,img1,img2,img3,img4,img5,img6]
    }
    function Guess(){
        return answer.split("").map(letter => (Guessed.has(letter) ? letter : ' _ '))
    }
    
    function generateKeyboard(){
        return "abcdefghijklmnopqrstuvwxyz".split("").map(letter => (
            <Button 
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
                
               {letter}
            </Button>
        ))
    }
    

    const GameOver = mistake >= hangmanData.totalAttempts;
    const isWinner = Guess().join("") === answer
    let gameKeys = generateKeyboard();

    if(isWinner){
        alert("You Won!")
        setMistake(0);
        setGuessed(new Set())
        setAnswer(randomword())
    }

    else if(GameOver){
        alert("You Lost! The answer was "+ answer)
        setMistake(0);
        setGuessed(new Set())
        setAnswer(randomword())
    }

  return (
    <ScrollView style={{ backgroundColor: '#2b2d40' }}>
      <Text onPress={() => props.home(false)} style={styles.Text}>Back</Text>
      <Text style={styles.Text}>{hangmanData.title}:</Text>
  <Text style={styles.Text}>{hangmanData.question}</Text>
  <Text style={styles.Text}>Wrong Guesses: {mistake} of {hangmanData.totalAttempts}</Text>
  <Text>{'\n'}</Text>
  
  <Image style={styles.Images} source={defaults.images[mistake]}></Image>

  
  <Text style={styles.Text}>
      {!GameOver ? Guess() : answer}
  </Text>
  <View style={styles.Keyboard}>{gameKeys}</View>
  <Text style={styles.Title}>{answer}{'\n\n'}</Text>
  
     
    </ScrollView>
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
      fontSize: 30,
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
        flex:1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent:'center'
    }
  })
export default Hangman;