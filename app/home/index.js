import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar, FAB, Searchbar } from "react-native-paper";
import ReportItem from "../../src/components/ReportItem";
import moment from "moment/moment";
import DateTimePicker from "react-native-modal-datetime-picker";

export default function Page() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const date = new Date();
  const [filterDate, setFilterDate] = useState(date.toString());

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
      <View className="flex-1 relative pt-4 px-4">
        <View className="flex flex-row justify-between">
          <View>
            <Text className="text-2xl font-Poppins_600 text-slate-900">
              Welcome,
            </Text>
            <Text className="text-lg font-Poppins_400 text-gray-600">
              Mphatso
            </Text>
          </View>
          <View>
            <TouchableOpacity>
              <Avatar.Text
                label="M"
                size={35}
                className="bg-secondary"
                labelStyle={{ fontFamily: "Poppins_600SemiBold" }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className="mt-4">
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

        <View className="mt-4">
          <Text className="font-Poppins_600 text-2xl text-slate-900">
            My reports
          </Text>
        </View>
        <View className="flex-1 mt-2">
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
