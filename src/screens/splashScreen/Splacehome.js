import {StyleSheet, Text, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import BottomTab from '../../components/BottomTab';
import Splash from './Splash';


const Splacehome = () => {
  const [isSplace, setIsSplace] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsSplace(false);
    }, 2000);
  });
  return <>{isSplace ? <Splash /> : <BottomTab />}</>;
};

export default Splacehome;

const styles = StyleSheet.create({});