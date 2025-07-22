import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { categoryBg } from '../../theme'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const GroupExpanceCard = ({ item, onDelete }) => {
    console.log("item ", item.id, item)
    return (
        <SafeAreaView>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 10,
                backgroundColor: categoryBg[item.category],
                margin: 5,
                padding: 10,
                borderRadius: 10
            }} >
                <View>
                    <Text>{item.title}</Text>
                    <Text>{item.category}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text>₹ {item.amount}</Text>
                    <TouchableOpacity
                        style={{
                            marginLeft: 10,
                            padding: 8,
                            backgroundColor: 'green',
                            borderRadius: 50
                        }}
                        onPress={() => onDelete(item.id)} // ✅ trigger delete
                    >
                        <MaterialIcons name="delete-outline" size={20} color='white' />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default GroupExpanceCard

const styles = StyleSheet.create({})


// import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React from 'react'
// import { categoryBg } from '../../theme'
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// const ExpanceCard = ({ item }) => {
//     return (
//         <SafeAreaView>
//             <View style={{flexDirection:'row', justifyContent:'space-between', marginHorizontal:10, backgroundColor: categoryBg[item.category], margin:5, padding:10, borderRadius:10}} >
//             <View>
//                 <Text>{item.title}</Text>
//                 <Text>{item.category}</Text>
//             </View>
//             <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
//                 <Text >₹ {item.amount}</Text>
//                 <TouchableOpacity style={{marginLeft:10, padding:8, backgroundColor:'green', borderRadius:50}} >
//                 <MaterialIcons name="delete-outline" size={20} color='white' />
//                 </TouchableOpacity>
//             </View>
//             </View>
//         </SafeAreaView>
//     )
// }

// export default ExpanceCard

// const styles = StyleSheet.create({})