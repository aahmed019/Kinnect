import React, { useState } from 'react';
import Home from './Home';
import { StyleSheet, Text, View, Alert, Button, ScrollView } from 'react-native';
import data from "../lobby.json";

const Lobby = (props) => {
  const [back, setBack] = useState(false)
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
                            padding: 30,
                            paddingTop:'20%',
                            backgroundColor: '#2b2d40',
                            color:'white'
                        }
                    }>
                    Back
                </Text>

                <Text
                    style={
                        {
                            fontSize: 50,
                            textAlign:"center",
                            backgroundColor: '#2b2d40',
                            color:'white',
                            paddingBottom: '10%',
                        }
                    }>
                    Lobbies
                </Text>

          {data.map((item)=>{
              return(
              <View style={styles.lobby}>
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
                   {item.name}
                </Text>

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
                   {item.desc}
                </Text>
                
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
                   {item.playercount}
                </Text>


                </View>
           ); })}
          
            </ScrollView>
          : <Home />
      }
    </View>
  );
}
const styles = StyleSheet.create({
  lobby:{
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom:'20%',
  },
})

export default Lobby;