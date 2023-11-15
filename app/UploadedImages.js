import { View, Text } from "react-native";
import React from "react";
import {
  useLocalSearchParams,
  useNavigation,
  useRouter,
  useSearchParams,
} from "expo-router";
import ImageItem from "../src/components/ImageItem";
import { FlatList } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { useState } from "react";
import VideoItem from "../src/components/VideoItem";

const UploadedImages = () => {
  const [segment, setSegment] = useState(1);
  let { images, videos, user } = useLocalSearchParams();

  const router = useRouter();
  const navigate = useNavigation();

  return (
    <View className="flex-1">
      <View className="flex flex-row items-center space-x-1 px-4 pt-4">
        <Text className="font-Poppins_400">By </Text>
        <Text className="font-Poppins_500">{user}</Text>
      </View>
      <View className="w-full flex flex-row px-4 mt-4">
        <SegmentedButtons
          style={{ width: "100%" }}
          value={segment}
          onValueChange={setSegment}
          buttons={[
            {
              value: "1",
              label: `Images (${images.length})`,
            },
            {
              value: "2",
              label: `Videos (${videos.length})`,
            },
          ]}
        />
      </View>
      {segment == 1 ? (
        <View className="flex-1 p-4">
          <FlatList
            numColumns={2}
            data={images}
            renderItem={({ item }) => <ImageItem item={item} role={true} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ justifyContent: "space-between" }}
          />
        </View>
      ) : (
        <View className="flex-1 p-4">
          <FlatList
            numColumns={2}
            data={videos}
            renderItem={({ item }) => <VideoItem item={item} role={true} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ justifyContent: "space-between" }}
          />
        </View>
      )}
    </View>
  );
};

export default UploadedImages;
