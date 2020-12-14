import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Alert, Button, ScrollView, TextInput, KeyboardAvoidingView, SafeAreaView } from 'react-native';



const Riddle = (props) => {
  const data = props.data
  const [question] = useState({
    title: data.title,
    riddle: data.question,
    attempts: data.attempts,
    answer: data.answer,
    answerType: data.riddleType
  })

  const [mistake, setMistake] = useState(0);
  const [Guessed, setGuessed] = useState(''); //use .has, .delete, and .add

  return (
    <SafeAreaView>


      <KeyboardAvoidingView
        style={{ backgroundColor: '#2b2d40', height: '100%' }}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        key="user-input-section"
        keyboardVerticalOffset={70}
      >
        <Text style={styles.Text}>No.{props.number + 1}</Text>
        <Text style={styles.Title}>Answer This Riddle</Text>
        <View style={{ height: '60%', justifyContent: 'center' }}>
          <Text style={styles.Text}>
            {question.riddle}
          </Text>
        </View>

        <Text style={styles.gameText}>{question.attempts - mistake + 1} Attempts Left</Text>

        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: "2%", color: 'white' }}
          value={Guessed}
          onChangeText={text => setGuessed(text)}
          placeholder='Insert your answer here'
          keyboardType={question.answerType}
        >
        </TextInput>

        <Button
          title="Submit"
          onPress={() => {
            Guessed == question.answer
              ? props.rightAnswer()
              : mistake < question.attempts
                ? (setMistake(mistake + 1), alert("Wrong!"))
                : props.wrongAnswer()
          }} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainView: {
    width: '95%',
    margin: '2.5%'
  },
  Title: {
    fontSize: 35,
    textAlign: "center",
    backgroundColor: '#2b2d40',
    color: 'white',
  },
  Text: {
    fontSize: 25,
    backgroundColor: '#2b2d40',
    color: 'white',
    textAlign: 'center'
  },
  gameText: {
    fontSize: 20,
    flex: 1,
    padding: 20,
    backgroundColor: '#2b2d40',
    textAlign: 'center',
    color: 'white'
  },
  Keyboard: {
    marginTop: '5%',
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'center'
  }
})

export default Riddle;
