import { View, Text } from "react-native";
import React from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import ChatItem from "../../src/components/ChatItem";

const chat = () => {
  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <View className="flex-1">
        <View className="flex flex-row items-center py-2 px-4 shadow-lg bg-primary pt-4">
          <Text className="text-lg text-orange-100 font-Poppins_500">
            Messages
          </Text>
        </View>
        <View className="flex-1">
          
          <View className="flex-1 flex-col">
            <ChatItem />
            <ChatItem />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default chat;
