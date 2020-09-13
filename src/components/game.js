import React, { useState } from 'react';
import Home from './Home';
import { StyleSheet, Text, View, Image , Alert, Button, ScrollView, SafeAreaView, FlatList } from 'react-native';
// import Button from 'apsl-react-native-button';
//source={require('../images/background.png')}
const Game = (props) => {
  const [back, setBack] = useState(false)
  const [game, setGame] = useState([
    {name: 'game1', key: '1'},
    {name: 'game2', key: '2'},
    {name: 'game3', key: '3'},
    {name: 'game4', key: '4'},
  ])
  return (
    <View>
      {
        !back
          ? 
          
          <ScrollView style={{backgroundColor:'#2b2d40'}}> 
          
                <Text onPress={() => setBack(true)}
                    style={
                        {
                            fontSize: 30,
                            padding: 40,
                            backgroundColor: '#2b2d40',
                            color:'white'
                        }
                    }>
                    Back
                </Text>
                <Text
                    style={
                        {
                            fontSize: 40,
                            padding: 20,
                            backgroundColor: '#2b2d40',
                            textAlign:'center',
                            color:'white'
                        }
                    }>
                    Games
                </Text>
                <View style={styles.Games}>
                
                
                <Image
                    source={require('../images/background.png')}
                    style={
                        {
            
                            width: 212,
                            height: 212
                        }
                    }
                    >
                      
                </Image>

                <Text
                    style={
                        {
                          fontSize: 20,
                          flex:1,
                          padding: 20,
                          backgroundColor: '#2b2d40',
                          textAlign:'center',
                          color:'white'
                        }
                    }>
                    This is the game where you look at the color yellow
                </Text>
                </View>
                <View style={styles.Games}>
                
                
                <Image
                    source={require('../images/background.png')}
                    style={
                        {
            
                            width: 212,
                            height: 212
                        }
                    }
                    >
                      
                </Image>

                <Text
                    style={
                        {
                          fontSize: 20,
                          flex:1,
                          padding: 20,
                          backgroundColor: '#2b2d40',
                          textAlign:'center',
                          color:'white'
                        }
                    }>
                    This is the game where you look at the color yellow
                </Text>

                </View>
                <View style={styles.Games}>
                
                
                <Image
                    source={require('../images/background.png')}
                    style={
                        {
            
                            width: 212,
                            height: 212
                        }
                    }
                    >
                      
                </Image>

                <Text
                    style={
                        {
                          fontSize: 20,
                          flex:1,
                          padding: 20,
                          backgroundColor: '#2b2d40',
                          textAlign:'center',
                          color:'white'
                        }
                    }>
                    This is the game where you look at the color yellow
                </Text>

                </View>
                <View style={styles.Games}>
                
                
                <Image
                    source={require('../images/background.png')}
                    style={
                        {
            
                            width: 212,
                            height: 212
                        }
                    }
                    >
                      
                </Image>

                <Text
                    style={
                        {
                          fontSize: 20,
                          flex:1,
                          padding: 20,
                          backgroundColor: '#2b2d40',
                          textAlign:'center',
                          color:'white'
                        }
                    }>
                    This is the game where you look at the color yellow
                </Text>

                </View>
                <View style={styles.Games}>
                
                
                <Image
                    source={require('../images/background.png')}
                    style={
                        {
            
                            width: 212,
                            height: 212
                        }
                    }
                    >
                      
                </Image>

                <Text
                    style={
                        {
                          fontSize: 20,
                          flex:1,
                          padding: 20,
                          backgroundColor: '#2b2d40',
                          textAlign:'center',
                          color:'white'
                        }
                    }>
                    This is the game where you look at the color yellow
                </Text>

                </View>
                <View style={styles.Games}>
                
                
                <Image
                    source={require('../images/background.png')}
                    style={
                        {
            
                            width: 212,
                            height: 212
                        }
                    }
                    >
                      
                </Image>

                <Text
                    style={
                        {
                          fontSize: 20,
                          flex:1,
                          padding: 20,
                          backgroundColor: '#2b2d40',
                          textAlign:'center',
                          color:'white'
                        }
                    }>
                    This is the game where you look at the color yellow
                </Text>

                </View>
                
            </ScrollView>
          : <Home/> 
      }
    </View>
  );
}
const styles = StyleSheet.create({
  Games:{
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap"
  },
})
export default Game;