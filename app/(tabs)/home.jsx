import { View, Text } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import ChatBot from "../../components/ChatBot";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function home() {
  return (
    <GestureHandlerRootView style={{ flexGrow: 1 }}>
      <Header />
      <Slider />
      <ChatBot />
    </GestureHandlerRootView>
  );
}
