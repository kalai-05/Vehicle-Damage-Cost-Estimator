import { View, Text } from "react-native";
import React from "react";
import Slider from "../../components/Home/Slider";
import ChatBot from "../../components/ChatBot";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function home() {
  return (
    <GestureHandlerRootView style={{ flexGrow: 1 }}>
      <Slider />
      <ChatBot />
    </GestureHandlerRootView>
  );
}
