import React, { useState } from 'react';
import Home from './Home'
import { StyleSheet, Text, View, TouchableOpacity , TextInput } from 'react-native';

const Contact = (props) => {
  const [back, setBack] = useState(false)
  
  return (
    <View>
      {
        !back
          ? <View style={styles.container}>
            
            <TouchableOpacity  onPress={() => setBack(true)} style={styles.button}><Text style ={styles.buttontext}>Back</Text></TouchableOpacity>
            <Text style={styles.title}>Contact Us</Text>
           
            <Text style={styles.tag}>Name:</Text>
            <TextInput style={ styles.textfeild } />
            <Text style={styles.tag}>Email:</Text>
            <TextInput  style={ styles.textfeild } />
            <Text style={styles.tag}>Subject:</Text>
            <TextInput  style={ styles.textfeild } />
            <Text style={styles.tag}>Message:</Text>
            <TextInput  style={ styles.textbox } />
            <Text></Text>

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
  tag:{
    color:"white",
     alignSelf : 'flex-start',
     paddingLeft: 40,
     fontSize: 20,
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
    height: 40,
    width: 360, 
    backgroundColor:'white'
  },
  textbox :{
    width : 360,
    height : 200,
    backgroundColor:'white'
   },
})


export default Contact;