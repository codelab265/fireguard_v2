import { View, Text } from "react-native";
import React from "react";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Divider } from "react-native-paper";
import { Color } from "../../utils/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";

const ReportItem = () => {
  return (
    <TouchableOpacity>
      <View className="w-full flex flex-col bg-white border border-gray-300 p-2 rounded-md mb-2">
        
        <View className="w-full flex flex-row">
          <View className="w-16 h-16 bg-secondary rounded-md flex items-center justify-center">
            <Text className="text-slate-100">
              <FontAwesome name="map-marker" size={30} />
            </Text>
          </View>
          <View className="ml-2">
            <View>
              <Text className="text-sm font-Poppins_500">Mphatso Mlenga</Text>
            </View>
            <View className="mt-1">
              <Text>Lilongwe, area 23</Text>
            </View>
            <View className="flex flex-row items-center gap-x-1 mt-1">
              <FontAwesome5 name="clock" color={Color.secondary} />
              <Text className="font-Poppins_500 text-secondary text-xs">
                2 Days ago
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ReportItem;
