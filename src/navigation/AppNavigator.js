import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/homeScreen/HomeScreen';
import AddExpenseScreen from '../screens/homeScreen/AddExpenseScreen';
import AddTripScreen from '../screens/homeScreen/AddTripScreen';
import TripExpanseScreen from '../screens/homeScreen/TripExpanseScreen';
import WelcomeScreen from '../screens/welcomeScreen/WelcomeScreen';
import SigninScreen from '../screens/authScreen/SigninScreen';
import SignupScreen from '../screens/authScreen/SignupScreen';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebse';
import { setUser } from '../redux/slices/UserSlice';
import BottomTab from '../components/BottomTab';
import AboutScreen from '../screens/profileScreen/AboutScreen';
import PrivacyPolicyScreen from '../screens/profileScreen/PrivacyPolicyScreen';
import FeedbackScreen from '../screens/profileScreen/FeedbackScreen';
import Splacehome from '../screens/splashScreen/Splacehome';
import Splacehomeblogin from '../screens/splashScreen/Splacehomeblogin';
const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  const {user} = useSelector(state => state.user)

  const dispatch = useDispatch()

  onAuthStateChanged(auth, u => {
    // console.log("user info", u);
    dispatch(setUser(u));
  })
  if(user){
return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splacehome"
        screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="HomeScreen" component={HomeScreen} /> */}
          <Stack.Screen name="Splacehome" component={Splacehome} />
          <Stack.Screen name="BottomTab" component={BottomTab} />
          <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
          <Stack.Screen name="AddTrip" component={AddTripScreen} />
          <Stack.Screen name="ExpenseScreen" component={TripExpanseScreen} />
          <Stack.Screen name="AboutScreen" component={AboutScreen} />
          <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
          <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  }else{
return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splacehomeblogin"
        screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splacehomeblogin" component={Splacehomeblogin} />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="Signin" options ={{presentation:'modal'}} component={SigninScreen} />
          <Stack.Screen name="Signup" options ={{presentation:'modal'}} component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  }
};

export default AppNavigator;