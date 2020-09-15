import React, { useState } from 'react';
import Game from './game';
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

export default function App() {
  const [newRoomPage, setNewRoom] = useState(false)
  const [joinRoomPage, setJoinRoom] = useState(false)
  const [aboutPage, setAboutPage] = useState(false)
  const [contactPage, setContactPage] = useState(false)
  const [showAds, setShowAds] = useState(true)
  const [testingPage, setTestingPage] = useState(false)
  if (newRoomPage) {
    return (<Game style={{ alignItems: 'center' }} />)
  } else if (joinRoomPage) {
    return (<Lobby style={{ alignItems: 'center' }} />)
  } else if (contactPage) {
    return (<Contact style={{ alignItems: 'center' }} />)
  } else if (aboutPage) {
    return (<About style={{ alignItems: 'center' }} />)
  } else if (testingPage) {
    return (<Functionalities style={{ alignItems: 'center' }} />)
  }
  else {
    return (
      <View style={styles.container}>
        <Text>{"\n"}{"\n"}{"\n"}</Text>
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
        <Text>{"\n"}</Text>

        <Text style={styles.items} textStyle={styles.items} onPress={() => {
          setNewRoom(true)
          setJoinRoom(false)
          setAboutPage(false)
          setContactPage(false)
          setTestingPage(false)
        }}>Create New Room</Text>

        <Text style={styles.items} textStyle={styles.items} onPress={() => {
          setNewRoom(false)
          setJoinRoom(true)
          setAboutPage(false)
          setContactPage(false)
          setTestingPage(false)
        }}>Join A Room</Text>

        <Text style={styles.items} onPress={() => {
          setNewRoom(false)
          setAboutPage(true)
          setJoinRoom(false)
          setContactPage(false)
          setTestingPage(false)
        }}>About Us</Text>

        <Text style={styles.items} onPress={() => {
          setNewRoom(false)
          setAboutPage(false)
          setJoinRoom(false)
          setContactPage(true)
          setTestingPage(false)
        }}>Contact Us</Text>
        <Text style={styles.items} onPress={() => {
          setNewRoom(false)
          setAboutPage(false)
          setJoinRoom(false)
          setContactPage(false)
          setTestingPage(true)
        }}>Functionalities</Text>
        <Text>{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}{'\n'}</Text>
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
    justifyContent: 'space-around',
  },
  adContainer: {
    width: 'auto',
    position: 'absolute',
    bottom: 0
  },
  title: {
    fontFamily: 'AppleSDGothicNeo-Light',
    fontSize: 80,
    color: 'white',
    textAlign: 'center',
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
