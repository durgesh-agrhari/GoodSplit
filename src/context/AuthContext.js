import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebse';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const loadFromStorage = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const user = await AsyncStorage.getItem('userData');
        console.log('🔄 Loading from AsyncStorage...');
        console.log('📦 Stored token:', token);
        console.log('📦 Stored userData:', user);

        if (token) setUserToken(token);
        if (user) setUserData(JSON.parse(user));
      } catch (e) {
        console.error('❌ Error loading from AsyncStorage:', e);
      }
    };

    loadFromStorage();
  }, []);

  const login = async (email, password) => {
    try {
      setUserLoading(true);
      console.log('🔐 Attempting login with:', email);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      const userInfo = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName || 'No Name',
        photo: userCredential.user.photoURL || null,
      };

      console.log('✅ Firebase login success');
      console.log('🪪 Token:', token);
      console.log('👤 User info:', userInfo);

      // Save token and user data
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userInfo));

      setUserToken(token);
      setUserData(userInfo);

      setUserLoading(false);
      return { success: true };
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      setUserLoading(false);
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      await signOut(auth);
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setUserToken(null);
      setUserData(null);
      console.log('✅ Logout successful');
    } catch (e) {
      console.error('❌ Logout failed:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, userToken, userData, userLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);



// import React, { createContext, useContext, useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
// import { auth } from '../config/firebse';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [userToken, setUserToken] = useState(null);
//   const [userData, setUserData] = useState(null); // ✅ Add user data state
//   const [userLoading, setUserLoading] = useState(false);

//   useEffect(() => {
//     const loadFromStorage = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         const user = await AsyncStorage.getItem('userData');
//         if (token && user) {
//           setUserToken(token);
//           setUserData(JSON.parse(user));
//         }
//       } catch (e) {
//         console.error('Error loading from AsyncStorage:', e);
//       }
//     };
//     loadFromStorage();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       setUserLoading(true);
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const token = await userCredential.user.getIdToken();

//       const userInfo = {
//         uid: userCredential.user.uid,
//         email: userCredential.user.email,
//         name: userCredential.user.displayName,
//         photo: userCredential.user.photoURL,
//       };

//       // Save to state and AsyncStorage
//       await AsyncStorage.setItem('userToken', token);
//       await AsyncStorage.setItem('userData', JSON.stringify(userInfo));

//       setUserToken(token);
//       setUserData(userInfo);

//       setUserLoading(false);
//       return { success: true };
//     } catch (error) {
//       setUserLoading(false);
//       return { success: false, message: error.message };
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       await AsyncStorage.removeItem('userToken');
//       await AsyncStorage.removeItem('userData');
//       setUserToken(null);
//       setUserData(null);
//     } catch (e) {
//       console.error('Logout failed', e);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ login, logout, userToken, userData, userLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


// import React, { createContext, useContext, useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
// import { auth } from '../config/firebse';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [userToken, setUserToken] = useState(null);
//   const [userLoading, setUserLoading] = useState(false);

//   useEffect(() => {
//     const loadToken = async () => {
//       const token = await AsyncStorage.getItem('userToken');
//       if (token) setUserToken(token);
//     };
//     loadToken();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       setUserLoading(true);
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const token = await userCredential.user.getIdToken();
//       await AsyncStorage.setItem('userToken', token);
//       setUserToken(token);
//       setUserLoading(false);
//       return { success: true };
//     } catch (error) {
//       setUserLoading(false);
//       return { success: false, message: error.message };
//     }
//   };

//   const logout = async () => {
//     await signOut(auth);
//     await AsyncStorage.removeItem('userToken');
//     setUserToken(null);
//   };

//   console.log("user token ", userToken)

//   return (
//     <AuthContext.Provider value={{ login, logout, userToken, userLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
