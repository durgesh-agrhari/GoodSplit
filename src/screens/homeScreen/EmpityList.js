import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const EmpityList = () => {
    return (
        <View style={{justifyContent:'center', alignItems:'center'}}>
            <Image source={require('../../assets/sliderImage/empty.png')} style={{ width: 200, height: 200, borderRadius: 20 }} />
            <Text style={{ alignSelf: 'center', fontSize: 15, opacity:0.6 }}>You have't recorded any trip yet</Text>
        </View>
    )
}

export default EmpityList

const styles = StyleSheet.create({})