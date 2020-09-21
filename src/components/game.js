import React, { useState } from 'react';
import Home from './Home';
import data from "../games.json";
import { StyleSheet, Text, View, Image, Alert, Button, ScrollView, SafeAreaView, FlatList } from 'react-native';
// import Button from 'apsl-react-native-button';
//source={require('../images/background.png')}
const Game = (props) => {
  const [back, setBack] = useState(false)

  return (
    <View>
      {
        !back
          ?
          <ScrollView style={{ backgroundColor: '#2b2d40' }}>
            <Text onPress={() => setBack(true)} style={style.Text}>Back</Text>
            <Text style={style.Titles}>Games</Text>
            {data.map((item) => {
              return (
                <View style={styles.Games}>
                  <Image source={{ uri: item.image }} style={style.images} />
                  <Text
                    style={style.gameText}>
                    {item.desc}{'\n'}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
          : <Home />
      }
    </View>
  );
}
const styles = StyleSheet.create({
  Games: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: '20%',
  },
  Title: {
    fontSize: 50,
    textAlign: "center",
    backgroundColor: '#2b2d40',
    color: 'white',
    paddingBottom: '10%',
  },
  Text: {
    fontSize: 30,
    padding: 30,
    paddingTop: '20%',
    backgroundColor: '#2b2d40',
    color: 'white'
  },
  Images: {
    width: 212,
    height: 212
  },
  gameText: {
    fontSize: 20,
    flex: 1,
    padding: 20,
    backgroundColor: '#2b2d40',
    textAlign: 'center',
    color: 'white'
  }
})
export default Game;