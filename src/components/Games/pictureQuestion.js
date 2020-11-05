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
    id: data.id,
    title: data.title,
    question: data.question,
    answer: data.answer,
    images: data.images,
    totalAttempts: data.totalAttempts,
    hint: data.hint
  })
  const [userAnswer, setUserAnswer] = useState("")
  const [result, setResult] = useState(false)
  const [userAttempts, setUserAttempts] = useState(data.totalAttempts)
  return (
    <KeyboardAvoidingView style={styles.container}
      behavior="position">
      <Text style={styles.title}>{question.title}</Text>
      <Text style={styles.question}>{question.question}</Text>
      <ScrollView style={styles.imageArea} horizontal={true} >
    
      {
          question.images.map((item, index) => {
            console.log(item)
            return (
              <ScrollView key={index} horizontal ={true}>
                <Image
                  style={{ width: 300, height: 300 }}
                  source={{uri: item}} />
              </ScrollView>
            )
          })
        }
      </ScrollView>


     

      <TextInput
        style={styles.input}
        // editable={userAttempts <= question.totalAttempts ? false : true}
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
                console.log("Wrong Answer!", n, " attempt(s) left"),
                alert("Wrong Answer"))
              : (props.wrongAnswer())
        }} />

    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: '2.5%',
    flex: 1
  },
  keyBoardContainer: {
    flex: 1
  },
  imageArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '200%',
    backgroundColor: 'white',
    borderColor: '#7a42f4',
    borderWidth: 1
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
    color:'white'
  },
})