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
            width: 45,
            height: 45,
            borderRadius: 99,
          }}
        />
        <View>
          <Text
            style={{
              fontSize: 20,
              color: "#FFFFFF",
              fontFamily: "poppins",
            }}
          >
            Welcome,
          </Text>
          <Text
            style={{
              color: "#FFFFFF",
              fontFamily: "poppins",
            }}
          >
            {user?.fullName}
          </Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          padding: 10,
          gap: 10,
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <MaterialIcons name="manage-search" size={24} color="black" />

        <TextInput
          placeholder="Search Here..!"
          style={{
            fontFamily: "poppins",
            fontSize: 17,
          }}
        />
      </View>
    </View>
  );
}
