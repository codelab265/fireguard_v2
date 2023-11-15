import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import data from "../../src/data";

const equipments = () => {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <View className="p-4">
          <Text className="font-Poppins_600 text-xl">Suggested tools</Text>
        </View>
        <Divider className="my-2" />
        <View className="flex-1 px-4">
          <ScrollView showsVerticalScrollIndicator={false}>
            {data.map((item) => (
              <View
                className="w-full p-2 bg-white rounded-md mb-2 border border-gray-300"
                key={item.tool}
              >
                <Text className="font-Poppins_500 text-lg">{item.tool}</Text>
                <Text className="mt-1 font-Poppins_400 text-sm text-gray-500">
                  {item.use}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default equipments;
