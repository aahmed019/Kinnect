import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Alert, Button, ScrollView, TextInput} from 'react-native';



 const Riddle = (props) => {
    const[mistake, setMistake] = useState(0);
    const[Guessed, setGuessed] = useState(''); //use .has, .delete, and .add
    const[answer] = useState('red')
    const[totalGuess, setTotalGuess] = useState(0)
    const defaults= {
        maxWrong: 3,
        riddleText: true,
        riddle: 'what color is a firetruck?'
    }
    
    function riddleType(){
        return defaults.riddleText? 'text':'numeric'
    }


    const GameOver = mistake >= defaults.maxWrong;

  return (
<ScrollView style={{ backgroundColor: '#2b2d40' }}>
    <Text onPress={() => props.home(false)} style={styles.Text}>Back</Text>
    <Text style={styles.Text}>Wrong Guesses: {mistake} of {defaults.maxWrong}</Text>
    <Text>{'\n'}</Text>
  

    <Text style={styles.Text}>Answer the riddle:</Text>
    <Text style={styles.Text}>
        {defaults.riddle}
    </Text>
    <View style={styles.Keyboard}></View>
    <TextInput
    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
    onChangeText={text => setGuessed(text.toLowerCase())}
    value={Guessed}
    placeholder='Insert your answer here'
    keyboardType={riddleType()}
    >

    </TextInput>
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

  export default Riddle;
