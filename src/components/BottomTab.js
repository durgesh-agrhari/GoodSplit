// BottomTab.js (or BottomTabNavigator.js)
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/homeScreen/HomeScreen';
import ProfileScree from '../screens/profileScreen/ProfileScree';
import GroupScreen from '../screens/groupScreen/GroupScreen';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeScreen') iconName = focused ? 'layers' : 'layers-outline';
          else if (route.name === 'GroupScreen') iconName = focused ? 'people-sharp' : 'people-outline' ;
          else if (route.name === 'ProfileScreen') iconName = focused ? 'person-sharp' : 'person-outline' ;
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'You' }} />
      <Tab.Screen name="GroupScreen" component={GroupScreen} options={{ title: 'Groups' }} />
      <Tab.Screen name="ProfileScreen" component={ProfileScree} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default BottomTab;