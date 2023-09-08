import { View, Text, Dimensions } from "react-native";
import React from "react";
import { Avatar, Divider } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "expo-router";

const ChatItem = () => {
  const  randomColor = ()=> {
    return 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
}

  const width = Dimensions.get("screen").width;

  const getColor = () => {
    const chatIndex = Math.floor(Math.random() * chatColors.length);
    const index = chatIndex % chatColors.length;
    return chatColors[index];
  };

  const router = useNavigation();
  return (
    <TouchableOpacity onPress={()=>router.navigate('Conversation')}>
      <View className="flex flex-row w-full p-4 bg-white">
        <View className="w-[15%]">
          <Avatar.Text
            size={50}
            label="I" 
            style={{ backgroundColor: randomColor() }}
            labelStyle={{ color: "#fff", fontFamily: "Poppins_500Medium" }}
          />
        </View>
        <View className="flex flex-col w-[85%] pl-2">
          <View className="flex flex-row justify-between items-center">
            <View className="">
              <Text className="text-base font-Poppins_600">
                Innocent Siwema
              </Text>
            </View>
            <View>
              <Text className="text-xs font-Poppins_400">19:00</Text>
            </View>
          </View>
          <View className="truncate">
            <Text numberOfLines={1} ellipsizeMode="tail" className="font-Poppins_400 text-xs text-gray-600"
            >
              The longest word in any of the major English language dictionaries
              is pneumonoultramicroscopicsilicovolcanoconiosis, a word that
              refers to a lung disease contracted from the inhalation of very
              fine silica particles, specifically from a volcano; medically, it
              is the same as silicosis.
            </Text>
          </View>
        </View>
      </View>
      <Divider/>
    </TouchableOpacity>
  );
};

export default ChatItem;
