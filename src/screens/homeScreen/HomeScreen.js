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
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import randemImage from '../../assets/sliderImage/randemImage';
import EmpityList from './EmpityList';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth, expensesRef, tripsRef } from '../../config/firebse';
import { useSelector } from 'react-redux';
import { deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import BannerAds from '../adManager/BannerAds';
// import BannerAds from '../adManager/BannerAds';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.85;
const SPACER = (width - ITEM_WIDTH) / 2;

const originalData = [
  { id: '1', uri: require('../../assets/logo/1.png') },
  { id: '2', uri: require('../../assets/logo/2.png') },
  { id: '3', uri: require('../../assets/logo/3.png') },
];

// Add fake first and last items for looping illusion
const data = [
  originalData[originalData.length - 1], // last
  ...originalData,
  originalData[0], // first
];

const HomeScreen = () => {
  const { userData } = useAuth();
  const navigation = useNavigation()
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(1); // start from 1 (first real item)
  const { user } = useSelector(state => state.user)
  const [trips, setTrips] = useState([])
  const [tripTotals, setTripTotals] = useState({});
  const [totalSpent, setTotalSpent] = useState(0);

  const isFocused = useIsFocused()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);


  // const fetchTrip = async () => {
  //   const q = query(tripsRef, where("userId", "==", user.uid));
  //   const querySnapsot = await getDocs(q);
  //   let data = [];
  //   querySnapsot.forEach(doc => {
  //     // console.log("docs string ",doc.data())
  //     data.push(({ ...doc.data(), id: doc.id }))
  //   });
  //   setTrips(data)
  // }

  const fetchTrip = async () => {
    const q = query(tripsRef, where("userId", "==", userData.uid));
    const querySnapshot = await getDocs(q);
    let grandTotal = 0;
    let totals = {}; // ✅ Initialize totals as an empty object
    let tripData = [];

    for (const doc of querySnapshot.docs) {
      const trip = { ...doc.data(), id: doc.id };
      tripData.push(trip);

      // Fetch expenses for this trip
      const expenseQuery = query(expensesRef, where("tripId", "==", trip.id));
      const expenseSnapshot = await getDocs(expenseQuery);

      let total = 0;
      expenseSnapshot.forEach(exp => {
        const amount = parseFloat(exp.data().amount?.toString().replace(/[^0-9.]/g, '')) || 0;
        total += amount;
      });

      totals[trip.id] = total; // ✅ No more error here
      grandTotal += total;
    }

    setTrips(tripData);
    setTripTotals(totals);
    setTotalSpent(grandTotal);

  };

  // console.log("data trips", trips)
  useEffect(() => {
    if (isFocused)
      fetchTrip();
  }, [isFocused])
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

    // Handle seamless looping
    if (newIndex === 0) {
      newIndex = originalData.length;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: false });
    } else if (newIndex === data.length - 1) {
      newIndex = 1;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: false });
    }

    setCurrentIndex(newIndex);
  };


  const handleDeleteTrip = async (tripId) => {
    console.log("click delete", tripId)
    try {
      await deleteDoc(doc(tripsRef, tripId));
      // Update state to remove the deleted trip
      const updatedTrips = trips.filter(t => t.id !== tripId);
      setTrips(updatedTrips);

      // Update totals and total spent
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


      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../assets/logo/logo.jpeg')}
            style={styles.avatar}
          />
          <Text style={styles.title}>GoodSplit</Text>
        </View>
        <TouchableOpacity style={{ backgroundColor: '#edf2f0', borderRadius: 20, padding: 8, paddingRight: 15, paddingLeft: 15 }}>
          <Text>Hi, {userData.name}</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={handleLogout} style={{backgroundColor:'#edf2f0', borderRadius:20, padding:8, paddingRight:15, paddingLeft:15}}>
          <Text>Logout</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity style={{backgroundColor:'#edf2f0', borderRadius:50, padding:8}}>
          <Ionicons name="notifications-sharp" color="#2a2e2c" size={25} />
        </TouchableOpacity> */}
      </View>
      <View style={{ marginBottom: 15 }}>
        {/* Carousel */}
        <Animated.FlatList
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
        />

        {/* Pagination Dots */}
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
        </View>
      </View>

      <BannerAds />

      <View style={{ marginHorizontal: 10, marginTop: 10, alignItems: 'center', backgroundColor: '#cef0d7', padding: 5, borderRadius: 10, marginTop: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#2f3640' }}>
          Total Spent: ₹{totalSpent.toFixed(2)}
        </Text>
      </View>


      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 10, paddingBottom: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Resent Trip</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddTrip')} style={{ backgroundColor: '#f2f3f5', borderRadius: 15, padding: 5, paddingLeft: 15, paddingRight: 15 }}>
          <Text>Add Trip</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 10, paddingBottom: 20 }}>
        <FlatList
          data={trips}
          // numColumns={2}
          ListEmptyComponent={EmpityList()}
          keyExtractor={items => items.id}
          showsVerticalScrollIndicator={false}
          // columnWrapperStyle={{
          //   justifyContent: 'center'
          // }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity onPress={() => navigation.navigate('ExpenseScreen', { ...item })} style={{ backgroundColor: '#f2f3f5', borderRadius: 10, margin: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={randemImage()} style={{ width: 80, height: 80, borderRadius: 10 }} />
                    <View>
                      <Text style={{ fontWeight: '800', marginLeft: 10 }}>{item.place}</Text>
                      <Text style={{ marginLeft: 10, marginBottom: 10 }}>{item.countery}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
                    <View style={{ marginRight: 1, alignItems: 'flex-end' }}>
                      <Text style={{ fontWeight: '600', color: 'green', fontSize: 12 }}>Total Spend</Text>
                      <Text style={{ fontWeight: '600', color: "red" }}>₹ {tripTotals[item.id]?.toFixed(2) || 0}</Text>
                    </View>
                    {/* <TouchableOpacity
                      onPress={() => handleDeleteTrip(item.id)} // <-- Add this
                      style={{
                        marginLeft: 10,
                        padding: 8,
                        backgroundColor: 'gray',
                        borderRadius: 50
                      }}
                    >
                      <MaterialIcons name="delete-outline" size={20} color='white' />
                    </TouchableOpacity> */}
                    <TouchableOpacity
                      onPress={() => {
                        setGroupToDelete(item.id);
                        setShowDeleteConfirm(true);
                      }}
                    >
                      <MaterialIcons name="delete-outline" size={24} color="red" />
                    </TouchableOpacity>


                  </View>

                </View>
              </TouchableOpacity>
            )
          }}
        />
      </ScrollView>

    </SafeAreaView>
  );
};

export default HomeScreen;

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
    height: 100, // <-- set fixed height
    marginHorizontal: 5,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#c9c6c6ff',
  },
  carouselImage: {
    width: '100%',
    height: '100%', // <-- stretch image to match 300 height of container
    borderRadius: 16,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
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
