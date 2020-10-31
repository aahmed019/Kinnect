import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import Fire from '../../firebaseConfig';

export default function retrieve(){

    const gamesList = useRef(null)


    useEffect(() =>{
        Games = Fire.db
        var tempData = []
        Games.getRef("games/").on("child_added", data => {
          var key = data.key
          var value = data.val();
          tempData.push({ key: key, value: value })
          gamesList.current = tempData
        })
        
        //var gamess = Fire.db.getRef("games/")
      })

      return(
          <View>
              {}
          </View>
      )



}