import {StyleSheet, Text, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import Splash from './Splash';
import WelcomeScreen from '../welcomeScreen/WelcomeScreen';


const Splacehomeblogin = () => {
  const [isSplace, setIsSplace] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsSplace(false);
    }, 2000);
  });
  return <>{isSplace ? <Splash /> : <WelcomeScreen />}</>;
};

export default Splacehomeblogin;

const styles = StyleSheet.create({});