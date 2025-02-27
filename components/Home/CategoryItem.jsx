import { View, Image, Text, TouchableOpacity } from "react-native";
import React from "react";

export default function CategoryItem({ category, onCategoryPress }) {
  return (
    <TouchableOpacity onPress={() => onCategoryPress(category)}>
      <View
        style={{
          padding: 10,
          backgroundColor: "#CBC3E3",
          borderRadius: 100,
          marginRight: 15,
        }}
      >
        <Image
          source={{ uri: category.icon }}
          style={{ width: 40, height: 40 }}
        />
      </View>
      <Text style={{ fontSize: 15, marginLeft: 16, marginTop: 10 }}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}
