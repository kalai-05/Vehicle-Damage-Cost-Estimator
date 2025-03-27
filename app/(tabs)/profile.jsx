import { View, Text } from "react-native";
import React from "react";
import Profile from "../../components/Profile/profile";
import ChatBot from "../../components/ChatBot";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function profile() {
  return (
    <GestureHandlerRootView style={{ flexGrow: 1 }}>
      <Profile />
      <ChatBot />
    </GestureHandlerRootView>
  );
}
