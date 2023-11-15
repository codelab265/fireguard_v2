import { useState } from "react";
import { View, Text, Image } from "react-native";
import React from "react";
import * as VideoThumbnails from "expo-video-thumbnails";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../src/shared/Colors";
import { Button } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useAuthContext } from "../src/context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../src/config/API";
import { Alert } from "react-native";

const UploadVideos = () => {
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setUploadedVideos, userInfo } = useAuthContext();
 

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {

      
      setVideo(result.assets[0]);
      // Generate a thumbnail for the selected video
      const { assets } = result;
      const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(
        assets[0].uri,
        {
          time: 0,
        }
      );

      setThumbnail(thumbnailUri);
    }
  };

  

  const uploadVideo = async () => {
    if (video) {
      setLoading(true);
      const formData = new FormData();
      formData.append("video", {
        uri: video.uri,
        type: "video/mp4", // Change the type based on the video format
        name: "video.mp4",
      });

      formData.append('thumbnail', {
        uri: thumbnail,
        type: "image/jpeg",
        name: "image.jpg",
      });

      try {

        formData.append("user_id", userInfo?.id);
        const response = await axios.post(
          `${BASE_URL}/user/upload-video`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            transformRequest: (data, headers) => {
              return formData;
            },
          }
        );
        // Handle the response from your Laravel API
        const data = await response.data;
        setUploadedVideos(data);
        setLoading(false);
        setVideo(null);
        console.log("Upload success:", data);
      } catch (error) {
        setLoading(false);
        console.error("Error uploading video:", error);
      }
    }
  };

  return (
    <View className="flex-1 p-4">
      {video == null ? (
        <View className="flex-1 items-center justify-center">
          <Button onPress={pickVideo}>
            <Text className="text-base font-Poppins_600">
              Click to select video
            </Text>
          </Button>
        </View>
      ) : (
        <View className="flex flex-1 flex-col">
          {thumbnail && (
            <View className="w-full bg-white mb-2 rounded-lg border border-gray-300 relative">
              <TouchableOpacity>
                <Image
                  resizeMode="contain"
                  source={{ uri: thumbnail }}
                  alt="image"
                  className="w-[200px] h-[200px]"
                />
              </TouchableOpacity>
              <Button
                onPress={() => {
                  setVideo(null);
                }}
                className="absolute top-1 right-[1px]"
              >
                <FontAwesome name="times" size={20} color={Colors.primary} />
              </Button>
            </View>
          )}
        </View>
      )}
      <Button
        disabled={video == null || loading}
        onPress={uploadVideo}
        mode="contained"
        className="py-1"
        loading={loading}
      >
        <Text className="font-Poppins_500 text-base">Upload</Text>
      </Button>
    </View>
  );
};

export default UploadVideos;
