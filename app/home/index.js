import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar, FAB, Searchbar } from "react-native-paper";
import ReportItem from "../../src/components/ReportItem";
import moment from "moment/moment";
import DateTimePicker from "react-native-modal-datetime-picker";
import { useAuthContext } from "../../src/context/AuthContext";
import { useNavigation } from "expo-router";
import Colors from "../../src/shared/Colors";

export default function Page() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const date = new Date();
  const [filterDate, setFilterDate] = useState(date.toString());
  const { userInfo } = useAuthContext();
  const router = useNavigation();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDatePicker = (date) => {
    setFilterDate(date);
    hideDatePicker();
  };
  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <View className="flex-1 relative  ">
        <View className="flex flex-row justify-between py-4 px-4 bg-primary">
          <View>
            <Text className="text-2xl font-Poppins_600 text-orange-100">
              Welcome,
            </Text>
            <Text className="text-lg font-Poppins_400 text-orange-50">
              {userInfo?.first_name}
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={()=>router.navigate('AccountDetails')}>
              <Avatar.Text
                label={userInfo?.first_name?.charAt(0)}
                size={35}
                className="bg-white"
                labelStyle={{ fontFamily: "Poppins_600SemiBold", color:Colors.primary }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className="mt-4 px-4">
          <Pressable onPress={showDatePicker}>
            <Searchbar
              placeholder="Filter by Date"
              className="bg-white placeholder:font-Poppins_400"
              icon={"calendar"}
              editable={false}
            />
          </Pressable>
          <DateTimePicker
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDatePicker}
            onCancel={hideDatePicker}
          />
        </View>

        <View className="mt-4 px-4">
          <Text className="font-Poppins_600 text-2xl text-slate-900">
            My reports
          </Text>
        </View>
        <View className="flex-1 mt-2 px-4">
          <ScrollView showsVerticalScrollIndicator={false}>
            <ReportItem />
          </ScrollView>
        </View>

        <TouchableOpacity className="absolute right-4 bottom-4">
          <FAB icon={"plus"} className="bg-primary" color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
