import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons  from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const AboutScreen = () => {
    const navigation = useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.container}>
         <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
        
      <Image
        source={require('../../assets/logo/logo.jpeg')} // Replace with your app icon or image
        style={styles.logo}
      />
      <Text style={styles.appName}>GoodSplit</Text>
      <Text style={styles.tagline}>Track & Split Expenses Easily</Text>

      <View style={styles.section}>
        <FontAwesome5 name="info-circle" size={20} color="#4F8EF7" />
        <Text style={styles.sectionTitle}>About the App</Text>
        <Text style={styles.description}>
          GoodSplit is a smart expense-tracking app that helps you split money with your friends and track your spending with ease. Whether you're on a trip or managing your monthly expenses, GoodSplit keeps everything organized.
        </Text>
      </View>

      <View style={styles.section}>
        <Ionicons name="checkmark-circle-outline" size={22} color="#4CAF50" />
        <Text style={styles.sectionTitle}>Key Features</Text>
        <Text style={styles.bullet}>• Split expenses in trips or groups</Text>
        <Text style={styles.bullet}>• Track your spending by category</Text>
        <Text style={styles.bullet}>• View monthly or trip-wise reports</Text>
        <Text style={styles.bullet}>• Lightweight and simple to use</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ by Team GoodSplit</Text>
      </View>
    </ScrollView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginTop: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    width: '100%',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  bullet: {
    fontSize: 16,
    color: '#444',
    paddingVertical: 4,
    paddingLeft: 10,
  },
  footer: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
  },
    backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    marginBottom:20
  },
});
