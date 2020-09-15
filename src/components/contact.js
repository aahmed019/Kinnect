import React, { useState } from 'react';
import Home from './Home'
import { StyleSheet, Text, View, Alert, Button, TouchableOpacity  } from 'react-native';
// import Button from 'apsl-react-native-button';
import InputOutline from 'react-native-input-outline';
const Contact = (props) => {
  const [back, setBack] = useState(false)
  return (
    <View>
      {
        !back
          ? <View style={styles.container}>
            
            <TouchableOpacity  onPress={() => setBack(true)} style={styles.button}><Text style ={styles.buttontext}>Back</Text></TouchableOpacity>
            <Text style={styles.title}>Contact Us</Text>

           
            <InputOutline  
            style={styles.textfeild} placeholder="Name" focusedColor='black'defaultColor='grey'/>
            <InputOutline  
            style={styles.textfeild} placeholder="Subject" focusedColor='black'defaultColor='grey'/>
            <InputOutline  
            style={styles.textfeild} placeholder="Email" focusedColor='black'defaultColor='grey'/>
            <InputOutline  
            style={styles.textbox} placeholder="Message" focusedColor='black'defaultColor='grey'/>
                        <Text>{"\n"}</Text>
       <TouchableOpacity   style={styles.submitbutton}><Text style ={styles.buttontext}>Submit</Text></TouchableOpacity>
          
          </View>
          : <Home />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2b2d40',
    alignItems: 'center',
    paddingTop: '10%',
    height: '100%',
    width: '100%',
    justifyContent: 'center'
  },
  title: {
    fontFamily: 'GillSans-Bold',
    fontSize: 50,
    paddingTop : 20,
   
    textAlign: 'center',
    color: 'white',

  },

  button: {
    alignItems: "center",
    backgroundColor: "white",
    color : "white",
    paddingLeft : 20,
    paddingRight: 20,
    paddingTop : 10,
    paddingBottom :10,
    alignSelf : 'flex-start',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff',
    
  },
  submitbutton :{
    
      alignItems: "center",
      backgroundColor: "white",
    
      paddingLeft : 20,
      paddingRight: 20,
      paddingTop : 10,
      paddingBottom :10,
      alignSelf : 'center',
      borderRadius:10,
      borderWidth: 1,
      borderColor: '#fff',
      
 
  },
  buttontext: {
    color :'black',
  },

  items: {
    fontFamily: 'AppleSDGothicNeo-UltraLight',
    fontSize: 40,
    // width: 500,
    color: 'white',
    textAlign: 'center',
  },
  textfeild :{
   width : 360,
  },
  textbox :{
    width : 360,
    height : 200,
   },
})


export default Contact;