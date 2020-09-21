import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, Button, ScrollView } from 'react-native';
import data from "../lobby.json";

const Lobby = (props) => {
  return (
    <ScrollView style={{ backgroundColor: '#2b2d40' }}>
      <Text onPress={() => props.home(false)} style={styles.backButton}>
        Back
      </Text>
      <Text style={styles.title}>
        Lobbies
      </Text>

      {data.map((item) => {
        return (
          <View style={styles.lobby}>
            <Text
              style={
                {
                  fontSize: 20,
                  flex: 1,
                  padding: 20,
                  backgroundColor: '#2b2d40',
                  textAlign: 'center',
                  color: 'white'
                }
              }>
              {item.name}
            </Text>
            <Text
              style={
                {
                  fontSize: 20,
                  flex: 1,
                  padding: 20,
                  backgroundColor: '#2b2d40',
                  textAlign: 'center',
                  color: 'white'
                }
              }>
              {item.desc}
            </Text>

            <Text
              style={
                {
                  fontSize: 20,
                  flex: 1,
                  padding: 20,
                  backgroundColor: '#2b2d40',
                  textAlign: 'center',
                  color: 'white'
                }
              }>
              {item.playercount}
            </Text>


          </View>
        );
      })}

    </ScrollView>
  );
}
const styles = StyleSheet.create({
  lobby: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: '20%',
  },
  title: {
    fontSize: 50,
    textAlign: "center",
    backgroundColor: '#2b2d40',
    color: 'white',
    paddingBottom: '10%',
  },
  backButton: {
    fontSize: 30,
    padding: 30,
    paddingTop: '20%',
    backgroundColor: '#2b2d40',
    color: 'white'
  }
})

export default Lobby;