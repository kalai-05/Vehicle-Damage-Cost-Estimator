import { View, Text } from "react-native";
import React from "react";
import History from "../../components/Explore/History";
import ChatBot from "../../components/ChatBot";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function explore() {
  return (
    <GestureHandlerRootView style={{ flexGrow: 1 }}>
      <History />
      <ChatBot />
    </GestureHandlerRootView>
  );
}
