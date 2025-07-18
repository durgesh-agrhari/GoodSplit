import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../config/firebse'; // adjust path if needed
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScree = () => {
  const navigation = useNavigation();
  const user = auth.currentUser;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: async () => {
          await auth.signOut();
          navigation.replace('LoginScreen'); // adjust if your login screen name differs
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* 👤 Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: user?.photoURL || 'https://cdn-icons-png.freepik.com/512/4122/4122901.png' }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{user?.displayName || 'User Name'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* 📋 Options */}
      <View style={styles.optionList}>
        <OptionItem icon="information-circle-outline" label="About" onPress={() => navigation.navigate('AboutScreen')} />
        <OptionItem icon="lock-closed-outline" label="Privacy Policy" onPress={() => navigation.navigate('PrivacyPolicyScreen')} />
        <OptionItem icon="star-outline" label="Rate GoodSplit" onPress={() => {}} />
        <OptionItem icon="chatbox-ellipses-outline" label="Feedback or Suggestion" onPress={() => navigation.navigate('FeedbackScreen')} />
      </View>

      {/* 🚪 Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const OptionItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.optionItem} onPress={onPress}>
    <Icon name={icon} size={22} color="#555" />
    <Text style={styles.optionText}>{label}</Text>
  </TouchableOpacity>
);

export default ProfileScree;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  optionList: {
    marginTop: 20,
    gap: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    elevation: 2,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  logoutBtn: {
    marginTop: 'auto',
    marginBottom: 40,
    backgroundColor: '#ff4d4f',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
