import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, Button, ScrollView } from 'react-native';
import data from '../lobby.json';
import GameRoom from './gameRoom';
const Lobby = (props) => {
  const [startGame, setStartGame] = useState(false)
  const [inGame, setInGame] = useState(false)
  return (
    !startGame
      ?
      <View style={styles.container}>
        <Button title="Back" onPress={() => props.home(false)} style={styles.backButton} />

        <ScrollView style={styles.lobby}>
          <Text style={styles.title}>
            Lobbies
      </Text>

          {/* this part will be replace with data loaded from backend, each game should have their own Unique ID, so when pressed, the ID is sent to retrieve game information */}

          {/* QUESTION 1: SHOULD PLAYER BE ABLE TO REJOIN THE GAME IF THE APPLICATION CRASHED? If so we need a new wireframe for that page
QUETION2 : .... */}

          {
            data.map((item) => {
              return (
                <View style={styles.singleGame}>
                  <Button
                    style={styles.text}
                    title={item.name}
                    onPress={
                      () => {
                        (
                          setStartGame(true),
                          setInGame(true),
                          console.log("Button Pressed!")
                        )
                      }
                    } />
                  <Text style={styles.text}>{item.desc}</Text>
                  <Text style={styles.text}>{item.playercount}</Text>
                </View>
              );
            })
          }
        </ScrollView>
      </View>
      :
      <View style={styles.container}>
        <Button title="Exit" onPress={() => props.home(false)} style={styles.backButton} />
        <ScrollView style={styles.lobby}>
          <GameRoom />
        </ScrollView>
      </View>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: 'orange',
    borderWidth: 2,
    backgroundColor: '#2b2d40'
  },
  lobby: {
    flex: 1,
    borderColor: 'orange',
    borderWidth: 2,
    backgroundColor: '#2b2d40'
  },
  singleGame: {
    flex: 1,
    flexDirection: "row",
    paddingBottom: '5%',
    borderColor: 'yellow',
    borderWidth: 2,
    backgroundColor: '#2b2d40'
  },
  title: {
    fontSize: 50,
    textAlign: "center",
    backgroundColor: '#2b2d40',
    color: 'white',
    paddingBottom: '10%',
  },
  backButton: {
    fontSize: 20,
    paddingBottom: '10%',
    justifyContent: 'flex-start',
    backgroundColor: '#2b2d40',
    color: 'white'
  },
  text: {
    fontSize: 20,
    flex: 1,
    padding: 20,
    backgroundColor: '#2b2d40',
    textAlign: 'center',
    color: 'white'
  }
})

export default Lobby;