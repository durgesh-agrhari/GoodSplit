import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Splash = () => {
  const navigation = useNavigation();

  // Animations
  const logoScale = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    // Run animations
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslate, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Navigate after delay
    const timeout = setTimeout(() => {
      navigation.navigate('BottomTab');
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.Image
        source={require('../../assets/logo/logo.png')}
        style={[
          styles.logo,
          {
            transform: [{ scale: logoScale }],
          },
        ]}
        resizeMode="contain"
      />
      <Animated.Text
        style={[
          styles.text,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslate }],
          },
        ]}
      >
        GoodSplit
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#189439',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 20,
    marginBottom: 20,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'System',
  },
});

export default Splash;


// import React, { useEffect } from 'react';
// import { View, StyleSheet, StatusBar, Text } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Video from 'react-native-video';
// import { Image } from 'react-native/types_generated/index';

// const Splash = () => {
//   const navigation = useNavigation();

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       navigation.navigate('BottomTab');
//     }, 3000);

//     return () => clearTimeout(timeout); // Cleanup on unmount
//   }, []);

//   return (
//     <View
//       style={styles.container}
//     >
//       <StatusBar hidden /> 
//       <Image
//         source={require('../../assets/logo/logo.jpeg')}
//         style={StyleSheet.absoluteFill}/>
//         <Text>GoodSplit</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor:'green'
//   },
// });

// export default Splash;

