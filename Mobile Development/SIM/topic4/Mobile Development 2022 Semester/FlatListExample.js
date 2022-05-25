import React, { Component } from 'react';  
import { AppRegistry, FlatList, StyleSheet, Text, View,Alert } from 'react-native';  
  
export default class FlatListBasics extends Component {  
  
    renderSeparator = () => {  
        return (  
            <View  
                style={{  
                    height: 1,  
                    width: "100%",  
                    backgroundColor: "#000",  
                }}  
            />  
        );  
    };  
    
    //handling onPress action  
    getListViewItem = (item) => {  
        Alert.alert(item.key);  
    }  
  
    render() {  
        return (  
            <View style={styles.container}>  
                <FlatList  
                    data={[  
                        {key: '1'},{key: '2'}, {key: '3'},{key: '4'},  
                        {key: '5'},{key: '6'},{key: '7'},  
                        {key: '8'},{key: '9'}, {key: '10'},  
                        {key: '11'},{key: '12'},{key: '13'},  
                        {key: '14'},{key: '15'},{key: '16'},  
                        {key: '17'}, {key: '18'},{key: '19'},  
                        {key: '20'},{key: '21'},{key: '22'}  
                    ]}  
                    renderItem={({item}) =>  
                        <Text style={styles.item}  
                              onPress={this.getListViewItem.bind(this, item)}>{item.key}</Text>}  
                    ItemSeparatorComponent={this.renderSeparator}  
                />  
            </View>  
        );  
    }  
}  
  
const styles = StyleSheet.create({  
    container: {  
        flex: 1,  
    },  
    item: {  
        padding: 10,  
        fontSize: 18,  
        height: 44,  
    },  
})  
  
  
AppRegistry.registerComponent('AwesomeProject', () => FlatListBasics);  