import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/Loading';
import { addDoc } from 'firebase/firestore';
import { feedbackRef } from '../../config/firebse';
import { useSelector } from 'react-redux';

const FeedbackScreen = () => {
  const navigation = useNavigation();

  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(state => state.user);

  const handleSendFeedback = async () => {
    if (description.trim()) {
      setLoading(true);
      let doc = await addDoc(feedbackRef, {
        description,
        userId: user.uid,
        createdAt: new Date()
      });
      setLoading(false);
      if (doc && doc.id) {
        Alert.alert("Thank you for your feedback!");
        navigation.goBack();
      }
    } else {
      Alert.alert("Please enter your feedback");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={25} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Feedback</Text>
        </View>

        <View style={styles.logoContainer}>
          <Image source={require('../../assets/sliderImage/f.png')} style={styles.logo} />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Tell us what you think</Text>
          <TextInput
            value={description}
            onChangeText={value => setDescription(value)}
            multiline
            numberOfLines={5}
            style={styles.input}
            placeholder="Write your feedback here..."
          />
        </View>

        {loading ? (
          <Loading />
        ) : (
          <TouchableOpacity onPress={handleSendFeedback} style={styles.button}>
            <Text style={styles.buttonText}>Send Feedback</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} /> {/* Bottom Padding */}
      </View>
    </SafeAreaView>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  safe: {
    marginTop: 20,
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 220,
    borderRadius: 10,
    marginTop: 10,
  },
  form: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  label: {
    padding: 5,
    fontSize: 16,
    marginBottom: 10,
  },
input: {
  padding: 10,
  borderRadius: 20,
  backgroundColor: '#f2f3f5',
  borderColor: 'gray',
  borderWidth: 2,
  textAlignVertical: 'top',
  height: 120, // More space for multiline input (around 4+ lines)
},

  button: {
    backgroundColor: '#98e7b5ff',
    padding: 12,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 30,
  },
  buttonText: {
    alignSelf: 'center',
    fontWeight: '600',
  },
});
