import React, { useState } from 'react';
import Home from './Home';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
// import Button from 'apsl-react-native-button';

const Lobby = (props) => {
  const [back, setBack] = useState(false)
  return (
    <View>
      {
        !back
          ? <View style={styles.container}>
            <Text>{"\n"}</Text>
            <Text style={styles.title}>VROOXMS</Text>
            <Button textStyle={styles.items} title='BACK' onPress={() => setBack(true)} />
          </View>
          : <Home />
      }
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    alignItems: 'center',
    paddingTop: '10%',
    height: '100%',
    width: '100%',
    justifyContent: 'center'
  },
  title: {
    fontFamily: 'AppleSDGothicNeo-UltraLight',
    fontSize: 50,
    paddingBottom: 60,
    textAlign: 'center',
    color: 'red',
  },

  items: {
    fontFamily: 'AppleSDGothicNeo-UltraLight',
    fontSize: 30,
    // width: 500,
    color: 'white',
    textAlign: 'center',
  },
})

export default Lobby;