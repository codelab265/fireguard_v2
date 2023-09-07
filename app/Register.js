import React from "react";
import {
  KeyboardAvoidingView,
  Image,
  Text,
  View,
  ScrollView,
  Pressable,
} from "react-native";

import {
  Button,
  Divider,
  Menu,
  RadioButton,
  TextInput,
} from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

const Register = () => {
  const [gender, setGender] = React.useState(false);

  const router = useRouter();
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-4 px-6">
          <Text className="font-Poppins_500 text-lg mt-2">
            Fill in your info
          </Text>
          <View className="w-full mt-4">
            <TextInput
              label={"First Name"}
              mode="outlined"
              keyboardType="default"
              outlineColor="#ddd"
            />
          </View>
          <View className="w-full mt-4">
            <TextInput
              label={"Last Name"}
              mode="outlined"
              keyboardType="default"
              outlineColor="#ddd"
            />
          </View>

          <View className="w-full mt-4">
            <TextInput
              label={"Email"}
              mode="outlined"
              keyboardType="email-address"
              outlineColor="#ddd"
            />
          </View>
          <View className="w-full mt-4">
            <TextInput
              label={"Phone Number"}
              mode="outlined"
              keyboardType="phone-pad"
              outlineColor="#ddd"
            />
          </View>

          <View className="w-full mt-4">
            <TextInput
              label={"Age"}
              mode="outlined"
              keyboardType="phone-pad"
              outlineColor="#ddd"
            />
          </View>

          <View className="w-full mt-4">
            <TextInput
              label={"Password"}
              mode="outlined"
              secureTextEntry
              keyboardType="url"
              outlineColor="#ddd"
            />
          </View>

          <View className="w-full mt-4 bg-white border border-[#ddd] rounded-md p-1 px-4">
            <Text className="text-base font-Poppins_400">
                Gender
            </Text>
            <RadioButton.Group
              onValueChange={(e) => setGender(e)}
              value={gender}
            >
              <View className="flex flex-row gap-x-4">
              <View className="flex flex-row items-center">
                <Text className="text-small font-Poppins_400">Male</Text>
                <RadioButton value="Male" />
              </View>
              <View className="flex flex-row items-center">
                <Text className="text-small font-Poppins_400">Female</Text>
                <RadioButton value="Female" />
              </View>
              </View>
            </RadioButton.Group>
          </View>

          <View className="w-full mt-4">
            <Button className="bg-orange-500 w-full py-[4px]">
              <Text className="text-orange-100 font-Poppins_500 text-base">
                Sign up
              </Text>
            </Button>
          </View>
          <View className="flex flex-row items-center justify-center gap-x-2 mt-10">
            <Text className="font-Poppins_400 text-base">Have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text className="font-Poppins_600 text-base text-secondary">
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;
