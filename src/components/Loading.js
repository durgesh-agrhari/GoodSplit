import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Loading = () => {
  return (
    <View style={{justifyContent:'center', alignItems:'center', marginTop:30}}>
      <ActivityIndicator size='large' color='green' />
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({})