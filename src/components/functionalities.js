import React, { useState, useEffect } from 'react';
import Home from './Home';
import {
  StyleSheet, Text, View, Alert, Button, TouchableOpacity, Switch, KeyboardAvoidingView,
  TextInput, Keyboard, Platform, TouchableWithoutFeedback,
} from 'react-native';
import { Camera } from 'expo-camera';

import Fire from '../../firebaseConfig';
// GAMES FORMAT
// description: ....
// name: ...
// trials :: number of questions
// trials collection
// in each game will have "trials collection" of question
// in "trials" collection will have list of challenges
// -------------------------
// CHALLENGE FORMAT
// question: description
// answer: answer of the challenge
// attempt: number of attempts
// hint: hint
// type: question type
// data: list of data required for this type
const Functionalities = (props) => {
  // const [back, setBack] = useState(false)
  //camera components 
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(false);
  const [gamePage, setGamePage] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [loading, setLoading] = useState(true);
  // CREATE / MODIFY GAME COMPONENT
  // IF click to Create new game
  // will be ask for "GAME FORMAT"
  const [newGame, setNewGame] = useState(false); // is creating new game?
  const [gameData, setGameData] = useState({}); // current selected game data / use to store data of new  game before pushing
  const [gameDataID, setGameDataID] = useState(""); // use as documentID
  const [numberOfQuestions, setNumberOfQuestions] = useState(0);
  // CLICK BACK WILL SET EVERYTHING EMPTY
  // GENERATE CHALLENGE FORMAT for "numberOfQuestion" times
  // after each time will push into current "questionList"
  const [editQuestionPage, setEditQuestionPage] = useState(false);
  const [question, setQuestion] = useState({});
  const [questionsList, setQuestionsList] = useState([]);
  // submit button will push everything into the database
  //-------------------------READ AND CREATE GAME COMPONENTS-------------------------
  const [data, setData] = useState([]);
  const ref = Fire.db.getCollection('games');
  const snapshotToObject = (snapshot) => {
    const returnArray = []
    snapshot.forEach(doc => {
      var tempObject = {};
      // var temp = doc.data();
      tempObject["DOC_ID"] = doc.id;
      tempObject["DOC_DATA"] = doc.data();
      returnArray.push(tempObject);
    })
    console.log('TYPE OF RETURNARRAY', typeof (returnArray))
    console.log(returnArray)
    return returnArray;
  }
  const fetchData = async () => {
    var tempArrary = []
    ref.get()
      .then((snapshot) => {
        tempArrary = snapshotToObject(snapshot);
        setData(tempArrary);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error retrieving data: ", error)
        setLoading(true)
      })

  };
  const addData = async () => {
    await ref.doc(gameDataID).set(gameData).then(res => alert("Game Added Successfully!")).catch(err => console.log("Error adding new data", err))
  }

  const addNewKeyValueGameData = (key, value) => {
    var tempObject = gameData;
    tempObject[key] = value;
    setGameData(tempObject);
    console.log(tempObject);
  }
  const addNewKeyValueQuestionData = (key, value) => {
    var tempQuestion = question;
    tempQuestion[key] = value;
    setQuestion(tempQuestion);
  }
  //-------------------------READ AND CREATE GAME COMPONENTS-------------------------

  const cameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  }

  // useEffect(() => {
  //   fetchData();
  // }, []);


  return (
    <View>
      {
        camera
          ?
          <Camera type={type}>
            <View style={styles.camera}>
              <Button style={{ fontSize: 40, textAlign: 'center' }} title='Flip Camera' onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }} />
              <Button title='Turn off Camera' onPress={() => setCamera(false)} />
            </View>
          </Camera>
          : gamePage // game page
            ? loading // if loading => error
              ?
              <View>
                <Text>LOADING ...</Text>
                <Button title='Back to Functionalities' onPress={() => { setGamePage(false) }} />
              </View>
              : newGame
                ?
                <View style={styles.gamePageContainer}>
                  <Text style={styles.pageTitle}>CREATE NEW GAME</Text>
                  {
                    !editQuestionPage
                      // --------------------GENERAL INFORMATION OF GAME--------------------
                      ?
                      <KeyboardAvoidingView
                        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                        key="user-input-section">
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                          <View style={styles.inner}>
                            <Text style={styles.header}>GAME'S INFO</Text>
                            <View style={styles.inputBox}>
                              <TextInput placeholder="Name of The Game"
                                multiline={true}
                                style={styles.textInput}
                                onChangeText={value => {
                                  addNewKeyValueGameData("name", value), setGameDataID(value.split(" ").join(""))
                                }} />
                            </View>
                            <View style={styles.inputBox}>
                              <TextInput placeholder="Game's Description"
                                multiline={true}
                                style={styles.textInput}
                                onChangeText={(value) => {
                                  addNewKeyValueGameData("description", value)
                                }} />

                            </View>
                            <View style={styles.inputBox}>
                              <TextInput placeholder="Number of Players"
                                multiline={true}
                                keyboardType={'numeric'}
                                style={styles.textInput}
                                onChangeText={(value) => {
                                  addNewKeyValueGameData("numOfPlayers", value)
                                }} />
                            </View>
                            <View style={styles.inputBox}>
                              <TextInput placeholder="Number of Questions"
                                multiline={true}
                                keyboardType={'numeric'}
                                style={styles.textInput}
                                onChangeText={(value) => {
                                  addNewKeyValueGameData("numOfQuestions", value),
                                    setNumberOfQuestions(value)
                                }} />
                            </View>
                            <View>
                              <Text>{gameData.name}</Text>
                              <Text>{gameData.description}</Text>
                            </View>

                            <View style={styles.btnContainer}>
                              <Button title="Next" onPress={() => {
                                addData(),
                                  setEditQuestionPage(true)
                              }
                              } />
                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                      </KeyboardAvoidingView>
                      :
                      // --------------------QUESTION'S DATA SECTION--------------------
                      <KeyboardAvoidingView
                        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                        key="user-input-section">
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                          <View style={styles.inner}>
                            <Text style={styles.header}>QUESTION'S INFO</Text>
                            <View style={styles.inputBox}>
                              <TextInput placeholder="Question"
                                multiline={true}
                                style={styles.textInput}
                                onChangeText={value => {
                                  addNewKeyValueGameData("name", value)
                                }} />
                            </View>
                            <View style={styles.inputBox}>
                              <TextInput placeholder="Answer"
                                multiline={true}
                                style={styles.textInput}
                                onChangeText={(value) => {
                                  addNewKeyValueGameData("description", value)
                                }} />

                            </View>
                            <View style={styles.inputBox}>
                              <TextInput placeholder="Attempts"
                                keyboardType={'numeric'}
                                style={styles.textInput}
                                onChangeText={(value) => {
                                  addNewKeyValueGameData("numOfPlayers", value)
                                }} />
                            </View>
                            <View style={styles.inputBox}>
                              <TextInput placeholder="Hint"
                                multiline={true}
                                style={styles.textInput}
                                onChangeText={(value) => {
                                  addNewKeyValueGameData("numOfQuestions", value),
                                    setNumberOfQuestions(value)
                                }} />
                            </View>
                            <View>
                              <Text>{gameData.name}</Text>
                              <Text>{gameData.description}</Text>
                            </View>

                            <View style={styles.btnContainer}>
                              <Button title="Next" onPress={() => null} />

                            </View>
                          </View>
                        </TouchableWithoutFeedback>
                        <Button title="BACK" onPress={() => setEditQuestionPage(false)} />
                      </KeyboardAvoidingView>
                  }


                  <Button title="Back To Games Page" onPress={() => { setNewGame(false) }} />
                </View>

                :  // else successfully retrieve data from FireStore
                <View style={styles.gamePageContainer}>
                  <Text style={styles.pageTitle}>Game Page</Text>
                  <View key="second-section">
                    <Text style={styles.subHeader}>Available Games</Text>
                    {data.map((item, idx) => {
                      return (
                        <View key={idx}>
                          <Text>{item.DOC_ID} - {item.DOC_DATA.name}</Text>
                        </View>
                      )
                    })}
                  </View>
                  <View key="third-section">
                    <Button style={styles.subHeader} title="Create New Game" onPress={() => { setNewGame(true) }} />
                  </View>
                  <Button title='Back to Functionalities' onPress={() => { setGamePage(false) }} />
                </View>
            :

            <View style={styles.container}>
              <Text>{"\n"}</Text>
              <Text style={styles.title}>Functionalities</Text>
              <Text style={styles.items}> This page is to test different features that will be used in this app</Text>
              <Button title='Camera' onPress={() => {
                setCamera(true),
                  cameraPermission()
              }} />
              <Button title='Create New Game' onPress={async () => {
                setGamePage(true), fetchData()
              }} />
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.items}>Sound Effect </Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={props.soundFx ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={props.setSoundFx}
                  value={props.soundFx}
                />
              </View>

              <Button title='Back' onPress={() => props.home(false)} />
            </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingTop: '10%',
    height: '100%',
    width: '100%',
    justifyContent: 'center'
  },
  container: {
    backgroundColor: 'black',
    alignItems: 'center',
    paddingTop: '10%',
    height: '100%',
    width: '100%',
    justifyContent: 'center'
  },
  horizontalContainer: {

  },
  title: {
    fontFamily: 'AppleSDGothicNeo-UltraLight',
    fontSize: 60,
    paddingBottom: 60,
    textAlign: 'center',
    color: 'red',
  },
  items: {
    fontFamily: 'AppleSDGothicNeo-UltraLight',
    backgroundColor: 'black',
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  // CREAT NEW GAME PAGE STYLES
  gamePageContainer: {
    alignItems: 'center',
    backgroundColor: 'yellow',
    height: '100%',
    justifyContent: 'space-between'
  },
  pageTitle: {
    fontSize: 35
  },
  subHeader: {
    fontSize: 25
  },
  // NEW GAME STYLES
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 50,
    width: '80%',
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
  inputBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputTitle: {
    width: '35%',
    fontSize: 14,
    marginRight: 5,
    marginBottom: 36,
  }

})


export default Functionalities;