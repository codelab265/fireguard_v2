import { View, Text, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ActivityIndicator, FAB, SegmentedButtons } from "react-native-paper";
import { useNavigation } from "expo-router";
import { useAuthContext } from "../../src/context/AuthContext";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../src/config/API";
import { Color } from "../../src/utils/Colors";
import ImageItem from "../../src/components/ImageItem";
import VideoItem from "../../src/components/VideoItem";

const gallery = () => {
  const router = useNavigation();
  const { userInfo, uploadedImages, setUploadedImages, uploadedVideos, setUploadedVideos } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [segment, setSegment] = useState(1);

  useEffect(() => {
    getImages();
  }, []);

  const getImages = async () => {
    setLoading(true);
    await axios
      .get(`${BASE_URL}/user/files/${userInfo?.id}`)
      .then((response) => {
        setLoading(false);
        setUploadedImages(response.data.images);
        setUploadedVideos(response.data.videos);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };
  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <View className="flex-1 relative">
        <View className="flex flex-row items-center py-2 px-4 shadow-lg bg-primary pt-4">
          <Text className="text-lg text-orange-100 font-Poppins_500">
            Gallery
          </Text>
        </View>
        <View className="w-full flex flex-row px-4 mt-4">
          <SegmentedButtons
            style={{ width: "100%" }}
            value={segment}
            onValueChange={setSegment}
            buttons={[
              {
                value: "1",
                label: "Images",
              },
              {
                value: "2",
                label: "Videos",
              },
            ]}
          />
        </View>
        {segment == 1 ? (
          <View className="flex-1 p-4">
            {loading && (
              <View className="flex items-center justify-center mt-2">
                <ActivityIndicator color={Color.primary} size={"large"} />
              </View>
            )}

            {!loading && uploadedImages.length === 0 && (
              <View className="flex-1 items-center justify-center">
                <Text className="text-base font-Poppins_500 text-gray-500">
                  No image was uploaded
                </Text>
              </View>
            )}
            {!loading && uploadedImages.length > 0 && (
              <FlatList
                numColumns={2}
                data={uploadedImages}
                renderItem={({ item }) => <ImageItem item={item} role={false} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ justifyContent: "space-between" }}
              />
            )}
            <View className="absolute right-4 bottom-4">
              <FAB
                icon={"plus"}
                className="bg-primary"
                color="#fff"
                onPress={() => router.navigate("UploadImages")}
              />
            </View>
          </View>
        ) : (
          <View className="flex-1 p-4">
            {loading && (
              <View className="flex items-center justify-center mt-2">
                <ActivityIndicator color={Color.primary} size={"large"} />
              </View>
            )}

            {!loading && uploadedVideos.length === 0 && (
              <View className="flex-1 items-center justify-center">
                <Text className="text-base font-Poppins_500 text-gray-500">
                  No Video was uploaded
                </Text>
              </View>
            )}
            {!loading && uploadedVideos.length > 0 && (
              <FlatList
                numColumns={2}
                data={uploadedVideos}
                renderItem={({ item }) => <VideoItem item={item} role={false} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ justifyContent: "space-between" }}
              />
            )}
            <View className="absolute right-4 bottom-4">
              <FAB
                icon={"plus"}
                className="bg-primary"
                color="#fff"
                onPress={() => router.navigate("UploadVideos")}
              />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default gallery;
