import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../../config/firebse'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../../components/Loading'
import { setUserLoading } from '../../redux/slices/UserSlice'
// import AsyncStorage from '@react-native-async-storage/async-storage';

import { db } from '../../config/firebse'
import { doc, setDoc } from 'firebase/firestore'
import { useAuth } from '../../context/AuthContext'

const SignupScreen = () => {
    const navigation = useNavigation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const { userLoading } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const { userData, userToken, login } = useAuth();


    // const handleSubmit = async () => {
    //     if (email && password && name) {
    //         try {
    //             dispatch(setUserLoading(true))
    //             const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    //             const user = userCredential.user
    //             const uid = user.uid

    //             // ✅ 1. Update Firebase Auth Profile
    //             await updateProfile(user, {
    //                 displayName: name,
    //             })

    //             // ✅ 2. Save data in Firestore
    //             await setDoc(doc(db, 'users', uid), {
    //                 displayName: name,
    //                 email,
    //                 uid,
    //                 createdAt: new Date().toISOString(),
    //             })

    //             dispatch(setUserLoading(false))
    //             console.log('Signup successful', name, email)
    //             // navigation.navigate('Splacehome')
    //         } catch (e) {
    //             dispatch(setUserLoading(false))
    //             console.log(e)
    //             Alert.alert('Signup Failed', e.message || 'Please try again')
    //         }
    //     } else {
    //         Alert.alert('All fields are required')
    //     }
    // }

    const handleSubmit = async () => {
  if (email && password && name) {
    try {
      dispatch(setUserLoading(true));

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;

      await updateProfile(user, {
        displayName: name,
      });

      await setDoc(doc(db, 'users', uid), {
        displayName: name,
        email,
        uid,
        createdAt: new Date().toISOString(),
      });

      dispatch(setUserLoading(false));

      // ✅ Reuse login function to trigger everything
      await login(email, password);

    } catch (e) {
      dispatch(setUserLoading(false));
      console.log(e);
      Alert.alert('Signup Failed', e.message || 'Please try again');
    }
  } else {
    Alert.alert('All fields are required');
  }
};


    return (
        <SafeAreaView style={{ marginTop: 20 }}>
            <ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name='arrow-back-outline' size={25} color='black' />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: '800' }}>Signup</Text>
                    <View />
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <Image source={require('../../assets/sliderImage/login.png')} style={{ width: 250, height: 220, borderRadius: 10 }} />
                </View>

                <View style={{ marginHorizontal: 20 }}>
                    <Text style={styles.label}>Enter your name</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        placeholder='Enter your name...'
                    />

                    <Text style={styles.label}>Enter your email</Text>
                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        placeholder='Enter your email...'
                        keyboardType='email-address'
                        autoCapitalize='none'
                    />

                    <Text style={styles.label}>Enter your password</Text>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                        placeholder='Enter your password...'
                        secureTextEntry
                    />
                </View>

                {
                    userLoading ? (
                        <Loading />
                    ) : (
                        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                            <Text style={{ alignSelf: 'center', fontWeight: '600' }}>Signup</Text>
                        </TouchableOpacity>
                    )
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default SignupScreen

const styles = StyleSheet.create({
    label: {
        padding: 5,
        fontSize: 16,
        marginTop: 20,
    },
    input: {
        padding: 10,
        borderRadius: 30,
        backgroundColor: '#f2f3f5',
        borderColor: 'gray',
        borderWidth: 2,
    },
    button: {
        backgroundColor: '#b1e3c2',
        marginTop: 30,
        padding: 10,
        borderRadius: 20,
        marginHorizontal: 20,
    }
})


// import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
// import React, { useState } from 'react'
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import { useNavigation } from '@react-navigation/native'
// import { createUserWithEmailAndPassword } from 'firebase/auth'
// import { auth } from '../../config/firebse'
// import { useDispatch, useSelector } from 'react-redux'
// import Loading from '../../components/Loading'
// import { setUserLoading } from '../../redux/slices/UserSlice'
// // import Snackbar from 'react-native-snackbar';
// const SignupScreen = () => {
//     const navigation = useNavigation()

//     const [email, setEmail] = useState(null)
//     const [password, setPassword] = useState(null)

//     const { userLoading } = useSelector(state => state.user)
//     const dispatch = useDispatch()

//     const handleSubmit = async () => {
//         if (email && password) {
//             //good to go
//             try {
//                 dispatch(setUserLoading(true))
//                 await createUserWithEmailAndPassword(auth, email, password)
//                 dispatch(setUserLoading(false))
//             } catch (e) {
//                 dispatch(setUserLoading(false))
//                 Alert.alert("wrong Email and password")
//             }

//             // Alert.alert("Login sucess")
//             // navigation.navigate('HomeScreen')
//         } else {
//             Alert.alert("Emailand password is required")
//             //sow error
//             // Snackbar.show({
//             //     text: 'Email and password is required',
//             //     duration: Snackbar.LENGTH_SHORT,
//             //     backgroundColor:'green'
//             // });
//         }
//     }
//     return (
//         <SafeAreaView style={{ marginTop: 20 }}>
//             <View>
//                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
//                     <TouchableOpacity onPress={() => navigation.goBack()}>
//                         <Ionicons name='arrow-back-outline' size={25} color='black' />
//                     </TouchableOpacity>
//                     <Text style={{ fontSize: 20, fontWeight: '800' }}>Signup</Text>
//                     <View></View>
//                 </View>
//                 <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
//                     <Image source={require('../../assets/sliderImage/login.png')} style={{ width: 250, height: 220, borderRadius: 10 }} />
//                 </View>
//                 <View style={{ marginHorizontal: 20 }}>
//                     <Text style={{ padding: 5, fontSize: 16, marginTop: 20 }}>Enter your email</Text>
//                     <TextInput value={email} onChangeText={value => setEmail(value)} style={{ padding: 10, borderRadius: 30, backgroundColor: '#f2f3f5', borderColor: 'gray', borderWidth: 2 }} placeholder='Enter here ...' />
//                     <Text style={{ padding: 5, fontSize: 16, marginTop: 20 }} >Enter your password</Text>
//                     <TextInput value={password} onChangeText={value => setPassword(value)} style={{ padding: 10, borderRadius: 30, backgroundColor: '#f2f3f5', borderColor: 'gray', borderWidth: 2 }} placeholder='Enter here ...' />
//                 </View>

//                  {
//                     userLoading ? (
//                         <Loading />
//                     ) : (
//                         <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: '#b1e3c2', marginTop: 10, padding: 10, borderRadius: 20, marginHorizontal: 20, marginTop: 30 }}>
//                     <Text style={{ alignSelf: 'center' }}>Signup</Text>
//                 </TouchableOpacity>
//                     )
//                 }
//             </View>
//         </SafeAreaView>
//     )
// }

// export default SignupScreen

// const styles = StyleSheet.create({})