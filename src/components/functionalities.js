import React, { useState, useEffect } from 'react';
import Home from './Home'
import { StyleSheet, Text, View, Alert, Button, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';

const Functionalities = (props) => {
  const [back, setBack] = useState(false)
  //camera components 
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      {
        !back
          ? camera
            ?
            <Camera style={{ flex: 1 }} type={type}>
              <View style={styles.camera}>
                <Button style={{ fontSize: 40, textAlign: 'center' }} title='Flip Camera' onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }} />
                <Button title='Turn off Camera' onPress={() => setCamera(false)} />
              </View>
            </Camera>
            :
            <View style={styles.container}>
              <Text>{"\n"}</Text>
              <Text style={styles.title}>Functionalities</Text>
              <Text style={styles.items}> This page is to test different features that will be used in this app</Text>
              <Button title='Camera' onPress={() => setCamera(true)} />
              <Button title='Back' onPress={() => setBack(true)} />
            </View>
          :
          <Home />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingTop: '10%',
    height: '100%',
    width: '100%',
    justifyContent: 'center'
  },
  container: {
    backgroundColor: 'black',
    alignItems: 'center',
    paddingTop: '10%',
    height: '100%',
    width: '100%',
    justifyContent: 'center'
  },
  title: {
    fontFamily: 'AppleSDGothicNeo-UltraLight',
    fontSize: 60,
    paddingBottom: 60,
    textAlign: 'center',
    color: 'red',
  },
  items: {
    fontFamily: 'AppleSDGothicNeo-UltraLight',
    backgroundColor: 'black',
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
})


export default Functionalities;