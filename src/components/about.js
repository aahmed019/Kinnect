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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in aliquam neque. Proin quis hendrerit lorem, vel molestie sapien. Vivamus blandit gravida lorem, id ultrices urna elementum vitae. Nunc rhoncus finibus pellentesque. Quisque eu auctor justo. Proin ultrices, lorem sit amet commodo finibus, turpis odio commodo orci, eu accumsan diam erat a turpis. Maecenas eu feugiat enim, id ultricies velit. Maecenas lobortis velit a cursus auctor. In luctus rhoncus purus eu auctor. Integer aliquam nibh sit amet aliquam suscipit. Vivamus dignissim eros non orci rhoncus, eu ornare urna tincidunt. Nunc et ex gravida, imperdiet odio nec, mollis sem. Donec convallis ullamcorper felis id tempor. Curabitur non ipsum dapibus, tempor elit et, iaculis ex. Pellentesque blandit egestas dui, sed placerat.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in aliquam neque. Proin quis hendrerit lorem,
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in aliquam neque. Proin quis hendrerit lorem, vel molestie sapien. Vivamus blandit gravida lorem, id ultrices urna elementum vitae. Nunc rhoncus finibus pellentesque. Quisque eu auctor justo. Proin ultrices, lorem sit amet commodo finibus, turpis odio commodo orci, eu accumsan diam erat a turpis. Maecenas eu feugiat enim, id ultricies velit. Maecenas lobortis velit a cursus auctor. In luctus rhoncus purus eu auctor. Integer aliquam nibh sit amet aliquam suscipit. Vivamus dignissim eros non orci rhoncus, eu ornare urna tincidunt. Nunc et ex gravida, imperdiet odio nec, mollis sem. Donec convallis ullamcorper felis id tempor. Curabitur non ipsum dapibus, tempor elit et, iaculis ex. Pellentesque blandit egestas dui, sed placerat.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in aliquam neque. Proin quis hendrerit lorem,
          
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

})


export default Support;