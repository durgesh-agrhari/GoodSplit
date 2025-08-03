import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import Ionicons from 'react-native-vector-icons/Ionicons'
// import EmpityList from './EmpityList'
import randemImage from '../../assets/sliderImage/randemImage'
// import ExpanceCard from './ExpanceCard'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { deleteDoc, getDocs, query, where, doc } from 'firebase/firestore'
import { addGroupExpenseRef, expensesRef, GroupExpenseRef } from '../../config/firebse'
import BannerAds from '../adManager/BannerAds'
import EmpityList from '../homeScreen/EmpityList'
import ExpanceCard from '../homeScreen/ExpanceCard'
import GroupExpanceCard from './ExpanceCard'


const GroupExpanseScreen = (props) => {
  // console.log("propes", props)
  const { id, title, place} = props.route.params;
  const navigation = useNavigation()
  const [expenses, setExpenses] = useState([])
  const [total, setTotal] = useState(0);

  const isFocused = useIsFocused()

  const fetchExpences = async () => {
    const q = query(GroupExpenseRef, where("groupExpenseId", "==", id));
    const querySnapsot = await getDocs(q);
    let data = [];
    let sum = 0;

    querySnapsot.forEach(doc => {
      const item = { ...doc.data(), id: doc.id };
      data.push(item);

      const numericAmount = parseFloat(item.amount);
      if (!isNaN(numericAmount)) {
        sum += numericAmount;
      }
    });

    setExpenses(data);
    setTotal(sum);
  };
  // console.log("data expences", expenses)
  useEffect(() => {
    if (isFocused)
      fetchExpences();
  }, [isFocused])


  const handleDeleteExpense = async (expenseId) => {
    try {
      await deleteDoc(doc(GroupExpenseRef, expenseId));
      setExpenses(prev => prev.filter(item => item.id !== expenseId));

      // Recalculate total
      const updatedExpenses = expenses.filter(item => item.id !== expenseId);
      const updatedTotal = updatedExpenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      setTotal(updatedTotal);
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  return (
    <SafeAreaView style={{ marginTop: 20 }}>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name='arrow-back-outline' size={25} color='black' />
          </TouchableOpacity>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '700' }}>Group Name : {title}</Text>
            {/* <Text style={{ fontSize: 12, fontWeight: '500', opacity: 0.6 }}>{title}</Text> */}
          </View>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
          <Image source={require('../../assets/sliderImage/1.png')} style={{ width: 250, height: 220, borderRadius: 10 }} />
        </View>
        <BannerAds />
        <View style={{ marginHorizontal: 10, marginTop: 10, alignItems: 'center', backgroundColor: '#cef0d7', padding: 5, borderRadius: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#2f3640' }}>
            Total Spent: ₹{total.toFixed(2)}
          </Text>
        </View>


        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 20, paddingBottom: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Group Expenses</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddGroupExpenseScreen', { id, title })} style={{ backgroundColor: '#dcdde1ff', borderRadius: 15, padding: 5, paddingLeft: 15, paddingRight: 15 }}>
            <Text>Add Expanse</Text>
          </TouchableOpacity>
        </View>
       
        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 10, paddingBottom: 20 }}>
        
          <FlatList
            data={expenses}
            ListEmptyComponent={EmpityList()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <GroupExpanceCard item={item} onDelete={handleDeleteExpense} />
            )}
            keyExtractor={(item) => item.id}
          />

        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default GroupExpanseScreen
const CIRCLE_SIZE = 28;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#fff',
    marginTop: 2,
    marginLeft: 40
  },
  circle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    opacity: 0.9,
  },
})