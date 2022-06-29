import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

function Weather({weather,temperature}){
    return (
        <View style={styles.weatherContainer}>
            <View style={styles.headerContainer}>
                <MaterialCommunityIcons size={48} name="weather-sunny" color={'#fff'}/>
                <Text style={styles.tempText}>{temperature}</Text>
            </View>
            <View style={styles.bodyContainer}>
                <Text style={styles.title}>{weather}</Text>
                <Text style={styles.subtitle}>Just some breezy clouds!</Text>
            </View>
        </View>
    )
}

const styles=StyleSheet.create({
weatherContainer:{
    flex:1,
    backgroundColor:'#1E90FF'
},
headerContainer:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
},
tempText:{
    fontSize:48,
    color:'#fff'
},
bodyContainer:{
    flex:2,
    alignItems:'flex-start',
    justifyContent:'flex-end',
    paddingLeft:25,
    marginBottom:40
},
title:{
    fontSize:48,
    color:'#fff'
},
subtitle:{
    fontSize:24,
    color:'#fff'
}
})

export default Weather