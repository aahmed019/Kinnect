import React, { useState } from 'react';
import Game from './newGame';
import About from './about';
import Functionalities from './functionalities';
import { StyleSheet, Text, View, Alert, Image, ImageBackground } from 'react-native';
import Lobby from './lobby';
import Contact from './contact';

import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from 'expo-ads-admob';
import { Audio } from 'expo-av';
// import Hangman from './Games/hangman';



export default function App() {
  const [newRoomPage, setNewRoom] = useState(false)
  const [joinRoomPage, setJoinRoom] = useState(false)
  const [aboutPage, setAboutPage] = useState(false)
  const [contactPage, setContactPage] = useState(false)
  const [showAds, setShowAds] = useState(true)
  const [testingPage, setTestingPage] = useState(false)
  const [soundEffect, setSoundEffect] = useState(true)
  const [music, setMusic] = useState(true)
  const handlePlay = async () => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require('../media/onClick.mp3'));
      { shouldPlay: true }
      soundEffect
        ? soundObject.playAsync()
        : null
    } catch (error) {
      console.log(error);
    }
  }
  if (newRoomPage) {
    return (<Game
      style={{ alignItems: 'center' }}
      home={setNewRoom} />)
  } else if (joinRoomPage) {
    return (<Lobby
      style={{ alignItems: 'center' }}
      home={setJoinRoom} />)
  } else if (contactPage) {
    return (<Contact
      style={{ alignItems: 'center' }}
      home={setContactPage} />)
  } else if (aboutPage) {
    return (<About
      style={{ alignItems: 'center' }}
      home={setAboutPage} />)
  } else if (testingPage) {
    return (<Functionalities
      style={{ alignItems: 'center' }}
      setSoundFx={setSoundEffect}
      soundFx={soundEffect}
      home={setTestingPage} />)
  }
  else {
    return (
      <View style={styles.container}>

        {showAds
          ? <AdMobBanner
            style={styles.adContainer}
            bannerSize="fullBanner"
            adUnitID="ca-app-pub-3940256099942544/2934735716" // Test ID, Replace with your-admob-unit-id
            testDeviceID="EMULATOR"
            servePersonalizedAds // true or false
            onDidFailToReceiveAdWithError={(e) => { console.log(e) }} />
          : console.log("no ads")
        }
        <View style={styles.titleContainer}><Text style={styles.title}>Kinnect</Text></View>
        <View style={styles.itemsContainer}>


          <Text style={styles.items} textStyle={styles.items} onPress={() => {
            handlePlay()
            setNewRoom(true)
            setJoinRoom(false)
            setAboutPage(false)
            setContactPage(false)
            setTestingPage(false)
          }}>Create New Room</Text>

          <Text style={styles.items} textStyle={styles.items} onPress={() => {
            handlePlay()
            setNewRoom(false)
            setJoinRoom(true)
            setAboutPage(false)
            setContactPage(false)
            setTestingPage(false)
          }}>Join A Room</Text>

          <Text style={styles.items} onPress={() => {
            handlePlay()
            setNewRoom(false)
            setAboutPage(true)
            setJoinRoom(false)
            setContactPage(false)
            setTestingPage(false)
          }}>About Us</Text>

          <Text style={styles.items} onPress={() => {
            handlePlay()
            setNewRoom(false)
            setAboutPage(false)
            setJoinRoom(false)
            setContactPage(true)
            setTestingPage(false)
          }}>Contact Us</Text>
          <Text style={styles.items} onPress={() => {
            handlePlay()
            setNewRoom(false)
            setAboutPage(false)
            setJoinRoom(false)
            setContactPage(false)
            setTestingPage(true)
          }}>Functionalities</Text>
          {/* <Text>{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}</Text> */}
          {
            showAds
              ? <Text style={styles.items} onPress={() => {
                setShowAds(false)
                handlePlay()
                Alert.alert('Thank You for Your Donation')
                console.log("remove ads pressed")
              }}>Remove Ads $0.99</Text>
              : <Text style={styles.items} onPress={() => {
                setShowAds(true)
                handlePlay()
                Alert.alert('Please give me your money to remove ad')
              }}>Restore Purchase</Text>
          }
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#2b2d40',
    height: '100%',
    width: '100%',
  },
  adContainer: {
    width: 'auto',
    position: 'absolute',
    bottom: 0,
  },
  titleContainer: {
    height: '30%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'yellow',
    borderWidth: 5
  },
  itemsContainer: {
    display: 'flex',
    height: '50%',
    width: '100%',
    justifyContent: 'space-around',
    borderColor: 'orange',
    borderWidth: 5
  },
  title: {
    fontFamily: 'AppleSDGothicNeo-Light',
    fontSize: 80,
    color: 'white',
  },

  items: {
    fontFamily: 'AppleSDGothicNeo-UltraLight',
    fontSize: 30,
    color: 'white',
    fontWeight: '300',
    textAlign: 'center',
    justifyContent: 'space-between'
  },

  backgroundImage: {
    width: '100%',
    height: '100%',
    alignItems: "center",
  },
});
