import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Colors from "../../src/shared/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { Divider } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "expo-router";

const profile = () => {
  const router = useNavigation();
  return (
    <>
      <StatusBar backgroundColor={Colors.secondary} />
      <SafeAreaView style={{ flexGrow: 1 }}>
        <View className="flex-1">
          <View className="flex-[2] bg-secondary flex items-center justify-center">
            <View className="w-28 h-28 bg-blue-100 rounded-full flex items-center justify-center">
              <Text className="font-Poppins_600 text-3xl text-secondary">
                M
              </Text>
            </View>
            <View className="flex flex-col items-center mt-4">
              <Text className="text-2xl font-Poppins_600 text-blue-100">
                Mphatso Mlenga
              </Text>
              <Text className="text-blue-100 font-Poppins_400">
                mphatsomlenga1@gmail.com
              </Text>
            </View>
          </View>
          <View className="flex-[3] p-4">
            <View>
              <Text className="text-lg font-Poppins_500">Settings</Text>
            </View>
            <View className="flex-1 flex-col">
              <TouchableOpacity
                onPress={() => router.navigate("AccountDetails")}
              >
                <View className="flex flex-row justify-between items-center mt-8">
                  <View className="flex flex-row items-center">
                    <View className="w-6">
                      <FontAwesome5 name="user" size={20} />
                    </View>
                    <Text
                      className="text-base ml-2"
                      style={{ fontFamily: "Poppins_400Regular" }}
                    >
                      Account Details
                    </Text>
                  </View>
                  <View>
                    <FontAwesome5 name="chevron-right" size={16} />
                  </View>
                </View>
                <Divider className="mt-4" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.navigate("AccountEdit")}>
                <View className="flex flex-row justify-between items-center mt-8">
                  <View className="flex flex-row items-center">
                    <View className="w-6">
                      <FontAwesome5 name="edit" size={20} />
                    </View>
                    <Text
                      className="text-base ml-2"
                      style={{ fontFamily: "Poppins_400Regular" }}
                    >
                      Edit Account
                    </Text>
                  </View>
                  <View>
                    <FontAwesome5 name="chevron-right" size={16} />
                  </View>
                </View>
                <Divider className="mt-4" />
              </TouchableOpacity>

              <TouchableOpacity>
                <View className="flex flex-row justify-between items-center mt-8">
                  <View className="flex flex-row items-center">
                    <View className="w-6">
                      <FontAwesome5 name="power-off" size={20} />
                    </View>
                    <Text
                      className="text-base ml-2"
                      style={{ fontFamily: "Poppins_400Regular" }}
                    >
                      Logout
                    </Text>
                  </View>
                  <View>
                    <FontAwesome5 name="chevron-right" size={16} />
                  </View>
                </View>
                <Divider className="mt-4" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default profile;
