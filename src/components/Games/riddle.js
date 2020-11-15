import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Alert, Button, ScrollView, TextInput} from 'react-native';



 const Riddle = (props) => {
  const data = props.data
  const [question] = useState({
    id: data.id,
    title: data.title,
    riddle: data.question,
    totalAttempts: data.totalAttempts,
    answer: data.answer,
    answerType: data.riddleType
  })

    const[mistake, setMistake] = useState(0);
    const[Guessed, setGuessed] = useState(''); //use .has, .delete, and .add
    const[Winner, setWinner] = useState(false)
    const GameOver = mistake >= question.totalAttempts;
    

    if(GameOver){
      alert("You Lost, the answer was" + answer)
      props.rightAnswer()
    }
    if(Winner){
      props.rightAnswer()
    }

  return (
<ScrollView style={{ backgroundColor: '#2b2d40' }}>
    <Text style={styles.Text}>Wrong Guesses: {mistake} of {question.totalAttempts}</Text>
    <Text>{'\n'}</Text>
  

    <Text style={styles.Text}>Answer the riddle:</Text>
    <Text style={styles.Text}>
        {question.riddle}
    </Text>
    <View style={styles.Keyboard}></View>
    <TextInput
    style={{ height: 40, borderColor: 'gray', borderWidth: 1, color:'white'}}
    value={Guessed}
    onChangeText={text => setGuessed(text)}
    placeholder='Insert your answer here'
    keyboardType={question.answerType}
    >
    </TextInput>
    <Button
        title="Submit"
        disabled={question.totalAttempts <= mistake ? true : false}
        onPress={() => {
          Guessed == question.answer
            ? setWinner(true)
            : (setMistake(mistake+1), alert("Wrong!"))
        }} />
    <Text style={styles.Title}>{question.answer}{'\n\n'}</Text>
    
     
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

  export default Riddle;
