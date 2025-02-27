import { View, Text, Image, TextInput } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { Colors } from "../../constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Header() {
  const { user } = useUser();
  return (
    <View
      style={{
        padding: 30,
        paddingTop: 60,
        backgroundColor: Colors.PRIMARY,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: user?.imageUrl }}
          style={{
            width: 68,
            height: 68,
            borderRadius: 99,
          }}
        />
        <View>
          <Text
            style={{
              fontSize: 16,
              color: "#000000",
              fontFamily: "poppins",
            }}
          >
            Welcome,
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: "#000000",
              fontFamily: "poppins",
            }}
          >
            {user?.fullName} 👋🏻
          </Text>
        </View>
      </View>
    </View>
  );
}
