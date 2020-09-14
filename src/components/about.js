import React, { useState } from 'react';
import Home from './Home'
import { StyleSheet, Text, View, Alert, Button , TouchableOpacity } from 'react-native';
import { TextButton, RaisedTextButton } from 'react-native-material-buttons';
// import Button from 'apsl-react-native-button';

const Support = (props) => {
  const [back, setBack] = useState(false)
  return (
    <View>
      {
        !back
          ? <View style={styles.container}>
            
            <Text style={styles.title}>About Us</Text>
            <Text>{"\n"}</Text>
            <Text style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in aliquam neque. Proin quis hendrerit lorem, vel molestie sapien. Vivamus blandit gravida lorem, id ultrices urna elementum vitae. Nunc rhoncus finibus pellentesque. Quisque eu auctor justo. Proin ultrices, lorem sit amet commodo finibus, turpis odio commodo orci, eu accumsan diam erat a turpis. Maecenas eu feugiat enim, id ultricies velit. Maecenas lobortis velit a cursus auctor. In luctus rhoncus purus eu auctor. Integer aliquam nibh sit amet aliquam suscipit. Vivamus dignissim eros non orci rhoncus, eu ornare urna tincidunt. Nunc et ex gravida, imperdiet odio nec, mollis sem. Donec convallis ullamcorper felis id tempor. Curabitur non ipsum dapibus, tempor elit et, iaculis ex. Pellentesque blandit egestas dui, sed placerat.
             {"\n"}Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in aliquam neque. Proin quis hendrerit lorem,</Text>
             <TouchableOpacity
        style={styles.button}
        onPress={() => setBack(true)}   
      >
        <Text style={styles.buttontext}>back</Text>
      </TouchableOpacity>
      <Text>{"\n"}</Text>
          </View>
          : <Home />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: '10%',
    height: '100%',
    width: '100%',
    justifyContent: 'center'
  },
  title: {
    fontFamily: 'GillSans-Bold',
    fontSize: 60,
    paddingTop : 20,
   
    textAlign: 'center',
    color: 'black',

  },
  button: {
    alignItems: "center",
    backgroundColor: "red",
    color : "white",
    paddingLeft : 20,
    paddingRight: 20,
    paddingTop : 10,
    paddingBottom :10,
   
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff',
    
  },
  buttontext: {
    color :'white',
  },
  text : {
    color : 'red',
    fontFamily : 'Gill Sans', 
    fontSize : 20,
    paddingLeft : 25,
    paddingRight : 25,
    paddingBottom: 60,
    
  },

  items: {
    fontFamily: 'AppleSDGothicNeo-UltraLight',
    fontSize: 40,
    // width: 500,
    color: 'white',
    textAlign: 'center',
    
  },
})


export default Support;