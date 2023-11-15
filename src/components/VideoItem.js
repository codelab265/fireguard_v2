import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { BASE_URL2 } from "../config/API";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "expo-router";

const VideoItem = ({ item , role}) => {
  const route = useNavigation();
  return (
    <View className="w-1/2 h-[200px] border-4 border-white  overflow-hidden">
      <TouchableOpacity onPress={()=>route.navigate('ViewVideo', {video:item, role:role})}>
        <Image
          source={{ uri: `${BASE_URL2}/${item?.thumbnail}` }}
          resizeMode="cover"
          className="w-full h-full rounded-lg"
        />
      </TouchableOpacity>
    </View>
  );
};

export default VideoItem;
