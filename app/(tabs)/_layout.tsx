
import React from 'react'
import { Tabs } from 'expo-router'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown:false
    }}>
        <Tabs.Screen name='home' options={{
          tabBarLabel:'Home',
          tabBarIcon:({color})=><Ionicons name="home" size={24} color={color} />

        }}/>
        <Tabs.Screen name='explore' options={{
          tabBarLabel:'Explore',
          tabBarIcon:({color})=><MaterialIcons name="explore" size={24} color={color}  />
        }}/>
        <Tabs.Screen name='profile' options={{
          tabBarLabel:'Profile',
          tabBarIcon:({color})=><FontAwesome name="user-circle-o" size={24} color={color}  />
        }}/>
    </Tabs>
  )
}