import React, { useState } from 'react';
import Home from './Home'
import { StyleSheet, Text, ScrollView, Alert, Button, TouchableOpacity, SafeAreaView, Image, View } from 'react-native';

// import Button from 'apsl-react-native-button';

const Support = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{
        minHeight: '10%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
      }}>
        <TouchableOpacity
          onPress={() => props.home(false)}
          style={styles.backButtonArea}>
          <Image style={styles.backButtonImage} source={require('../images/back.png')} />
        </TouchableOpacity>
        <Text style={styles.title}>About Us</Text>
      </View>
      <ScrollView style={{ maxHeight: '90%', paddingHorizontal: '5%' }}>
        <Text style={styles.text}>
          <Text style={styles.textTitle}>
            Ali Ahmed {"&"} Lam Tran {"\n"}- Project Owner {"&"} Scrum Master {"\n"}
          </Text>

          Determine Number of Pages. Design Each Page (Code)! Then Connect Them Together. Handle Data from Mock API/.JSON files  {"\n"} {"\n"}
          <Text style={styles.textTitle}>
            Aqsa Malik - Graphic Designer {"\n"}
          </Text>
          Come up with the layout of game. Created the wireframe in Adobe Xd. Collaborative and effective design process. User friendly app. {"\n"} {"\n"}
          <Text style={styles.textTitle}>
            Jose Vargas - Story Teller {"\n"}
          </Text>
          Find/Create a story or riddle that would serve as the Game’s main objective. Include/Design challenging yet entertaining, multiplayer co-op mini games. Research mobile devices’ input capabilities. Research open-source libraries that provide an interface to access and implement such input capabilities.Design mini games that incorporate creative input controls.

        </Text>
      </ScrollView>
    </SafeAreaView>


  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2b2d40',
    alignItems: 'center',
    minHeight: '100%',
    width: '100%',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'GillSans-Bold',
    fontSize: 40,
    color: 'white',
    width: '100%',
    textAlign: 'center',
  },
  backButtonArea: {
    position: 'absolute',
    start: '2%',
    zIndex: 99
  },
  backButtonImage: {
    width: 40,
    height: 40
  },
  buttontext: {
    color: 'white',
  },
  text: {
    color: 'white',
    fontFamily: 'Gill Sans',
    fontSize: 20,
  },
  textTitle: {
    fontWeight: '500',
    fontSize: 25,
    color: 'white',
    fontFamily: 'Gill Sans',
  }
})


export default Support;