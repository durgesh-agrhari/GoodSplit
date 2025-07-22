import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'

import { categories } from '../../constants/index'
import { addDoc } from 'firebase/firestore'
import { addGroupExpenseRef, expensesRef, GroupExpenseRef } from '../../config/firebse'
import Loading from '../../components/Loading'
import BannerAds from '../adManager/BannerAds'
const AddGroupExpenseScreen = (propes) => {
    const {id} = propes.route.params;
    const navigation = useNavigation()
    // console.log("id exp ", id)

    const [title, setTitle] = useState('')
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')
    const [loading, setLoading] = useState(false)

    const handleAddExpance = async () => {
        if (title && amount && category) {
            // console.log("click", title, amount, categories)
            setLoading(true)
            let doc = await addDoc(GroupExpenseRef, {
                title,
                amount,
                category,
                groupExpenseId: id
            });
            // console.log("doc", doc)
            setLoading(false)
            if (doc && doc.id) {
                // console.log("sucess trip add", doc, doc.id)
                navigation.goBack();
            }
        } else {
            //sow error
            Alert.alert("Title and State is required")
        }
    }
    return (
        <SafeAreaView style={{marginTop:20}} >
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name='arrow-back-outline' size={25} color='black' />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, fontWeight: '700' }}>Add Group Expances</Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../assets/sliderImage/expenseBanner.png')} style={{ width: 250, height: 220, borderRadius: 10 }} />
                </View>
                <BannerAds/>
                <View style={{ marginHorizontal: 20 }}>
                    <Text style={{ padding: 5, fontSize: 16, marginTop: 20 }}>For What ?</Text>
                    <TextInput value={title} onChangeText={value => setTitle(value)} style={{ padding: 10, borderRadius: 30, backgroundColor: '#f2f3f5', borderColor: 'gray', borderWidth: 2 }} placeholder='Enter here ...' />
                    <Text style={{ padding: 5, fontSize: 16, marginTop: 20 }} >How Much ?</Text>
                    <TextInput value={amount} onChangeText={value => setAmount(value)} style={{ padding: 10, borderRadius: 30, backgroundColor: '#f2f3f5', borderColor: 'gray', borderWidth: 2 }} placeholder='Enter here ...' />
                </View>
                <View style={{ marginHorizontal: 20 }}>
                    <Text style={{ padding: 5, fontSize: 16, marginTop: 20 }} >Category</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {
                            categories.map(cat => {
                                let bgcolor = '#bfbfbb'
                                if (cat.value == category) bgcolor = '#93e876'
                                return (
                                    <TouchableOpacity onPress={() => setCategory(cat.value)} key={cat.value} style={{ backgroundColor: bgcolor, margin: 5, padding: 5, borderRadius: 10, paddingRight: 15, paddingLeft: 15 }}>
                                        <Text>{cat.title}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </View>
                {
                    loading ? (
                        <Loading />
                    ) :
                    (
                        <TouchableOpacity onPress={handleAddExpance} style={{ backgroundColor: '#e0ca4a', marginTop: 10, padding: 10, borderRadius: 20, marginHorizontal: 20, marginTop: 30 }}>
                            <Text style={{ alignSelf: 'center' }}>Add Expance</Text>
                        </TouchableOpacity>
                    )
                }

            </View>
        </SafeAreaView>
    )
}

export default AddGroupExpenseScreen

const styles = StyleSheet.create({})