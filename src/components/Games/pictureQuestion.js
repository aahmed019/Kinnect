import React, { useState } from 'react';
import { StyleSheet, Text, ScrollView, Image, Alert, Button, KeyboardAvoidingView, TextInput, View } from 'react-native';
// Data needed:
// Question - Answer - attempts - hint
// Question: 
// Title
// id
// question
// pictures
// Answer: Text
// Attempts: Number 
// Hint: Text
export default function pictureQuestion(props) {
  const data = props.data
  const [question] = useState({
    question: data.question,
    answer: data.answer,
    images: data.data,
    attempts: data.attempts,
    hint: data.hint
  })
  const [userAnswer, setUserAnswer] = useState("")
  const [result, setResult] = useState(false)
  const [userAttempts, setUserAttempts] = useState(data.attempts)
  return (
    <KeyboardAvoidingView style={styles.container}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={120}
      key="user-input-section">
      <View>
        <Text style={styles.Text}>No.{props.number}</Text>
        <Text style={styles.Text}>{question.question}</Text>
      </View>

      <View style={styles.imageContainer}>
        <ScrollView
          style={styles.imageArea}
          horizontal={true}
          disableIntervalMomentum={true}
          decelerationRate={0}
          snapToInterval={300}
        >
          {
            question.images.map((item, index) => {
              console.log(item)
              return (
                <View key={index}>
                  <Image
                    style={{ width: 300, height: 300, borderWidth: 0.5, borderColor: 'black' }}
                    source={{ uri: item }} />
                </View>
              )
            })
          }
        </ScrollView>
      </View>
      <View>
        <TextInput
          style={styles.input}
          // editable={userAttempts <= question.attempts ? false : true}
          onChangeText={text => setUserAnswer(text)}
          value={userAnswer}
        />
        <Button
          title="Submit"
          onPress={() => {
            const n = userAttempts
            userAnswer == question.answer
              ? (props.rightAnswer(), console.log("question answered correctly"))
              : userAttempts !== 0
                ? (setResult(false),
                  setUserAttempts(n - 1),
                  alert("Wrong Answer"))
                : (props.wrongAnswer())
          }} />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '95%',
    marginTop: '5%',
    justifyContent: 'space-between',
  },
  keyBoardContainer: {
    flex: 1
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageArea: {
    width: 300,
    backgroundColor: 'white',
    borderColor: '#7a42f4',
    borderWidth: 1
  },
  Text: {
    fontSize: 25,
    backgroundColor: '#2b2d40',
    color: 'white',
    textAlign: 'center'
  },
  title: {
    fontSize: 30,
    color: 'yellow'
  },
  question: {
    fontSize: 15,
    color: 'white'
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 1,
    color: 'white'
  },
})