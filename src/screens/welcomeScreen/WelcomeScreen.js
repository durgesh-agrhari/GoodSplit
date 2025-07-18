import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const WelcomeScreen = () => {
    const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View>
        <View style={{justifyContent:'center', alignItems:'center'}}>
            <Image source={require('../../assets/sliderImage/welcome.png')} style={{height:350, width:350, marginTop:30, borderRadius:20, marginBottom:30}} />
        </View>
        <View style={{marginHorizontal:30}}>
            <Text style={{alignSelf:'center', fontSize:30, fontWeight:'bold', marginBottom:50}}>GoodSplit</Text>
            <TouchableOpacity onPress={()=> navigation.navigate('Signin')} style={{backgroundColor:'#8acfa1', padding:10, borderRadius:20}}>
                <Text style={{alignSelf:'center', color:'white', fontWeight:'800', fontSize:18}}>Signin</Text>
            </TouchableOpacity>
             <TouchableOpacity onPress={()=> navigation.navigate('Signup')}  style={{backgroundColor:'#8acfa1', padding:10, borderRadius:20, marginTop:20}}>
                <Text style={{alignSelf:'center', color:'white', fontWeight:'800', fontSize:18}}>Signup</Text>
            </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({})

// backgroundColor:'#b1e3c2'