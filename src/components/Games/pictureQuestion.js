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
  const [userAttempts, setUserAttempts] = useState(0)
  return (
    <KeyboardAvoidingView style={styles.container}
      behavior="position">
      <Text style={styles.title}>{question.title}</Text>
      <Text style={styles.question}>{question.question}</Text>
      <ScrollView style={styles.imageArea} horizontal={true} pagingEnabled={true} >
        {
          question.images.map((item, index) => {
            return (
              <ScrollView key={index}>
                <Image
                  style={{ width: 300, height: 300 }}
                  source={{ uri: item }} />
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
        disabled={question.totalAttempts <= userAttempts ? true : false}
        onPress={() => {
          const n = userAttempts
          userAnswer == question.answer
            ? props.rightAnswer()
            : (setResult(false), setUserAttempts(n), alert("Wrong!"))
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
    width: '100%',
    backgroundColor: 'white'
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
    borderWidth: 1
  },
})