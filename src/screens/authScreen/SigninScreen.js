import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../config/firebse'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../../components/Loading'
import { setUserLoading } from '../../redux/slices/UserSlice'
const SigninScreen = () => {
    const navigation = useNavigation()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { userLoading } = useSelector(state => state.user)
    const dispatch = useDispatch()

    const handleSubmit = async () => {
        if (email && password) {
            try {
                dispatch(setUserLoading(true))
                await signInWithEmailAndPassword(auth, email, password)
                dispatch(setUserLoading(false))
                navigation.navigate('BottomTab')
            } catch (e) {
                dispatch(setUserLoading(false))
                Alert.alert("wrong Email and password")
            }

        } else {
            //sow error
            Alert.alert("Email and password is required")
        }
    }
    return (
        <SafeAreaView style={{ marginTop: 20 }}>
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name='arrow-back-outline' size={25} color='black' />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: '800' }}>Signin</Text>
                    <View></View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <Image source={require('../../assets/sliderImage/login.png')} style={{ width: 250, height: 220, borderRadius: 10 }} />
                </View>
                <View style={{ marginHorizontal: 20 }}>
                    <Text style={{ padding: 5, fontSize: 16, marginTop: 20 }}>Enter your email</Text>
                    <TextInput value={email} onChangeText={value => setEmail(value)} style={{ padding: 10, borderRadius: 30, backgroundColor: '#f2f3f5', borderColor: 'gray', borderWidth: 2 }} placeholder='Enter here ...' />
                    <Text style={{ padding: 5, fontSize: 16, marginTop: 20 }} >Enter your password</Text>
                    <TextInput value={password} onChangeText={value => setPassword(value)} style={{ padding: 10, borderRadius: 30, backgroundColor: '#f2f3f5', borderColor: 'gray', borderWidth: 2 }} placeholder='Enter here ...' />
                    <TouchableOpacity>
                        <Text style={{ padding: 5, fontSize: 14, marginTop: 20, color: '#4625d9' }} >Forget password ?</Text>
                    </TouchableOpacity>
                </View>
                {
                    userLoading ? (
                        <Loading />
                    ) : (
                        <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: '#b1e3c2', marginTop: 10, padding: 10, borderRadius: 20, marginHorizontal: 20, marginTop: 30 }}>
                            <Text style={{ alignSelf: 'center' }}>Login</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        </SafeAreaView>
    )
}

export default SigninScreen

const styles = StyleSheet.create({})