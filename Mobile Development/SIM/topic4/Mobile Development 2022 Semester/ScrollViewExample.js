import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, ScrollView } from 'react-native';

class ScrollViewExample extends Component {
   state = {
      names: [
         {'name': 'A', 'id': 1},
         {'name': 'B', 'id': 2},
         {'name': 'C', 'id': 3},
         {'name': 'D', 'id': 4},
         {'name': 'E', 'id': 5},
         {'name': 'F', 'id': 6},
         {'name': 'G', 'id': 7},
         {'name': 'H', 'id': 8},
         {'name': 'I', 'id': 9},
         {'name': 'J', 'id': 10},
         {'name': 'K', 'id': 11},
         {'name': 'L', 'id': 12}
      ]
   }
   render() {
      return (
         <View>
            <ScrollView>
               {
                  this.state.names.map((item, index) => (
                     <View key = {item.id} style = {styles.item}>
                        <Text>{item.name}</Text>
                     </View>
                  ))
               }
            </ScrollView>
         </View>
      )
   }
}
export default ScrollViewExample

const styles = StyleSheet.create ({
   item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 30,
      margin: 2,
      borderColor: '#2a4944',
      borderWidth: 1,
      backgroundColor: '#d2f7f1'
   }
})