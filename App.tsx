import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppNavigator from './src/navigation/AppNavigator'
import { Provider } from 'react-redux'
import { store } from './src/redux/Store'
import { AuthProvider } from './src/context/AuthContext'

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppNavigator/>
      </AuthProvider>
    </Provider>
)
}

export default App

const styles = StyleSheet.create({})