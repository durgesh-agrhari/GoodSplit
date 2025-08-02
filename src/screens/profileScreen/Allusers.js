import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebse'; // Adjust the path if needed

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);

      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  console.log("users", users)

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={
          item.profileImage
            ? { uri: item.profileImage }
            : require('../../assets/logo/logo.png') // Add a default image in your assets
        }
        style={styles.avatar}
      />
      <Text style={styles.name}>{item.displayName || 'Unnamed'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>All Registered Users</Text>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#4caf50" />
        </View>
      ) : users.length === 0 ? (
        <Text style={styles.empty}>No users found</Text>
      ) : (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
};

export default AllUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f3f5',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 2,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: '#ccc',
  },
  name: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: '600',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 30,
  },
});


// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   SafeAreaView,
// } from 'react-native';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { useAuth } from '../../context/AuthContext';
// import { db } from '../../config/firebse';

// const AllTrips = () => {
//   const { userData } = useAuth(); // get current user
//   const [trips, setTrips] = useState([]);
//   const [tripTotals, setTripTotals] = useState({});
//   const [totalSpent, setTotalSpent] = useState(0);
//   const [loading, setLoading] = useState(true);

//   const tripsRef = collection(db, 'trips');
//   const expensesRef = collection(db, 'expenses');

//   const fetchTrip = async () => {
//     setLoading(true);
//     try {
//       const q = query(tripsRef, where('userId', '==', userData.uid));
//       const tripSnapshot = await getDocs(q);

//       const tripData = [];
//       const totals = {};
//       let grandTotal = 0;

//       for (const doc of tripSnapshot.docs) {
//         const trip = { ...doc.data(), id: doc.id };
//         tripData.push(trip);

//         const expenseQuery = query(expensesRef, where('tripId', '==', trip.id));
//         const expenseSnapshot = await getDocs(expenseQuery);

//         let total = 0;
//         expenseSnapshot.forEach(exp => {
//           const amount = parseFloat(
//             exp.data().amount?.toString().replace(/[^0-9.]/g, '')
//           ) || 0;
//           total += amount;
//         });

//         totals[trip.id] = total;
//         grandTotal += total;
//       }

//       setTrips(tripData);
//       setTripTotals(totals);
//       setTotalSpent(grandTotal);
//     } catch (err) {
//       console.error('Error fetching trips:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTrip();
//   }, []);

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Text style={styles.tripName}>{item.name}</Text>
//       <Text style={styles.total}>Spent: ₹{tripTotals[item.id]?.toFixed(2)}</Text>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.header}>All Trips</Text>
//       {loading ? (
//         <View style={styles.loading}>
//           <ActivityIndicator size="large" color="#4caf50" />
//         </View>
//       ) : trips.length === 0 ? (
//         <Text style={styles.empty}>No trips found</Text>
//       ) : (
//         <>
//           <FlatList
//             data={trips}
//             renderItem={renderItem}
//             keyExtractor={item => item.id}
//             contentContainerStyle={{ paddingBottom: 20 }}
//           />
//           <Text style={styles.grandTotal}>Total Spent: ₹{totalSpent.toFixed(2)}</Text>
//         </>
//       )}
//     </SafeAreaView>
//   );
// };

// export default AllTrips;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 15,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: '700',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   card: {
//     backgroundColor: '#f2f3f5',
//     padding: 15,
//     borderRadius: 10,
//     marginVertical: 8,
//     elevation: 2,
//   },
//   tripName: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   total: {
//     fontSize: 15,
//     color: '#555',
//     marginTop: 4,
//   },
//   grandTotal: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#1a8917',
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   loading: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   empty: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#777',
//     marginTop: 30,
//   },
// });


// // import React, { useEffect, useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   FlatList,
// //   Image,
// //   StyleSheet,
// //   ActivityIndicator,
// //   SafeAreaView,
// // } from 'react-native';
// // import firestore from '@react-native-firebase/firestore';

// // const AllUsers = () => {
// //   const [users, setUsers] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const fetchAllUsers = async () => {
// //     try {
// //       const userSnapshot = await firestore().collection('users').get();
// //       const userList = userSnapshot.docs.map(doc => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       }));
// //       setUsers(userList);
// //     } catch (error) {
// //       console.log('Error fetching users: ', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchAllUsers();
// //   }, []);

// //   const renderItem = ({ item }) => (
// //     <View style={styles.card}>
// //       <Image
// //         source={
// //           item.profileImage
// //             ? { uri: item.profileImage }
// //             : require('../../assets/default-user.png') // fallback image
// //         }
// //         style={styles.avatar}
// //       />
// //       <View style={styles.userInfo}>
// //         <Text style={styles.name}>{item.name || 'Unnamed'}</Text>
// //         <Text style={styles.email}>{item.email}</Text>
// //       </View>
// //     </View>
// //   );

// //   if (loading) {
// //     return (
// //       <View style={styles.centered}>
// //         <ActivityIndicator size="large" color="#4caf50" />
// //       </View>
// //     );
// //   }

// //   if (users.length === 0) {
// //     return (
// //       <View style={styles.centered}>
// //         <Text style={styles.emptyText}>No users found.</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <Text style={styles.title}>All Users</Text>
// //       <FlatList
// //         data={users}
// //         renderItem={renderItem}
// //         keyExtractor={item => item.id}
// //         contentContainerStyle={styles.listContainer}
// //         showsVerticalScrollIndicator={false}
// //       />
// //     </SafeAreaView>
// //   );
// // };

// // export default AllUsers;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //   },
// //   listContainer: {
// //     paddingHorizontal: 15,
// //     paddingTop: 10,
// //     paddingBottom: 30,
// //   },
// //   title: {
// //     fontSize: 22,
// //     fontWeight: '700',
// //     marginTop: 10,
// //     textAlign: 'center',
// //   },
// //   card: {
// //     flexDirection: 'row',
// //     backgroundColor: '#f2f3f5',
// //     padding: 15,
// //     marginVertical: 8,
// //     borderRadius: 15,
// //     alignItems: 'center',
// //     elevation: 2,
// //   },
// //   avatar: {
// //     width: 55,
// //     height: 55,
// //     borderRadius: 30,
// //     backgroundColor: '#ccc',
// //   },
// //   userInfo: {
// //     marginLeft: 15,
// //     flex: 1,
// //   },
// //   name: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //   },
// //   email: {
// //     fontSize: 14,
// //     color: '#555',
// //     marginTop: 3,
// //   },
// //   centered: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   emptyText: {
// //     fontSize: 16,
// //     color: '#777',
// //   },
// // });
