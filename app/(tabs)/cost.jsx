import { View, Text } from "react-native";
import React from "react";
import CostPrediction from "../../components/Cost";
import ChatBot from "../../components/ChatBot";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function cost() {
  return (
    <GestureHandlerRootView style={{ flexGrow: 1 }}>
      <CostPrediction />
      <ChatBot />
    </GestureHandlerRootView>
  );
}
