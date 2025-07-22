import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../config/firebse';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import BannerAds from '../adManager/BannerAds';

const ProfileScree = () => {
  const navigation = useNavigation();
  const { userData, logout } = useAuth();
  const user = auth.currentUser;
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout(); // Trigger actual logout
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <View style={styles.container}>
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* 👤 Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: user?.photoURL || 'https://cdn-icons-png.freepik.com/512/4122/4122901.png' }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{userData?.name || 'User Name'}</Text>
        <Text style={styles.email}>{userData?.email}</Text>
      </View>

      {/* 📋 Options */}
      <View style={styles.optionList}>
        <OptionItem icon="information-circle-outline" label="About" onPress={() => navigation.navigate('AboutScreen')} />
        <OptionItem icon="lock-closed-outline" label="Privacy Policy" onPress={() => navigation.navigate('PrivacyPolicyScreen')} />
        <OptionItem icon="star-outline" label="Rate GoodSplit" onPress={() => {}} />
        <OptionItem icon="chatbox-ellipses-outline" label="Feedback or Suggestion" onPress={() => navigation.navigate('FeedbackScreen')} />
      </View>

      

      {/* 🚪 Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={() => setShowLogoutModal(true)}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* 🔒 Logout Modal */}
      <Modal
        transparent
        visible={showLogoutModal}
        animationType="fade"
        onRequestClose={cancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={cancelLogout}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmLogout}>
                <Text style={styles.confirmText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{marginLeft:-20}}>
      <BannerAds/>
      </View>
    </View>
  );
};

const OptionItem = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.optionItem} onPress={onPress}>
    <Icon name={icon} size={22} color="#555" />
    <Text style={styles.optionText}>{label}</Text>
  </TouchableOpacity>
);

export default ProfileScree;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  optionList: {
    marginTop: 20,
    gap: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    elevation: 2,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  logoutBtn: {
    marginTop: 'auto',
    marginBottom: 40,
    backgroundColor: '#ff4d4f',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // 🔒 Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  cancelBtn: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmBtn: {
    backgroundColor: '#ff4d4f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelText: {
    color: '#000',
    fontWeight: 'bold',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});


// import { StyleSheet, Text, View, TouchableOpacity, Image, Modal } from 'react-native';
// import React, { useState } from 'react';
// import { useNavigation } from '@react-navigation/native';
// import { auth } from '../../config/firebse'; // adjust path if needed
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useAuth } from '../../context/AuthContext';

// const ProfileScree = () => {
//   const navigation = useNavigation();
//   const { userData, logout } = useAuth();
//   const user = auth.currentUser;
//   const [showLogoutModal, setShowLogoutModal] = useState(false);

//   const confirmLogout = () => {
//     setShowLogoutModal(false);
//     logout(); // Log the user out
//   };

//   return (
//     <View style={styles.container}>
//       {/* 🔙 Back Button */}
//       <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
//         <Icon name="arrow-back" size={24} color="#333" />
//       </TouchableOpacity>

//       {/* 👤 Profile Section */}
//       <View style={styles.profileSection}>
//         <Image
//           source={{ uri: user?.photoURL || 'https://cdn-icons-png.freepik.com/512/4122/4122901.png' }}
//           style={styles.avatar}
//         />
//         <Text style={styles.userName}>{userData?.name || 'User Name'}</Text>
//         <Text style={styles.email}>{userData?.email}</Text>
//       </View>

//       {/* 📋 Options */}
//       <View style={styles.optionList}>
//         <OptionItem icon="information-circle-outline" label="About" onPress={() => navigation.navigate('AboutScreen')} />
//         <OptionItem icon="lock-closed-outline" label="Privacy Policy" onPress={() => navigation.navigate('PrivacyPolicyScreen')} />
//         <OptionItem icon="star-outline" label="Rate GoodSplit" onPress={() => {}} />
//         <OptionItem icon="chatbox-ellipses-outline" label="Feedback or Suggestion" onPress={() => navigation.navigate('FeedbackScreen')} />
//       </View>

//       {/* 🚪 Logout */}
//       <TouchableOpacity style={styles.logoutBtn} onPress={() => setShowLogoutModal(true)}>
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>

//       {/* 🔲 Logout Confirmation Modal */}
//       <Modal visible={showLogoutModal} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Are you sure you want to logout?</Text>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowLogoutModal(false)}>
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.confirmBtn} onPress={confirmLogout}>
//                 <Text style={styles.confirmText}>Logout</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const OptionItem = ({ icon, label, onPress }) => (
//   <TouchableOpacity style={styles.optionItem} onPress={onPress}>
//     <Icon name={icon} size={22} color="#555" />
//     <Text style={styles.optionText}>{label}</Text>
//   </TouchableOpacity>
// );

// export default ProfileScree;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//     paddingTop: 50,
//     paddingHorizontal: 20,
//   },
//   backBtn: {
//     position: 'absolute',
//     top: 50,
//     left: 20,
//     zIndex: 1,
//   },
//   profileSection: {
//     alignItems: 'center',
//     marginTop: 30,
//     marginBottom: 30,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#ccc',
//   },
//   userName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginTop: 12,
//   },
//   email: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 4,
//   },
//   optionList: {
//     marginTop: 20,
//     gap: 16,
//   },
//   optionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 14,
//     borderRadius: 12,
//     elevation: 2,
//   },
//   optionText: {
//     marginLeft: 12,
//     fontSize: 16,
//     color: '#333',
//   },
//   logoutBtn: {
//     marginTop: 'auto',
//     marginBottom: 40,
//     backgroundColor: '#ff4d4f',
//     padding: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   logoutText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },

//   // Modal styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '80%',
//     backgroundColor: '#fff',
//     padding: 24,
//     borderRadius: 16,
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 10,
//   },
//   cancelBtn: {
//     padding: 10,
//     backgroundColor: '#ccc',
//     borderRadius: 10,
//     width: 100,
//     alignItems: 'center',
//   },
//   cancelText: {
//     color: '#333',
//     fontWeight: 'bold',
//   },
//   confirmBtn: {
//     padding: 10,
//     backgroundColor: '#ff4d4f',
//     borderRadius: 10,
//     width: 100,
//     alignItems: 'center',
//   },
//   confirmText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });


// import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
// import React from 'react';
// import { useNavigation } from '@react-navigation/native';
// import { auth } from '../../config/firebse'; // adjust path if needed
// import Icon from 'react-native-vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useAuth } from '../../context/AuthContext';


// const ProfileScree = () => {
//   const navigation = useNavigation();
//   const { userData, logout} = useAuth();
//   const user = auth.currentUser;
  
//    const handleLogout = () => {
//     logout(); // make sure this is triggered
//   };

//   return (
//     <View style={styles.container}>
//       {/* 🔙 Back Button */}
//       <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
//         <Icon name="arrow-back" size={24} color="#333" />
//       </TouchableOpacity>

//       {/* 👤 Profile Section */}
//       <View style={styles.profileSection}>
//         <Image
//           source={{ uri: user?.photoURL || 'https://cdn-icons-png.freepik.com/512/4122/4122901.png' }}
//           style={styles.avatar}
//         />
//         <Text style={styles.userName}>{userData?.name || 'User Name'}</Text>
//         <Text style={styles.email}>{userData?.email}</Text>
//       </View>

//       {/* 📋 Options */}
//       <View style={styles.optionList}>
//         <OptionItem icon="information-circle-outline" label="About" onPress={() => navigation.navigate('AboutScreen')} />
//         <OptionItem icon="lock-closed-outline" label="Privacy Policy" onPress={() => navigation.navigate('PrivacyPolicyScreen')} />
//         <OptionItem icon="star-outline" label="Rate GoodSplit" onPress={() => {}} />
//         <OptionItem icon="chatbox-ellipses-outline" label="Feedback or Suggestion" onPress={() => navigation.navigate('FeedbackScreen')} />
//       </View>

//       {/* 🚪 Logout */}
//       <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
//         <Text style={styles.logoutText}>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const OptionItem = ({ icon, label, onPress }) => (
//   <TouchableOpacity style={styles.optionItem} onPress={onPress}>
//     <Icon name={icon} size={22} color="#555" />
//     <Text style={styles.optionText}>{label}</Text>
//   </TouchableOpacity>
// );

// export default ProfileScree;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//     paddingTop: 50,
//     paddingHorizontal: 20,
//   },
//   backBtn: {
//     position: 'absolute',
//     top: 50,
//     left: 20,
//     zIndex: 1,
//   },
//   profileSection: {
//     alignItems: 'center',
//     marginTop: 30,
//     marginBottom: 30,
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#ccc',
//   },
//   userName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginTop: 12,
//   },
//   email: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 4,
//   },
//   optionList: {
//     marginTop: 20,
//     gap: 16,
//   },
//   optionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 14,
//     borderRadius: 12,
//     elevation: 2,
//   },
//   optionText: {
//     marginLeft: 12,
//     fontSize: 16,
//     color: '#333',
//   },
//   logoutBtn: {
//     marginTop: 'auto',
//     marginBottom: 40,
//     backgroundColor: '#ff4d4f',
//     padding: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   logoutText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });
