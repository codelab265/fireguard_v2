import { View, Text, FlatList, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Banner,
  Button,
  Divider,
  FAB,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";
import axios from "axios";
import { BASE_URL } from "../src/config/API";
import EquipmentItem from "../src/components/fireguard/EquipmentItem";
import { useAuthContext } from "../src/context/AuthContext";

const Equipments = () => {
  const { id } = useSearchParams();
  const { equipments, setEquipments } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [createLoader, setCreateLoader] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [equipment, setEquipment] = useState("");

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20 };

  useEffect(() => {
    getEquipments();
  }, []);

  const getEquipments = async () => {
    setLoading(true);
    await axios
      .get(`${BASE_URL}/fireguard/equipments/${id}`)
      .then((response) => {
        setEquipments(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createEquipment = async () => {
    setCreateLoader(true);
    await axios
      .post(`${BASE_URL}/fireguard/equipment/create`, {
        report_id: id,
        name: equipment,
      })
      .then((response) => {
        setEquipments(response.data);
        setEquipment("");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setCreateLoader(false);
      });
  };

  const removeItem = async (item) => {
    await axios
      .delete(`${BASE_URL}/fireguard/equipment/delete/${item}/${id}`)
      .then((response) => {
        setEquipments(response.data);
        ToastAndroid.show("Equipment deleted successfully", ToastAndroid.LONG);
      })
      .catch((error) => {
        console.log(error);
      }).finally(() => {
        setCreateLoader(false);
      });;
      
  };

  return (
    <View className="flex-1 p-4 relative">
      <Banner visible={true}>
        <Text className="text-base font-Poppins_400">
          Suggest possible equipments in responding to the fire incident
        </Text>
      </Banner>
      <Divider className="my-3" />
      <Text className="font-Poppins_600 text-lg">Suggested equipments</Text>
      <View className="mt-4 flex-1">
        {loading ? (
          <View className="flex items-center justify-center">
            <ActivityIndicator size={"small"} />
          </View>
        ) : !loading && equipments.length > 0 ? (
          <FlatList
            data={equipments}
            renderItem={({ item }) => (
              <EquipmentItem
                item={item}
                onPress={() => {
                  removeItem(item.id);
                  setCreateLoader(true);
                }}
                loading={createLoader}
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex items-center justify-center mt-2">
            <Text className="font-Poppins_500 text-base text-gray-500">
              No equipments available
            </Text>
          </View>
        )}

        <FAB
          icon="plus"
          className="absolute right-4 bottom-4"
          onPress={showModal}
        />
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}
          >
            <View className="mb-4">
              <Text className="font-Poppins_600 text-lg">Add equipment</Text>
            </View>
            <TextInput
              mode="outlined"
              outlineColor="#ddd"
              label={"Equipment Name"}
              style={{ fontFamily: "Poppins_500Medium" }}
              value={equipment}
              onChangeText={(e) => setEquipment(e)}
            />
            <Button
              mode="contained"
              className="py-1 mt-4"
              disabled={createLoader || !equipment}
              loading={createLoader}
              onPress={createEquipment}
            >
              <Text className="font-Poppins_600 text-base">Create</Text>
            </Button>
          </Modal>
        </Portal>
      </View>
    </View>
  );
};

export default Equipments;
