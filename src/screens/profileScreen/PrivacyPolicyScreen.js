import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Fixed the import

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* App Logo */}
      <Image
        source={require('../../assets/logo/logo.jpeg')} // replace with your actual logo path
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>Privacy & Policy</Text>

      {/* Scrollable Content */}
      <ScrollView style={styles.contentContainer} contentContainerStyle={styles.scrollPadding}>
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to GoodSplit! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our app to split expenses and track spending.
        </Text>

        <Text style={styles.sectionTitle}>2. What We Collect</Text>
        <Text style={styles.paragraph}>
          - Personal information like email and name when you sign up.{"\n"}
          - Expense details you enter, such as trip names, participants, and amounts.{"\n"}
          - Device information (non-personal) for performance monitoring and analytics.
        </Text>

        <Text style={styles.sectionTitle}>3. How We Use Your Data</Text>
        <Text style={styles.paragraph}>
          - To display and manage your trips and expense records.{"\n"}
          - To improve app performance and user experience.{"\n"}
          - We do not sell or share your personal data with third parties.
        </Text>

        <Text style={styles.sectionTitle}>4. Security</Text>
        <Text style={styles.paragraph}>
          We use secure methods to protect your data. However, no app can guarantee 100% security. We recommend using a strong password and not sharing login details.
        </Text>

        <Text style={styles.sectionTitle}>5. Your Rights</Text>
        <Text style={styles.paragraph}>
          You can view, edit, or delete your data anytime within the app. If you need help, contact our support team.
        </Text>

        <Text style={styles.sectionTitle}>6. Changes to Policy</Text>
        <Text style={styles.paragraph}>
          We may update this policy to reflect app improvements. Changes will be posted here. Please check this page occasionally.
        </Text>

        <Text style={styles.sectionTitle}>7. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions or feedback, email us at goodsplitapp@gmail.com
        </Text>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },
  logo: {
    width: 120,
    height: 60,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 20,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  scrollPadding: {
    paddingBottom: 60, // extra bottom padding
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#000',
  },
  paragraph: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
});
