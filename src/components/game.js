import React, { useState } from 'react';
import Home from './Home';
import { StyleSheet, Text, View, Image , Alert, Button, ScrollView, SafeAreaView, FlatList } from 'react-native';
// import Button from 'apsl-react-native-button';

const Game = (props) => {
  const [back, setBack] = useState(false)
  const [game, setGame] = useState([
    {name: 'game1', key: '1'},
    {name: 'game2', key: '2'},
    {name: 'game3', key: '3'},
    {name: 'game4', key: '4'},
  ])
  return (
    <View >
      {
        !back
          ? 
          <ScrollView style={styles.container} disableScrollViewPanResponder={true} >
          <Text style={styles.title}> Games </Text>
          <Text>{"\n"}</Text>
          <Button textStyle={styles.items} title='BACK' onPress={() => setBack(true)} />
      
          <Image style={styles.GameImage} source={require('../images/background.png')}></Image>
          <Text >{"\n"}</Text>
          <Text style={styles.items}>Game 1</Text>
          <Text>{"\n"}</Text>

          <Image style={styles.GameImage} source={require('../images/background.png')}></Image>
          <Text >{"\n"}</Text>
          <Text style={styles.items}>Game 2</Text>
          <Text>{"\n"}</Text>

          <Image style={styles.GameImage} source={require('../images/background.png')}></Image>
          <Text >{"\n"}</Text>
          <Text style={styles.items}>Game 3</Text>
          <Text>{"\n"}</Text>

          <Image style={styles.GameImage} source={require('../images/background.png')}></Image>
          <Text >{"\n"}</Text>
          <Text style={styles.items}>Game 4</Text>
          <Text>{"\n"}</Text>
          </ScrollView>
          
        


          : <Home/> 
      }
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2b2d40',
    //alignItems: 'center',
    paddingTop: '30%',
    height: '600%',
    width: '100%',
    //justifyContent: 'center'
  },
  contain:{
    flex: 1,
    
  },

  title: {
    fontFamily: 'AppleSDGothicNeo-UltraLight',
    fontSize: 60,
    paddingBottom: 60,
    textAlign: 'center',
    color: 'white',
  },

  items: {
    fontFamily: 'AppleSDGothicNeo-UltraLight',
    fontSize: 40,
    color: 'white',
    textAlign: 'center',
  },
  GameImage:{
    height: '30%',
    width: '60%',
    
  }
})
export default Game;