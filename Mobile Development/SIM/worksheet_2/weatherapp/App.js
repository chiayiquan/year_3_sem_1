import React from 'react'
import { StyleSheet, Text, View, Animated } from 'react-native';
import {apiKey} from './keys/weatherAPIKey'
import Weather from './components/weather'
import Geolocation from '@react-native-community/geolocation';

export default class App extends React.Component {
  constructor(props){
    super(props);

    this.state={
      isLoading:false,
      temperature:0,
      weatherCondition:null,
      error:null
    }
  }

 fetchWeather(lat=25,lon=25){
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${apiKey}&units=metric`)
    .then(res=>res.json())
    .then(json=>{
      console.log(json)
      this.setState({temperature:json.main.temp,weatherCondition:json.weather[0].main,isLoading:false})
    })
  }
  
  componentDidMount(){
     
    Geolocation.getCurrentPosition(
position=>{this.fetchWeather(position.coords.latitude, position.coords.longitude)},
error=>{
  console.log(error)
  this.setState({error:'Error retrieving weather condition'})
}
    )
  }

  
  render(){
    const {isLoading} = this.state;
    return(
    <View style={styles.container}>
      {isLoading ? <Text>Fetching The Weather</Text>:<Weather weather={this.state.weatherCondition} temperature={this.state.temperature}/>}
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
