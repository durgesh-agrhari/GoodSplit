import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import randemImage from '../../assets/sliderImage/randemImage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { addgroupRef, auth, expensesRef, tripsRef } from '../../config/firebse';
import { useSelector } from 'react-redux';
import { deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import BannerAds from '../adManager/BannerAds';
import EmpityList from '../homeScreen/EmpityList';

const { width } = Dimensions.get('window');

const GroupScreen = () => {
  const { userData } = useAuth();
  const navigation = useNavigation();
  const [trips, setTrips] = useState([]);
  const [tripTotals, setTripTotals] = useState({});
  const [totalSpent, setTotalSpent] = useState(0);

  const isFocused = useIsFocused();

  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [viewMembersModalVisible, setViewMembersModalVisible] = useState(false);
  const [members, setMembers] = useState([
    { name: 'John Doe', phone: '9999999999' },
    { name: 'Jane Smith', phone: '8888888888' },
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');

  const confirmDeleteTrip = (tripId) => {
    Alert.alert(
      "Delete Group",
      "Are you sure you want to delete this Group?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => handleDeleteTrip(tripId) }
      ]
    );
  };

  const fetchTrip = async () => {
    const q = query(addgroupRef, where("userId", "==", userData.uid));
    const querySnapshot = await getDocs(q);
    let grandTotal = 0;
    let totals = {};
    let tripData = [];

    for (const doc of querySnapshot.docs) {
      const trip = { ...doc.data(), id: doc.id };
      tripData.push(trip);

      const expenseQuery = query(expensesRef, where("tripId", "==", trip.id));
      const expenseSnapshot = await getDocs(expenseQuery);

      let total = 0;
      expenseSnapshot.forEach(exp => {
        const amount = parseFloat(exp.data().amount?.toString().replace(/[^0-9.]/g, '')) || 0;
        total += amount;
      });

      totals[trip.id] = total;
      grandTotal += total;
    }

    setTrips(tripData);
    setTripTotals(totals);
    setTotalSpent(grandTotal);
  };

  useEffect(() => {
    if (isFocused) fetchTrip();
  }, [isFocused]);

  const handleDeleteTrip = async (tripId) => {
    try {
      await deleteDoc(doc(tripsRef, tripId));
      const updatedTrips = trips.filter(t => t.id !== tripId);
      setTrips(updatedTrips);

      const updatedTotals = { ...tripTotals };
      const deletedTripTotal = updatedTotals[tripId] || 0;
      delete updatedTotals[tripId];
      setTripTotals(updatedTotals);
      setTotalSpent(prev => prev - deletedTripTotal);
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', marginTop: 20 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../assets/logo/logo.jpeg')}
            style={styles.avatar}
          />
          <Text style={styles.title}>GoodSplit</Text>
        </View>
      </View>

      <BannerAds />

      <View style={{ marginHorizontal: 10, marginTop: 30, alignItems: 'center', backgroundColor: '#cef0d7', padding: 5, borderRadius: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#2f3640' }}>
          Total Spent: ₹{totalSpent.toFixed(2)}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 10, paddingBottom: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Recent Group Trip</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddGroupScreen')} style={{ backgroundColor: '#f2f3f5', borderRadius: 15, padding: 5, paddingHorizontal: 15 }}>
          <Text>Add Group</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 10, paddingBottom: 20 }}>
        <FlatList
          data={trips}
          ListEmptyComponent={EmpityList()}
          keyExtractor={items => items.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity onPress={() => navigation.navigate('GroupExpanseScreen', { ...item })} style={{ backgroundColor: '#f2f3f5', borderRadius: 10, margin: 8 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                      onPress={() => confirmDeleteTrip(item.id)}
                      style={{
                        marginLeft: -5,
                        padding: 5,
                        backgroundColor: '#d7d9db',
                        borderRadius: 50,
                        marginTop: -65,
                        marginRight: -20
                      }}
                    >
                      <MaterialIcons name="delete-outline" size={20} color='#c96162' />
                    </TouchableOpacity>
                    <Image source={randemImage()} style={{ width: 80, height: 80, borderRadius: 10 }} />
                    <View>
                      <Text style={{ fontWeight: '800', marginLeft: 10 }}>{item.groupName}</Text>
                      <Text style={{ fontWeight: '600', color: 'green', fontSize: 12, marginLeft: 10 }}>Total Spend</Text>
                      <Text style={{ fontWeight: '600', color: "gray", marginLeft: 10 }}>₹ {tripTotals[item.id]?.toFixed(2) || 0}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
                    <View style={{ marginRight: 1, alignItems: 'flex-end' }}>
                      <Text style={{ fontWeight: '600', color: 'green', fontSize: 12 }}>you are owed</Text>
                      <Text style={{ fontWeight: '600', color: "red" }}>₹ {tripTotals[item.id]?.toFixed(2) || 0}</Text>
                    </View>
                    <View style={{
                      marginLeft: 10,
                      padding: 8,
                      borderRadius: 50
                    }} >
                      <TouchableOpacity onPress={() => setAddMemberModalVisible(true)}>
                        <View>
                          <View style={styles.container}>
                            <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEvkMZtGOAhpFvkJeuC-pRRrFFaQ9nL0NRTqoBAhLgzGxBwM-29_a4s5R0WwfDIg-1BOk&usqp=CAU' }} style={[styles.circle, { backgroundColor: '#00FFFF', left: -40 }]} />
                            <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6W8j59cb5rvLX_rYPVcqZ67MVfShKc87w1IafvcFi0_7ytM4mGshNvIZjJFC5RMiEfqw&usqp=CAU' }} style={[styles.circle, { backgroundColor: '#0000FF', left: -20 }]} />
                          </View>
                          <Feather name="plus-circle" size={20} color='white' style={{ marginTop: -14, marginLeft: 0, backgroundColor: 'gray', padding: 5, borderRadius: 50 }} />
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setViewMembersModalVisible(true)}>
                        <Text style={{ fontSize: 12 }}>{members.length} member</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </ScrollView>

      {/* Add Member Modal */}
      <Modal visible={addMemberModalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Member</Text>
            <TextInput placeholder="Name" value={newMemberName} onChangeText={setNewMemberName} style={styles.input} />
            <TextInput placeholder="Phone Number" keyboardType="phone-pad" value={newMemberPhone} onChangeText={setNewMemberPhone} style={styles.input} />
            <TouchableOpacity
              onPress={() => {
                if (!newMemberName || !newMemberPhone) return Alert.alert("All fields required");
                setMembers([...members, { name: newMemberName, phone: newMemberPhone }]);
                setNewMemberName('');
                setNewMemberPhone('');
                setAddMemberModalVisible(false);
              }}
              style={styles.addButton}
            >
              <Text style={{ color: '#fff' }}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* View Members Modal */}
      <Modal visible={viewMembersModalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={[styles.modalContent, { maxHeight: '60%' }]}>
            <Text style={styles.modalTitle}>Group Members</Text>
            <ScrollView>
              {members.map((member, index) => (
                <View key={index} style={styles.memberRow}>
                  <Text style={{ fontWeight: '600' }}>{member.name}</Text>
                  <Text>{member.phone}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setViewMembersModalVisible(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: '#3498db' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GroupScreen;

const CIRCLE_SIZE = 28;
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  container: {
    position: 'relative',
    marginTop: 12,
  },
  circle: {
    position: 'absolute',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    opacity: 0.9,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '85%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5
  },
  addButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee'
  }
});


// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Alert,
//   Animated,
//   Dimensions,
//   FlatList,
//   Image,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Feather from 'react-native-vector-icons/Feather';
// import randemImage from '../../assets/sliderImage/randemImage';
// import { useIsFocused, useNavigation } from '@react-navigation/native';
// import { signOut } from 'firebase/auth';
// import { auth, expensesRef, tripsRef } from '../../config/firebse';
// import { useSelector } from 'react-redux';
// import { deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
// import { useAuth } from '../../context/AuthContext';
// import BannerAds from '../adManager/BannerAds';
// import EmpityList from '../homeScreen/EmpityList';

// const { width } = Dimensions.get('window');


// const GroupScreen = () => {
//   const { userData } = useAuth();
//   const navigation = useNavigation()
//   const flatListRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(1); // start from 1 (first real item)
//   const { user } = useSelector(state => state.user)
//   const [trips, setTrips] = useState([])
//   const [tripTotals, setTripTotals] = useState({});
//   const [totalSpent, setTotalSpent] = useState(0);


//   // console.log("user data", user.email, user)

//   const isFocused = useIsFocused()

//   const confirmDeleteTrip = (tripId) => {
//     Alert.alert(
//       "Delete Group",
//       "Are you sure you want to delete this Group?",
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Delete", style: "destructive", onPress: () => handleDeleteTrip(tripId) }
//       ]
//     );
//   };



//   const fetchTrip = async () => {
//     const q = query(tripsRef, where("userId", "==", userData.uid));
//     const querySnapshot = await getDocs(q);
//     let grandTotal = 0;
//     let totals = {}; // ✅ Initialize totals as an empty object
//     let tripData = [];

//     for (const doc of querySnapshot.docs) {
//       const trip = { ...doc.data(), id: doc.id };
//       tripData.push(trip);

//       // Fetch expenses for this trip
//       const expenseQuery = query(expensesRef, where("tripId", "==", trip.id));
//       const expenseSnapshot = await getDocs(expenseQuery);

//       let total = 0;
//       expenseSnapshot.forEach(exp => {
//         const amount = parseFloat(exp.data().amount?.toString().replace(/[^0-9.]/g, '')) || 0;
//         total += amount;
//       });

//       totals[trip.id] = total; // ✅ No more error here
//       grandTotal += total;
//     }

//     setTrips(tripData);
//     setTripTotals(totals);
//     setTotalSpent(grandTotal);

//   };

//   // console.log("data trips", trips)
//   useEffect(() => {
//     if (isFocused)
//       fetchTrip();
//   }, [isFocused])

//   const handleDeleteTrip = async (tripId) => {
//     try {
//       await deleteDoc(doc(tripsRef, tripId));
//       // Update state to remove the deleted trip
//       const updatedTrips = trips.filter(t => t.id !== tripId);
//       setTrips(updatedTrips);

//       // Update totals and total spent
//       const updatedTotals = { ...tripTotals };
//       const deletedTripTotal = updatedTotals[tripId] || 0;
//       delete updatedTotals[tripId];
//       setTripTotals(updatedTotals);
//       setTotalSpent(prev => prev - deletedTripTotal);
//     } catch (error) {
//       console.error("Failed to delete trip:", error);
//     }
//   };



//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', marginTop: 20 }}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <Image
//             source={require('../../assets/logo/logo.jpeg')}
//             style={styles.avatar}
//           />
//           <Text style={styles.title}>GoodSplit</Text>
//         </View>
//         {/* <TouchableOpacity style={{ backgroundColor: '#edf2f0', borderRadius: 20, padding: 8, paddingRight: 15, paddingLeft: 15 }}>
//           <Text>Hi, {userData.name}</Text>
//         </TouchableOpacity> */}
//       </View>


//       <BannerAds />

//       <View style={{ marginHorizontal: 10, marginTop: 10, alignItems: 'center', backgroundColor: '#cef0d7', padding: 5, borderRadius: 10, marginTop: 30 }}>
//         <Text style={{ fontSize: 18, fontWeight: '600', color: '#2f3640' }}>
//           Total Spent: ₹{totalSpent.toFixed(2)}
//         </Text>
//       </View>


//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 10, paddingBottom: 10 }}>
//         <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Resent Group Trip</Text>
//         <TouchableOpacity onPress={() => navigation.navigate('AddGroupScreen')} style={{ backgroundColor: '#f2f3f5', borderRadius: 15, padding: 5, paddingLeft: 15, paddingRight: 15 }}>
//           <Text>Add Group</Text>
//         </TouchableOpacity>
//       </View>
//       <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 10, paddingBottom: 20 }}>
//         <FlatList
//           data={trips}
//           // numColumns={2}
//           ListEmptyComponent={EmpityList()}
//           keyExtractor={items => items.id}
//           showsVerticalScrollIndicator={false}
//           // columnWrapperStyle={{
//           //   justifyContent: 'center'
//           // }}
//           renderItem={({ item }) => {
//             return (
//               <TouchableOpacity onPress={() => navigation.navigate('GroupExpanseScreen', { ...item })} style={{ backgroundColor: '#f2f3f5', borderRadius: 10, margin: 8 }}>
//                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
//                     <TouchableOpacity
//                       onPress={() => confirmDeleteTrip(item.id)} // <-- Add this
//                       style={{
//                         marginLeft: -5,
//                         padding: 5,
//                         backgroundColor: '#d7d9db',
//                         borderRadius: 50,
//                         marginTop:-65,
//                         marginRight:-20
//                       }}
//                     >
//                       <MaterialIcons name="delete-outline" size={20} color='#c96162' />
//                     </TouchableOpacity>
//                     <Image source={randemImage()} style={{ width: 80, height: 80, borderRadius: 10 }} />
//                     <View>
//                       <Text style={{ fontWeight: '800', marginLeft: 10 }}>{item.place}</Text>
//                       {/* <Text style={{ marginLeft: 10, marginBottom: 5, }}>{item.countery}</Text> */}
//                       <Text style={{ fontWeight: '600', color: 'green', fontSize: 12, marginLeft: 10 }}>Total Spend</Text>
//                       <Text style={{ fontWeight: '600', color: "gray", marginLeft: 10 }}>₹ {tripTotals[item.id]?.toFixed(2) || 0}</Text>
//                     </View>
//                   </View>
//                   <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
//                     <View style={{ marginRight: 1, alignItems: 'flex-end' }}>
//                       <Text style={{ fontWeight: '600', color: 'green', fontSize: 12 }}>you are owed</Text>
//                       <Text style={{ fontWeight: '600', color: "red" }}>₹ {tripTotals[item.id]?.toFixed(2) || 0}</Text>
//                     </View>
//                     <View style={{
//                       marginLeft: 10,
//                       padding: 8,
//                       // backgroundColor: 'gray',
//                       borderRadius: 50
//                     }} >

//                       <TouchableOpacity
//                         style={{
//                           marginLeft: 30,
//                           padding: 5,
//                           // backgroundColor: 'gray',
//                           borderRadius: 50
//                         }}
//                       >
//                         <View>
//                           <View style={styles.container}>
//                             <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEvkMZtGOAhpFvkJeuC-pRRrFFaQ9nL0NRTqoBAhLgzGxBwM-29_a4s5R0WwfDIg-1BOk&usqp=CAU' }} style={[styles.circle, { backgroundColor: '#00FFFF', left: -40 }]} />
//                             <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6W8j59cb5rvLX_rYPVcqZ67MVfShKc87w1IafvcFi0_7ytM4mGshNvIZjJFC5RMiEfqw&usqp=CAU' }} style={[styles.circle, { backgroundColor: '#0000FF', left: -20 }]} />
//                           </View>
//                           <Feather name="plus-circle" size={20} color='white' style={{ marginTop: -14, marginLeft: 0, backgroundColor: 'gray', padding: 5, borderRadius: 50 }} />
//                         </View>
//                       </TouchableOpacity>
//                       {/* <Text style={{ fontSize: 12 }}>Add people</Text> */}
//                       <Text style={{ fontSize: 12 }}>4 member</Text>
//                     </View>
//                   </View>


//                 </View>
//               </TouchableOpacity>
//             )
//           }}
//         />
//       </ScrollView>

//     </SafeAreaView>
//   );
// };

// export default GroupScreen;
// const CIRCLE_SIZE = 28;
// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginHorizontal: 15,
//     marginBottom: 10,
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 20,
//   },
//   title: {
//     fontSize: 25,
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//     backgroundColor: '#fff',
//     marginTop: 12
//   },
//   circle: {
//     position: 'absolute',
//     width: CIRCLE_SIZE,
//     height: CIRCLE_SIZE,
//     borderRadius: CIRCLE_SIZE / 2,
//     opacity: 0.9,
//   },
// });
