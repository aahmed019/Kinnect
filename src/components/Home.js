import React, { useState } from 'react';
import Game from './game';
import About from './about';
import { StyleSheet, Text, View, Alert, Image, ImageBackground } from 'react-native';
import Lobby from './lobby';
import Contact from './contact';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from 'expo-ads-admob';

export default function App() {
  const [newRoomPage, setNewRoom] = useState(false)
  const [joinRoomPage, setJoinRoom] = useState(false)
  const [aboutPage, setAboutPage] = useState(false)
  const [contactPage, setContactPage] = useState(false)
  const [showAds, setShowAds] = useState(true)
  if (newRoomPage) {
    return (<Game style={{ alignItems: 'center' }} />)
  } else if (joinRoomPage) {
    return (<Lobby style={{ alignItems: 'center' }} />)
  } else if (contactPage) {
    return (<Contact style={{ alignItems: 'center' }} />)
  } else if (aboutPage) {
    return (<About style={{ alignItems: 'center' }} />)
  }
  else {
    return (
      <View style={styles.container}>
        <ImageBackground style={styles.backgroundImage} source={require('../images/background.png')}>
          <Text>{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}</Text>
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
          <Text style={styles.title}>Kinnect</Text>
          <Text>{"\n"}{"\n"}{"\n"}</Text>

          <Text style={styles.items} textStyle={styles.items} onPress={() => {
            setNewRoom(true)
            setJoinRoom(false)
            setAboutPage(false)
            setContactPage(false)
          }}>Create New Room</Text>
          <Text>{'\n'}</Text>
          <Text style={styles.items} textStyle={styles.items} onPress={() => {
            setNewRoom(false)
            setJoinRoom(true)
            setAboutPage(false)
            setContactPage(false)
          }}>Join A Room</Text>
          <Text>{'\n'}</Text>
          <Text style={styles.items} onPress={() => {
            setNewRoom(false)
            setAboutPage(true)
            setJoinRoom(false)
            setContactPage(false)
          }}>About Us</Text>
          <Text>{'\n'}</Text>
          <Text style={styles.items} onPress={() => {
            setNewRoom(false)
            setAboutPage(false)
            setJoinRoom(false)
            setContactPage(true)
          }}>Contact Us</Text>
          <Text>{'\n'}</Text>
          {
            showAds
              ? <Text style={{ position: 'absolute', bottom: 60 }} onPress={() => {
                setShowAds(false)
                Alert.alert('Thank You for Your Donation')
              }}>Remove Ads $0.99</Text>
              : <Text style={{ position: 'absolute', bottom: 60 }} onPress={() => {
                setShowAds(true)
                Alert.alert('Please give me your money to remove ad')
              }}>Restore Purchase</Text>
          }
        </ImageBackground>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: 'lavender',
    height: '100%',
    width: '100%',
    justifyContent: 'space-around',
  },
  adContainer: {
    width: 'auto',
    position: 'absolute',
    bottom: 0
  },
  title: {
    fontFamily: 'AmericanTypewriter-Bold',
    fontSize: 90,
    color: 'black',

  },

  items: {
    fontFamily: 'AppleSDGothicNeo-UltraLight',
    fontSize: 40,
    color: 'black',
    fontWeight: '800',
    textAlign: 'center',
    justifyContent: 'space-between'
  },

  backgroundImage: {
    width: '100%',
    height: '100%',
    alignItems: "center",
  },
});
