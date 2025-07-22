import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import Loading from '../../components/Loading'
import { addDoc } from 'firebase/firestore'
import { addgroupRef, tripsRef } from '../../config/firebse'
import { useSelector } from 'react-redux'
import { useAuth } from '../../context/AuthContext'
import BannerAds from '../adManager/BannerAds'
const AddGroupScreen = () => {
    const navigation = useNavigation()

    const [groupName, setGroupName] = useState('')
    const { userData} = useAuth();
    const [loading, setLoading] = useState(false)
    const {user} = useSelector(state=> state.user)

    const handleAddTrip = async() => {
        if (groupName) {
            // console.log("click", user.uid, place, countery)
            setLoading(true)
            let doc = await addDoc(addgroupRef,{
                groupName,
                userId: userData.uid
            });
            // console.log("doc", doc)
            setLoading(false)
            if(doc && doc.id){
                // console.log("sucess trip add", doc, doc.id)
                navigation.goBack();
            }
        } else {
            //sow error
            Alert.alert("Title and State is required")
        }
    }
    return (
        <SafeAreaView style={{marginTop:20}}>
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name='arrow-back-outline' size={25} color='black' />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, fontWeight: '700' }}>Create New Group</Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom:15 }}>
                    <Image source={require('../../assets/sliderImage/trip.png')} style={{ width: 250, height: 220, borderRadius: 10 }} />
                </View>
                <BannerAds/>
                <View style={{ marginHorizontal: 20 }}>
                    <Text style={{ padding: 5, fontSize: 16, marginTop: 20 }}>Group name</Text>
                    <TextInput value={groupName} onChangeText={value => setGroupName(value)} style={{ padding: 10, borderRadius: 30, backgroundColor: '#f2f3f5', borderColor: 'gray', borderWidth: 2 }} placeholder='Enter here group name ...' />
                    {/* <Text style={{ padding: 5, fontSize: 16, marginTop: 20 }} >other info</Text>
                    <TextInput value={countery} onChangeText={value => setCountery(value)} style={{ padding: 10, borderRadius: 30, backgroundColor: '#f2f3f5', borderColor: 'gray', borderWidth: 2 }} placeholder='Enter here ...' /> */}

                </View>
                {
                    loading ? (
                        <Loading />
                    ) :
                        (
                            <TouchableOpacity onPress={handleAddTrip} style={{ backgroundColor: '#e0ca4a', marginTop: 10, padding: 10, borderRadius: 20, marginHorizontal: 20, marginTop: 30 }}>
                                <Text style={{ alignSelf: 'center' }}>Create Group</Text>
                            </TouchableOpacity>
                        )
                }

            </View>
        </SafeAreaView>
    )
}

export default AddGroupScreen

const styles = StyleSheet.create({})