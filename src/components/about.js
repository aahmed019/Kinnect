import React, { useState } from 'react';
import Home from './Home'
import { StyleSheet, Text, View, Alert, Button , TouchableOpacity } from 'react-native';

// import Button from 'apsl-react-native-button';

const Support = (props) => {
  const [back, setBack] = useState(false)
  return (
    <View>
      {
        !back
          ? <View style={styles.container}>
           
             <Text>{"\n"}</Text>
             <Button style={styles.button} title='Back' onPress={() => setBack(true)} />
           <Text style={styles.title}>About Us</Text>
            <Text>{"\n"}</Text>
            <Text style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in aliquam neque. Proin quis hendrerit lorem, vel molestie sapien. Vivamus blandit gravida lorem, id ultrices urna elementum vitae. Nunc rhoncus finibus pellentesque. Quisque eu auctor justo. Proin ultrices, lorem sit amet commodo finibus, turpis odio commodo orci, eu accumsan diam erat a turpis. Maecenas eu feugiat enim, id ultricies velit. Maecenas lobortis velit a cursus auctor. In luctus rhoncus purus eu auctor. Integer aliquam nibh sit amet aliquam suscipit. Vivamus dignissim eros non orci rhoncus, eu ornare urna tincidunt. Nunc et ex gravida, imperdiet odio nec, mollis sem. Donec convallis ullamcorper felis id tempor. Curabitur non ipsum dapibus, tempor elit et, iaculis ex. Pellentesque blandit egestas dui, sed placerat.
             {"\n"}Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in aliquam neque. Proin quis hendrerit lorem,</Text>
             
      <Text>{"\n"}</Text>
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
    paddingTop: 30,
    paddingLeft : 25,
    paddingRight : 25,
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
  buttontext: {
    color :'white',
  },
  text : {
    color : 'white',
    fontFamily : 'Gill Sans', 
    fontSize : 20,
    
    paddingBottom: 60,
    
  },

  
})


export default Support;