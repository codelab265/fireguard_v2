import { View, Text } from "react-native";
import React from "react";
import { Video, ResizeMode } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BASE_URL, BASE_URL2 } from "../src/config/API";
import { Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { Button, Dialog, Portal } from "react-native-paper";
import axios from "axios";
import { useAuthContext } from "../src/context/AuthContext";

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");
const FONT_SIZE = 14;

const ViewVideo = () => {
  const { video, role } = useLocalSearchParams();
  const { setUploadedVideos } = useAuthContext();
  const [visible, setVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    await axios
      .post(`${BASE_URL}/user/video/delete`, { id: video.id, user_id: video.user_id })
      .then((response) => {
        setIsLoading(false);
        setVisible(false);
        setUploadedVideos(response.data);
        router.back();
      })
      .catch((error) => {
        setVisible(false);
        setIsLoading(false);
        console.log(error);
      });
  };

  const hideDialog = () => setVisible(false);
  const showDialog = () => setVisible(true);

  return (
    <View className="flex-1 relative">
      {!role && (
        <View className="absolute right-0 top-0 w-10 h-10 flex items-center justify-center bg-white rounded-bl-md border-l-4 border-b-4 border-primary z-10">
          <TouchableOpacity onPress={showDialog}>
            <Text className="text-red-500">
              <FontAwesome name="times" size={20} />
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Video
        style={{ height: DEVICE_HEIGHT - 100, marginBottom: 16 }}
        source={{
          uri: `${BASE_URL2}/${video.uri}`,
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        // onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Warning</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this image?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button
              onPress={handleDelete}
              loading={isLoading}
              disabled={isLoading}
            >
              <Text className="text-red-500">Yes, continue</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default ViewVideo;
