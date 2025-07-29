import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../config/firebse'; // ✅ Correct path to your firebase.js file
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();


  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Please enter your email address');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      console.log("email", email, "auth", auth)
      Alert.alert(
        'Success',
        'Password reset email sent. Please check your inbox.'
      );
    } catch (error) {
      console.log('Password reset error:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={25} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot Password</Text>
        <View style={{ width: 25 }} /> {/* Placeholder to balance the layout */}
      </View>

      <Text style={styles.title}>Reset Your Password</Text>

      <Text style={styles.label}>Enter your registered email address</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity onPress={handlePasswordReset} style={styles.button}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>
      <Text style={{ marginTop: 20 }}>You will receive an email with a password reset link. Click the link to set a new password, and then you can log in. </Text>
    </SafeAreaView>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    marginHorizontal: 20
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  input: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f2f3f5',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#7ec8e3',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    top:-200
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },

});
