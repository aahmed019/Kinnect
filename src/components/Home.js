import React, { useState } from 'react';
import Game from './game';
import About from './about';
import { StyleSheet, Text, View, Alert, Image, ImageBackground } from 'react-native';
import Instructions from './instructions';
import Support from './support';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from 'expo-ads-admob';

// const image = { uri: 'https://www.srqmagazine.com/_images/images/srqdaily/content/20200131231349718.png' }
export default function App() {
  const [readyPage, setReady] = useState(false)
  const [instructionPage, setInstruction] = useState(false)
  const [supportPage, setSupport] = useState(false)
  const [aboutPage, setAboutPage] = useState(false)
  const [showAds, setShowAds] = useState(true)
  if (readyPage) {
    return (<Game style={{ alignItems: 'center' }} />)
  } else if (instructionPage) {
    return (<Instructions style={{ alignItems: 'center' }} />)
  } else if (supportPage) {
    return (<Support style={{ alignItems: 'center' }} />)
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
            setReady(true)
            setInstruction(false)
            setSupport(false)
            setAboutPage(false)
          }}>Play</Text>
          <Text>{'\n'}</Text>
          <Text style={styles.items} textStyle={styles.items} onPress={() => {
            setReady(false)
            setInstruction(true)
            setSupport(false)
            setAboutPage(false)
          }}>Instructions</Text>
          <Text>{'\n'}</Text>
          <Text style={styles.items} onPress={() => {
            setReady(false)
            setInstruction(false)
            setSupport(true)
            setAboutPage(false)
          }}>Support</Text>
          <Text>{'\n'}</Text>
          <Text style={styles.items} onPress={() => {
            setReady(false)
            setAboutPage(true)
            setInstruction(false)
            setSupport(false)
          }}>About Us</Text>
          <Text>{'\n'}</Text>
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
