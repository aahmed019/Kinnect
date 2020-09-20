import React, { useState } from 'react';
import Home from './Home';
import data from "../games.json";
import { StyleSheet, Text, View, Image , Alert, Button, ScrollView, SafeAreaView, FlatList } from 'react-native';
// import Button from 'apsl-react-native-button';
//source={require('../images/background.png')}
const Game = (props) => {
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
                            padding: 40,
                            backgroundColor: '#2b2d40',
                            color:'white'
                        }
                    }>
                    Back
                </Text>
          {data.map((item)=>{
              return(
              <View style={styles.Games}>
                <Image
                    source={item.image}
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
                   {item.desc}
                </Text>
                </View>
           ); })}
          
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