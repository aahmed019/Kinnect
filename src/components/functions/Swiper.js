import React from 'react';
import { StyleSheet, View, Image, ScrollView, Dimensions, Text, StatusBar, Platform } from 'react-native';


function Swiper(props) {
  const handleClick = (e, item) => {
    const { swipeBottom, swipeTop } = props
    if (e.nativeEvent.contentOffset.y < 0) {
      swipeBottom(item)
    } else {
      swipeTop(item)
    }
  }
  const { images, textSize, textColor, textBold, textUnderline, imageHeight } = props
  const height = imageHeight
  return (
    <ScrollView horizontal={true} pagingEnabled={true} >
      <ScrollView key={index} >
        <Image
          style={{ height: height, width: height }}
          source={{ uri: item.url }}
        />
      </ScrollView>
    </ScrollView>
  );
}

export default Swiper;

const styles = StyleSheet.create({
  imageText: {
    position: 'absolute',
    bottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
});