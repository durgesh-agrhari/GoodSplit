import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
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
import { deleteDoc, doc, getDocs, query, where, addDoc, updateDoc } from 'firebase/firestore';
import { auth, GroupExpenseRef, groupRef } from '../../config/firebse';
import { useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import BannerAds from '../adManager/BannerAds';
import EmpityList from '../homeScreen/EmpityList';
import { MemberRef } from '../../config/firebse';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.85;
const SPACER = (width - ITEM_WIDTH) / 2;

const originalData = [
  { id: '1', uri: require('../../assets/logo/1.png') },
  { id: '2', uri: require('../../assets/logo/2.png') },
  { id: '3', uri: require('../../assets/logo/3.png') },
];

const data = [
  originalData[originalData.length - 1],
  ...originalData,
  originalData[0],
];

const GroupScreen = () => {
  const { userData } = useAuth();
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const { user } = useSelector(state => state.user);
  const [trips, setTrips] = useState([]);
  const [tripTotals, setTripTotals] = useState({});
  const [totalSpent, setTotalSpent] = useState(0);
  const [members, setMembers] = useState([]);
  const [showMemberPopup, setShowMemberPopup] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [memberCounts, setMemberCounts] = useState({});

  const [splitAmount, setSplitAmount] = useState('');
  const [memberShares, setMemberShares] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const [paidStatus, setPaidStatus] = useState({});

//   const togglePaidStatus = async (memberId, groupId, isPaid) => {
//   try {
//     // Update in Firestore
//     const memberDocRef = doc(MemberRef, 'members', memberId);
//     await updateDoc(memberDocRef, {
//       paid: !isPaid,
//     });

//     // Update in local state
//     setMembers((prevMembers) =>
//       prevMembers.map((member) =>
//         member.id === memberId ? { ...member, paid: !isPaid } : member
//       )
//     );
//   } catch (error) {
//     console.error('Error updating paid status:', error);
//   }
// };

const togglePaidStatus = async (memberId, isPaid) => {
  try {
    // Correct document reference
    const memberDocRef = doc(MemberRef, memberId);

    // Update the 'paid' field in Firestore
    await updateDoc(memberDocRef, {
      paid: !isPaid,
    });

    // Update local state
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === memberId ? { ...member, paid: !isPaid } : member
      )
    );
  } catch (error) {
    console.error('Error updating paid status:', error);
  }
};








  // 👇 Modal states
  const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberTitle, setMemberTitle] = useState('');

  // const fetchMembers = async (groupId) => {
  //   try {
  //     const q = query(MemberRef, where('groupId', '==', groupId));
  //     const snapshot = await getDocs(q);
  //     const memberList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //     console.log("all member", memberList)
  //     setMembers(memberList);
  //   } catch (error) {
  //     console.error("Failed to fetch members:", error);
  //   }
  // };
  const fetchMembers = async (groupId) => {
    try {
      const q = query(MemberRef, where('groupId', '==', groupId));
      const snapshot = await getDocs(q);
      const memberList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(memberList)
      return memberList.length;
    } catch (error) {
      console.error("Failed to fetch members:", error);
      return 0;
    }
  };

  // console.log("member",members)

  const handleAddMember = async () => {
    if (!memberName.trim()) {
      Alert.alert('Error', 'Member name is required');
      return;
    }
    try {
      await addDoc(MemberRef, {
        name: memberName,
        title: memberTitle,
        groupId: selectedGroupId,
        createdAt: new Date(),
      });
      await fetchMembers(selectedGroupId);
      Alert.alert('✅ Member Added', `${memberName} (${memberTitle})`);
      closeModal();
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };
  const deleteMember = async (id) => {
    try {
      await deleteDoc(doc(MemberRef, id));
      await fetchMembers(selectedGroupId);
    } catch (error) {
      console.error("Failed to delete member:", error);
    }
  };


  const isFocused = useIsFocused();


  const closeModal = () => {
    setIsAddMemberModalVisible(false);
    setMemberName('');
    setMemberTitle('');
  };

  // const handleAddMember = () => {
  //   if (!memberName.trim()) {
  //     Alert.alert('Error', 'Member name is required');
  //     return;
  //   }
  //   Alert.alert('✅ Member Added', `${memberName} (${memberTitle})`);
  //   closeModal();
  // };

  // const fetchTrip = async () => {
  //   const q = query(groupRef, where("userId", "==", userData.uid));
  //   const querySnapshot = await getDocs(q);
  //   let grandTotal = 0;
  //   let totals = {};
  //   let tripData = [];

  //   for (const doc of querySnapshot.docs) {
  //     const trip = { ...doc.data(), id: doc.id };
  //     tripData.push(trip);

  //     const expenseQuery = query(GroupExpenseRef, where("groupExpenseId", "==", trip.id));
  //     const expenseSnapshot = await getDocs(expenseQuery);

  //     let total = 0;
  //     expenseSnapshot.forEach(exp => {
  //       const amount = parseFloat(exp.data().amount?.toString().replace(/[^0-9.]/g, '')) || 0;
  //       total += amount;
  //     });

  //     totals[trip.id] = total;
  //     grandTotal += total;
  //   }

  //   setTrips(tripData);
  //   setTripTotals(totals);
  //   setTotalSpent(grandTotal);
  // };

  const fetchTrip = async () => {
    const q = query(groupRef, where("userId", "==", userData.uid));
    const querySnapshot = await getDocs(q);
    let grandTotal = 0;
    let totals = {};
    let tripData = [];
    let counts = {};

    for (const doc of querySnapshot.docs) {
      const trip = { ...doc.data(), id: doc.id };
      tripData.push(trip);

      // Get expenses
      const expenseQuery = query(GroupExpenseRef, where("groupExpenseId", "==", trip.id));
      const expenseSnapshot = await getDocs(expenseQuery);

      let total = 0;
      expenseSnapshot.forEach(exp => {
        const amount = parseFloat(exp.data().amount?.toString().replace(/[^0-9.]/g, '')) || 0;
        total += amount;
      });

      totals[trip.id] = total;
      grandTotal += total;

      // ✅ Fetch member count per trip
      const count = await fetchMembers(trip.id);
      counts[trip.id] = count;
    }

    setTrips(tripData);
    setTripTotals(totals);
    setTotalSpent(grandTotal);
    setMemberCounts(counts); // ✅ set counts
  };


  useEffect(() => {
    if (isFocused) fetchTrip();
  }, [isFocused]);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const onMomentumScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    let newIndex = Math.round(offsetX / ITEM_WIDTH);

    if (newIndex === 0) {
      newIndex = originalData.length;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: false });
    } else if (newIndex === data.length - 1) {
      newIndex = 1;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: false });
    }

    setCurrentIndex(newIndex);
  };

  const handleDeleteTrip = async (groupExpenseId) => {
    try {
      await deleteDoc(doc(groupRef, groupExpenseId));
      const updatedTrips = trips.filter(t => t.id !== groupExpenseId);
      setTrips(updatedTrips);

      const updatedTotals = { ...tripTotals };
      const deletedTripTotal = updatedTotals[groupExpenseId] || 0;
      delete updatedTotals[groupExpenseId];
      setTripTotals(updatedTotals);
      setTotalSpent(prev => prev - deletedTripTotal);
    } catch (error) {
      console.error("Failed to delete trip:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', marginTop: 20 }}>
      {showDeleteConfirm && (
        <Modal
          transparent
          animationType="fade"
          visible={showDeleteConfirm}
          onRequestClose={() => setShowDeleteConfirm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Delete Group</Text>
              <Text style={{ textAlign: 'center', marginBottom: 20 }}>
                Are you sure you want to delete this group?
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowDeleteConfirm(false);
                  }}
                  style={styles.modalButtonCancel}
                >
                  <Text style={{ color: 'black' }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (groupToDelete) {
                      handleDeleteTrip(groupToDelete);
                    }
                    setShowDeleteConfirm(false);
                  }}
                  style={styles.modalButtonDelete}
                >
                  <Text style={{ color: 'white' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}


      {/* Modal */}
      {isAddMemberModalVisible && (
        <Modal
          transparent
          animationType="fade"
          visible={isAddMemberModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add Member</Text>
              <TextInput
                placeholder="Member Name"
                value={memberName}
                onChangeText={setMemberName}
                style={styles.input}
                placeholderTextColor='gray'
              />
              <TextInput
                placeholder="Member Title (optional)"
                value={memberTitle}
                onChangeText={setMemberTitle}
                style={styles.input}
                placeholderTextColor='gray'
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity onPress={handleAddMember} style={styles.modalButtonAdd}>
                  <Text style={{ color: '#fff' }}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeModal} style={styles.modalButtonCancel}>
                  <Text style={{ color: '#000' }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
      {/* 
      {showMemberPopup && (
        <Modal
          transparent
          animationType="slide"
          visible={showMemberPopup}
          onRequestClose={() => setShowMemberPopup(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Group Members</Text>
              {members.length === 0 ? (
                <Text style={{ textAlign: 'center' }}>No members added yet.</Text>
              ) : (
                members.map((m, index) => (
                  <View key={m.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                    <Text>{index + 1}. {m.name} ({m.title})</Text>
                    <TouchableOpacity onPress={() => deleteMember(m.id)}>
                      <MaterialIcons name="delete-outline" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
              <TouchableOpacity onPress={() => setShowMemberPopup(false)} style={styles.modalButtonCancel} >
                <Text style={{ color: 'green', textAlign: 'center' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )} */}

      {/* {showMemberPopup && (
        <Modal
          transparent
          animationType="slide"
          visible={showMemberPopup}
          onRequestClose={() => setShowMemberPopup(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Group Members</Text>

              <View
                style={{
                  marginHorizontal: 10,
                  marginTop: 10,
                  alignItems: 'center',
                  backgroundColor: '#cef0d7',
                  padding: 5,
                  borderRadius: 10,
                  marginBottom:15
                }}
              >

                <Text style={{ fontSize: 18, fontWeight: '600', color: '#2f3640' }}>
                  Total Spent: ₹{tripTotals[selectedGroupId]?.toFixed(2) || '0.00'}
                </Text>

                <Text style={{ fontSize: 16, color: '#2f3640' }}>
                  Each Member Pays: ₹
                  {(members.length > 0 && tripTotals[selectedGroupId] ? (tripTotals[selectedGroupId] / members.length).toFixed(2) : 0)}
                </Text>

              </View>

              {members.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 20 , marginBottom:20}}>
                  No members added yet.
                </Text>
              ) : (
                members.map((m, index) => (
                  <View
                    key={m.id}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginVertical: 5,
                      alignItems: 'center',
                    }}
                  >
                    <View>
                      <Text>
                        {index + 1}. {m.name} ({m.title})
                      </Text>
        
                      <Text style={{ color: 'gray' }}>
                        Owes: ₹{(members.length > 0 && tripTotals[selectedGroupId] ? (tripTotals[selectedGroupId] / members.length).toFixed(2) : 0)}
                      </Text>

                    </View>
                    
                    <TouchableOpacity onPress={() => deleteMember(m.id)}>
                      <MaterialIcons name="delete-outline" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                ))
              )}

              <TouchableOpacity
                onPress={() => setShowMemberPopup(false)}
                style={[styles.modalButtonCancel,{marginTop:15}]}
              >
                <Text style={{ color: 'green', textAlign: 'center' }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )} */}

      {showMemberPopup && (
  <Modal
    transparent
    animationType="slide"
    visible={showMemberPopup}
    onRequestClose={() => setShowMemberPopup(false)}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Group Members</Text>

        <View
          style={{
            marginHorizontal: 10,
            marginTop: 10,
            alignItems: 'center',
            backgroundColor: '#cef0d7',
            padding: 5,
            borderRadius: 10,
            marginBottom: 15,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#2f3640' }}>
            Total Spent: ₹{tripTotals[selectedGroupId]?.toFixed(2) || '0.00'}
          </Text>
          <Text style={{ fontSize: 16, color: '#2f3640' }}>
            Each Member Pays: ₹
            {(members.length > 0 && tripTotals[selectedGroupId]
              ? (tripTotals[selectedGroupId] / members.length).toFixed(2)
              : 0)}
          </Text>
        </View>

        {members.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20, marginBottom: 20 }}>
            No members added yet.
          </Text>
        ) : (
          members.map((m, index) => (
            <View
              key={m.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 5,
                alignItems: 'center',
              }}
            >
              <View>
                <Text
                  style={{
                    textDecorationLine: m.paid ? 'line-through' : 'none',
                    color: m.paid ? 'green' : 'red',
                  }}
                >
                  {index + 1}. {m.name} ({m.title})
                </Text>
                <Text style={{ color: 'gray' }}>
                  Owes: ₹
                  {(members.length > 0 && tripTotals[selectedGroupId]
                    ? (tripTotals[selectedGroupId] / members.length).toFixed(2)
                    : 0)}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => togglePaidStatus(m.id)}
                  style={{
                    padding: 5,
                    backgroundColor: m.paid ? '#d4edda' : '#f8d7da',
                    borderRadius: 5,
                    marginRight: 10,
                  }}
                >
                  <Text style={{ color: m.paid ? 'green' : 'red' }}>
                    {m.paid ? 'Paid' : 'Unpaid'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteMember(m.id)}>
                  <MaterialIcons name="delete-outline" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity
          onPress={() => setShowMemberPopup(false)}
          style={[styles.modalButtonCancel, { marginTop: 15 }]}
        >
          <Text style={{ color: 'green', textAlign: 'center' }}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}


      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../../assets/logo/logo.png')} style={styles.avatar} />
          <Text style={styles.title}>GoodSplit</Text>
        </View>

      </View>

      {/* Carousel */}
      {/* <Animated.FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        bounces={false}
        initialScrollIndex={1}
        getItemLayout={(d, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        contentContainerStyle={{ paddingHorizontal: SPACER }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item }) => (
          <View style={styles.carouselItem}>
            <Image source={item.uri} style={styles.carouselImage} />
          </View>
        )}
      /> */}
      {/* 
      <View style={styles.pagination}>
        {originalData.map((_, i) => {
          const inputRange = [
            (i + 0) * ITEM_WIDTH,
            (i + 1) * ITEM_WIDTH,
            (i + 2) * ITEM_WIDTH,
          ];
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
        })}
      </View> */}

      <BannerAds />

      <View style={{ marginHorizontal: 10, marginTop: 10, alignItems: 'center', backgroundColor: '#cef0d7', padding: 5, borderRadius: 10, marginTop: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#2f3640' }}>
          Total Spent: ₹{totalSpent.toFixed(2)}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 10, paddingBottom: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Recent Trip</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddGroupScreen')} style={{ backgroundColor: '#f2f3f5', borderRadius: 15, padding: 5, paddingLeft: 15, paddingRight: 15 }}>
          <Text>Add Group</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={trips}
        ListEmptyComponent={EmpityList()}
        keyExtractor={items => items.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('GroupExpanseScreen', { ...item })} style={{ backgroundColor: '#f2f3f5', borderRadius: 10, margin: 10, marginTop: 15, padding: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ marginTop: -60, marginLeft: -5 }}>
                  {/* <TouchableOpacity onPress={() => handleDeleteTrip(item.id)} style={{ padding: 6, backgroundColor: '#d6d0d0', borderRadius: 50 }}>
                    <MaterialIcons name="delete-outline" size={20} color='#d65e60' />
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    onPress={() => {
                      setGroupToDelete(item.id);
                      setShowDeleteConfirm(true);
                    }}
                    style={{ padding: 6, backgroundColor: '#d6d0d0', borderRadius: 50, marginLeft: -15 }}
                  >
                    <MaterialIcons name="delete-outline" size={24} color="red" />
                  </TouchableOpacity>

                </View>
                <Image source={randemImage()} style={{ width: 40, height: 40, borderRadius: 10, marginLeft: -30 }} />
                <View>
                  <Text style={{ fontWeight: '800', marginLeft: 10 }}>{item.title}</Text>
                  <Text style={{ fontWeight: '600', color: 'green', fontSize: 12, marginLeft: 10 }}>Group Spend</Text>
                  <Text style={{ fontWeight: '600', color: "#db4649", marginLeft: 10 }}>₹ {tripTotals[item.id]?.toFixed(2) || 0}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
                {/* <View style={{ marginRight: 1, alignItems: 'flex-end' }}>
                  <Text style={{ fontWeight: '600', color: 'green', fontSize: 12 }}>you are owed</Text>
                  <Text style={{ fontWeight: '600', color: "red" }}>₹ {tripTotals[item.id]?.toFixed(2) || 0}</Text>
                </View> */}

                <View style={{ marginLeft: 5 }}>

                  <TouchableOpacity
                    onPress={() => {
                      setSelectedGroupId(item.id);
                      setIsAddMemberModalVisible(true);
                    }}
                    style={{ padding: 6, backgroundColor: 'gray', borderRadius: 50, flexDirection: 'row' }}
                  >
                    <View style={styles.container}>
                      <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEvkMZtGOAhpFvkJeuC-pRRrFFaQ9nL0NRTqoBAhLgzGxBwM-29_a4s5R0WwfDIg-1BOk&usqp=CAU' }} style={[styles.circle, { backgroundColor: '#00FFFF', left: -40 }]} />
                      <Image source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/002/002/257/small_2x/beautiful-woman-avatar-character-icon-free-vector.jpg' }} style={[styles.circle, { backgroundColor: '#0000FF', left: -20 }]} />
                      <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6W8j59cb5rvLX_rYPVcqZ67MVfShKc87w1IafvcFi0_7ytM4mGshNvIZjJFC5RMiEfqw&usqp=CAU' }} style={[styles.circle, { backgroundColor: '#800080', left: 0 }]} />
                      {/* <Image source={{ uri: 'https://img.freepik.com/premium-vector/avatar-portrait-young-caucasian-woman-round-frame-vector-cartoon-flat-illustration_551425-22.jpg' }} style={[styles.circle, { backgroundColor: '#FF00FF', left: 20 }]} /> */}
                      {/* <Image source={{ uri: 'https://img.freepik.com/premium-vector/young-man-avatar-character-due-avatar-man-vector-icon-cartoon-illustration_1186924-4438.jpg?semt=ais_items_boosted&w=740' }} style={[styles.circle, { backgroundColor: '#FFC0CB', left: 40 }]} /> */}
                    </View>
                    <View style={{ backgroundColor: 'gray', borderRadius: 50, padding: 4, marginLeft: 10 }}>
                      <Feather name="plus-circle" size={20} color='#f0e8e8ff' />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setSelectedGroupId(item.id);
                      setIsAddMemberModalVisible(true);
                    }}
                  >
                    <Text style={{ fontSize: 12, marginLeft: 8, marginTop: 3 }}>Add Member</Text>
                  </TouchableOpacity>

                </View>

                <View style={{ marginLeft: 15, marginRight: -20 }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('GroupExpanseScreen', { ...item })}
                    style={{ backgroundColor: '#c4c0c0', padding: 7, borderRadius: 10, paddingLeft: 10, paddingRight: 10, margin: 5 }}
                  >
                    <Text style={{ fontSize: 12 }}>Add Expences +</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      setSelectedGroupId(item.id);
                      await fetchMembers(item.id);
                      setShowMemberPopup(true);
                    }}
                    style={{ backgroundColor: '#c4c0c0', padding: 7, borderRadius: 10, paddingLeft: 10, paddingRight: 10, margin: 5 }}

                  >
                    <Text style={{ fontSize: 12 }}>{memberCounts[item.id] || 0} Member Details </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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
  carouselItem: {
    width: ITEM_WIDTH,
    height: 100,
    marginHorizontal: 5,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#c9c6c6ff',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -110,
    marginBottom: 20
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'black',
    marginHorizontal: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButtonAdd: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    borderRadius: 8,
    marginLeft: 5,
    marginTop: 15,
    justifyContent:'center',
    alignItems:'center',
  },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonDelete: {
    backgroundColor: '#ff3b30',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
});



// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Alert,
//   Animated,
//   Dimensions,
//   FlatList,
//   Image,
//   Modal,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Feather from 'react-native-vector-icons/Feather';
// import randemImage from '../../assets/sliderImage/randemImage';
// import { useIsFocused, useNavigation } from '@react-navigation/native';
// import { signOut } from 'firebase/auth';
// import { auth, expensesRef, GroupExpenseRef, groupRef } from '../../config/firebse';
// import { useSelector } from 'react-redux';
// import { deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
// import { useAuth } from '../../context/AuthContext';
// import BannerAds from '../adManager/BannerAds';
// import EmpityList from '../homeScreen/EmpityList';
// // import BannerAds from '../adManager/BannerAds';

// const { width } = Dimensions.get('window');
// const ITEM_WIDTH = width * 0.85;
// const SPACER = (width - ITEM_WIDTH) / 2;

// const originalData = [
//   { id: '1', uri: require('../../assets/logo/1.png') },
//   { id: '2', uri: require('../../assets/logo/2.png') },
//   { id: '3', uri: require('../../assets/logo/3.png') },
// ];

// // Add fake first and last items for looping illusion
// const data = [
//   originalData[originalData.length - 1], // last
//   ...originalData,
//   originalData[0], // first
// ];

// const GroupScreen = () => {
//   const { userData } = useAuth();
//   const navigation = useNavigation()
//   const scrollX = useRef(new Animated.Value(0)).current;
//   const flatListRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(1); // start from 1 (first real item)
//   const { user } = useSelector(state => state.user)
//   const [trips, setTrips] = useState([])
//   const [tripTotals, setTripTotals] = useState({});
//   const [totalSpent, setTotalSpent] = useState(0);
//   const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
//   const [memberName, setMemberName] = useState('');
//   const [memberTitle, setMemberTitle] = useState('');

//   const closeModal = () => {
//     setIsAddMemberModalVisible(false);
//     setMemberName('');
//     setMemberTitle('');
//   };

//   const handleAddMember = () => {
//     if (!memberName.trim()) {
//       Alert.alert("Error", "Member name is required");
//       return;
//     }
//     // 🔁 Add logic here to save member data to Firestore
//     Alert.alert("✅ Member Added", `${memberName} (${memberTitle})`);
//     closeModal();
//   };



//   // console.log("user data", user.email, user)

//   const isFocused = useIsFocused()

//   //   const confirmDeleteTrip = (groupExpenseId) => {
//   //   Alert.alert(
//   //     "Delete Trip",
//   //     "Are you sure you want to delete this trip?",
//   //     [
//   //       { text: "Cancel", style: "cancel" },
//   //       { text: "Delete", style: "destructive", onPress: () => handleDeleteTrip(groupExpenseId) }
//   //     ]
//   //   );
//   // };


//   const fetchTrip = async () => {
//     const q = query(groupRef, where("userId", "==", userData.uid));
//     const querySnapshot = await getDocs(q);
//     let grandTotal = 0;
//     let totals = {}; // ✅ Initialize totals as an empty object
//     let tripData = [];

//     for (const doc of querySnapshot.docs) {
//       const trip = { ...doc.data(), id: doc.id };
//       tripData.push(trip);

//       // Fetch expenses for this trip
//       const expenseQuery = query(GroupExpenseRef, where("groupExpenseId", "==", trip.id));
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
//   useEffect(() => {
//     const interval = setInterval(() => {
//       let nextIndex = currentIndex + 1;
//       flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
//       setCurrentIndex(nextIndex);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [currentIndex]);

//   const onMomentumScrollEnd = (e) => {
//     const offsetX = e.nativeEvent.contentOffset.x;
//     let newIndex = Math.round(offsetX / ITEM_WIDTH);

//     // Handle seamless looping
//     if (newIndex === 0) {
//       newIndex = originalData.length;
//       flatListRef.current?.scrollToIndex({ index: newIndex, animated: false });
//     } else if (newIndex === data.length - 1) {
//       newIndex = 1;
//       flatListRef.current?.scrollToIndex({ index: newIndex, animated: false });
//     }

//     setCurrentIndex(newIndex);
//   };


//   const handleDeleteTrip = async (groupExpenseId) => {
//     try {
//       await deleteDoc(doc(groupRef, groupExpenseId));
//       // Update state to remove the deleted trip
//       const updatedTrips = trips.filter(t => t.id !== groupExpenseId);
//       setTrips(updatedTrips);

//       // Update totals and total spent
//       const updatedTotals = { ...tripTotals };
//       const deletedTripTotal = updatedTotals[groupExpenseId] || 0;
//       delete updatedTotals[groupExpenseId];
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
//         <TouchableOpacity style={{ backgroundColor: '#edf2f0', borderRadius: 20, padding: 8, paddingRight: 15, paddingLeft: 15 }}>
//           <Text>Hi, {userData.name}</Text>
//         </TouchableOpacity>
//         {/* <TouchableOpacity onPress={handleLogout} style={{backgroundColor:'#edf2f0', borderRadius:20, padding:8, paddingRight:15, paddingLeft:15}}>
//           <Text>Logout</Text>
//         </TouchableOpacity> */}
//         {/* <TouchableOpacity style={{backgroundColor:'#edf2f0', borderRadius:50, padding:8}}>
//           <Ionicons name="notifications-sharp" color="#2a2e2c" size={25} />
//         </TouchableOpacity> */}
//       </View>
//       <View style={{ marginBottom: 15 }}>
//         {/* Carousel */}
//         <Animated.FlatList
//           ref={flatListRef}
//           data={data}
//           keyExtractor={(item, index) => `${item.id}-${index}`}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           snapToInterval={ITEM_WIDTH}
//           decelerationRate="fast"
//           bounces={false}
//           initialScrollIndex={1}
//           getItemLayout={(d, index) => ({
//             length: ITEM_WIDTH,
//             offset: ITEM_WIDTH * index,
//             index,
//           })}
//           contentContainerStyle={{ paddingHorizontal: SPACER }}
//           onScroll={Animated.event(
//             [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//             { useNativeDriver: false }
//           )}
//           onMomentumScrollEnd={onMomentumScrollEnd}
//           renderItem={({ item }) => (
//             <View style={styles.carouselItem}>
//               <Image source={item.uri} style={styles.carouselImage} />
//             </View>
//           )}
//         />

//         {/* Pagination Dots */}
//         <View style={styles.pagination}>
//           {originalData.map((_, i) => {
//             const inputRange = [
//               (i + 0) * ITEM_WIDTH,
//               (i + 1) * ITEM_WIDTH,
//               (i + 2) * ITEM_WIDTH,
//             ];
//             const opacity = scrollX.interpolate({
//               inputRange,
//               outputRange: [0.3, 1, 0.3],
//               extrapolate: 'clamp',
//             });

//             return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
//           })}
//         </View>
//       </View>

//       <BannerAds />

//       <View style={{ marginHorizontal: 10, marginTop: 10, alignItems: 'center', backgroundColor: '#cef0d7', padding: 5, borderRadius: 10, marginTop: 30 }}>
//         <Text style={{ fontSize: 18, fontWeight: '600', color: '#2f3640' }}>
//           Total Spent: ₹{totalSpent.toFixed(2)}
//         </Text>
//       </View>


//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 10, paddingBottom: 10 }}>
//         <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Resent Trip</Text>
//         <TouchableOpacity onPress={() => navigation.navigate('AddGroupScreen')} style={{ backgroundColor: '#f2f3f5', borderRadius: 15, padding: 5, paddingLeft: 15, paddingRight: 15 }}>
//           <Text>Add Group</Text>
//         </TouchableOpacity>
//       </View>
//       <View showsVerticalScrollIndicator={false} style={{ paddingTop: 10, paddingBottom: 20 }}>
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
//               <TouchableOpacity onPress={() => navigation.navigate('GroupExpanseScreen', { ...item })} style={{ backgroundColor: '#f2f3f5', borderRadius: 10, margin: 10, marginTop: 15 }}>
//                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
//                     <View style={{ marginTop: -60, marginLeft: -5 }}>
//                       <TouchableOpacity
//                         onPress={() => handleDeleteTrip(item.id)} // <-- Add this
//                         style={{
//                           marginLeft: 0,
//                           padding: 6,
//                           backgroundColor: '#d6d0d0',
//                           borderRadius: 50
//                         }}
//                       >
//                         <MaterialIcons name="delete-outline" size={20} color='#d65e60' />
//                       </TouchableOpacity>
//                     </View>
//                     <Image source={randemImage()} style={{ width: 80, height: 80, borderRadius: 10, marginLeft: -22 }} />
//                     <View>
//                       <Text style={{ fontWeight: '800', marginLeft: 10 }}>{item.title}</Text>
//                       <Text style={{ fontWeight: '600', color: 'green', fontSize: 12, marginLeft: 10 }}>Total Spend</Text>
//                       <Text style={{ fontWeight: '600', color: "red", marginLeft: 10 }}>₹ {tripTotals[item.id]?.toFixed(2) || 0}</Text>
//                     </View>
//                   </View>
//                   <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
//                     <View style={{ marginRight: 1, alignItems: 'flex-end' }}>
//                       <Text style={{ fontWeight: '600', color: 'green', fontSize: 12 }}>you are owed</Text>
//                       <Text style={{ fontWeight: '600', color: "red" }}>₹ {tripTotals[item.id]?.toFixed(2) || 0}</Text>
//                     </View>
//                     <View style={{ marginLeft: 5 }}>
//                       {/* <TouchableOpacity
//                       style={{
//                         marginLeft: 0,
//                         padding: 6,
//                         backgroundColor: 'gray',
//                         borderRadius: 50
//                       }}
//                     >
//                       <Feather name="plus-circle" size={20} color='#f0e8e8ff' />
//                     </TouchableOpacity> */}
//                       <TouchableOpacity
//                         onPress={() => setIsAddMemberModalVisible(true)}
//                         style={{
//                           padding: 6,
//                           backgroundColor: 'gray',
//                           borderRadius: 50
//                         }}
//                       >
//                         <Feather name="plus-circle" size={20} color='#f0e8e8ff' />
//                       </TouchableOpacity>



//                       <TouchableOpacity>
//                         <Text style={{ fontSize: 12 }}>Total 3 member </Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>

//                 </View>
//               </TouchableOpacity>
//             )
//           }}
//         />
//       </View>
//       <Modal
//         transparent
//         animationType="fade"
//         visible={isAddMemberModalVisible}
//         onRequestClose={closeModal}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>Add Member</Text>
//             <TextInput
//               placeholder="Member Name"
//               value={memberName}
//               onChangeText={setMemberName}
//               style={styles.input}
//             />
//             <TextInput
//               placeholder="Member Title (optional)"
//               value={memberTitle}
//               onChangeText={setMemberTitle}
//               style={styles.input}
//             />
//             <View style={styles.modalButtonContainer}>
//               <TouchableOpacity onPress={handleAddMember} style={styles.modalButtonAdd}>
//                 <Text style={{ color: '#fff' }}>Add</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={closeModal} style={styles.modalButtonCancel}>
//                 <Text style={{ color: '#000' }}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//     </SafeAreaView>
//   );
// };

// export default GroupScreen;

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
//   carouselItem: {
//     width: ITEM_WIDTH,
//     height: 100, // <-- set fixed height
//     marginHorizontal: 5,
//     borderRadius: 16,
//     overflow: 'hidden',
//     backgroundColor: '#c9c6c6ff',
//   },
//   carouselImage: {
//     width: '100%',
//     height: '100%', // <-- stretch image to match 300 height of container
//     borderRadius: 16,
//   },

//   pagination: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 12,
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: 'black',
//     marginHorizontal: 4,
//   },
//   modalOverlay: {
//   flex: 1,
//   justifyContent: 'center',
//   alignItems: 'center',
//   backgroundColor: 'rgba(0,0,0,0.5)',
// },
// modalContainer: {
//   width: '85%',
//   backgroundColor: '#fff',
//   borderRadius: 10,
//   padding: 20,
//   elevation: 5,
// },
// modalTitle: {
//   fontSize: 18,
//   fontWeight: 'bold',
//   marginBottom: 10,
// },
// input: {
//   borderWidth: 1,
//   borderColor: '#ccc',
//   borderRadius: 8,
//   paddingHorizontal: 10,
//   paddingVertical: 8,
//   marginTop: 10,
// },
// modalButtonContainer: {
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   marginTop: 20,
// },
// modalButtonAdd: {
//   backgroundColor: '#4caf50',
//   padding: 10,
//   borderRadius: 8,
//   flex: 1,
//   marginRight: 5,
//   alignItems: 'center',
// },
// modalButtonCancel: {
//   backgroundColor: '#e0e0e0',
//   padding: 10,
//   borderRadius: 8,
//   flex: 1,
//   marginLeft: 5,
//   alignItems: 'center',
// },

// });
