import {
    KeyboardAvoidingView,
    Image,
    Text,
    View,
    ScrollView,
  } from "react-native";
  import { SafeAreaView } from "react-native-safe-area-context";
  
  import Logo from "../src/assets/icon.png";
  import { Button, TextInput } from "react-native-paper";
  import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
  
  
  export default function Login() {
    const router = useRouter();
    return (
      <SafeAreaView style={{ flexGrow: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View className="flex-1 p-4 px-6 flex items-center justify-center">
              <Image source={Logo} className="w-[100px] h-[150px] " />
              <Text className="font-Poppins_600 text-2xl mt-2 text-orange-500">
                FIREGUARD
              </Text>
              <Text className="font-Poppins_500 self-start text-lg mt-10">
                Sign In
              </Text>
              <View className="w-full mt-2">
                <TextInput label={"Email"} mode="outlined" keyboardType="email-address" outlineColor='#ddd' />
              </View>
  
              <View className="w-full mt-4">
                <TextInput label={"Password"} mode="outlined" secureTextEntry outlineColor='#ddd' />
              </View>
  
              <View className="w-full mt-4">
                <Button className="bg-orange-500 w-full py-[4px]" onPress={()=>router.push('home')}>
                  <Text className="text-orange-100 font-Poppins_500 text-base">
                    Sign in
                  </Text>
                </Button>
              </View>
              <View className="flex flex-row items-center gap-x-2 mt-10">
                <Text className="font-Poppins_400 text-base">
                  Don`t have an account?
                </Text>
                <TouchableOpacity onPress={()=>router.push('Register')}>
                  <Text className="font-Poppins_600 text-base text-[#72b043]">Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  