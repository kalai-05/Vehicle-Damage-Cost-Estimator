import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Header() {
  const { user } = useUser();
  return (
    <View
      style={{
        padding: 30,
        paddingTop: 70,
        backgroundColor: "#006666", // Primary teal color
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: user?.imageUrl }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: "#b2d8d8", // Light teal border
          }}
        />
        <View>
          <Text
            style={{
              fontSize: 14,
              color: "#e0f2f1", // Light teal text
              fontFamily: "poppins",
              textAlign: "left",
            }}
          >
            Welcome back,
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#ffffff", // White text
              fontFamily: "poppins",
              fontWeight: "600",
              textAlign: "left",
            }}
          >
            {user?.fullName} 👋🏻
          </Text>
        </View>
      </View>
    </View>
  );
}
