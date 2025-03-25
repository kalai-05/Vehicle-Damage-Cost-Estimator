
import React from 'react'
import { Tabs } from 'expo-router'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function TabLayout() {

  return (

    <Tabs

    screenOptions={{
    headerShown:false,
    tabBarActiveTintColor: '#006666', // Set active color
    tabBarInactiveTintColor: 'gray', // Optional: Set inactive color
    tabBarStyle: { backgroundColor: 'white' }, // Optional: Background color
  }}
>

  <Tabs.Screen
    name="home"
    options={{
      tabBarLabel: 'Home',
      tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
    }}
  />

  <Tabs.Screen
    name="explore"
    options={{
      tabBarLabel: 'Usage',
      tabBarIcon: ({ color }) => <MaterialCommunityIcons name="chart-histogram" size={24} color={color} />,
    }}
  />

  <Tabs.Screen
    name="cost"
    options={{
      tabBarLabel: 'Cost',
      tabBarIcon: ({ color }) => <Entypo name="price-tag" size={24} color={color} />,
    }}
  />

  <Tabs.Screen
    name="profile"
    options={{
      tabBarLabel: 'Profile',
      tabBarIcon: ({ color }) => <FontAwesome name="user-circle-o" size={24} color={color} />,
    }}
  />

</Tabs>
  )
}