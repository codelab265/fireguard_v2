import { View, Text } from "react-native";
import React, { useState } from "react";
import MapView, { Marker, Circle, PROVIDER_GOOGLE, Polygon } from "react-native-maps";
import { useLocalSearchParams, useNavigation, useSearchParams } from "expo-router";
import { ActivityIndicator, Button, FAB } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Color } from "../src/utils/Colors";
import axios from "axios";
import { BASE_URL } from "../src/config/API";
import { useAuthContext } from "../src/context/AuthContext";

const ReportDetails = () => {
  const [loading, setLoading] = useState(false);
  let { report } = useLocalSearchParams();
  const router = useNavigation();
  const { setReports } = useAuthContext();

  const [mapRegion, setmapRegion] = useState({
    latitude: parseFloat(report.report_detail[0]?.latitude),
    longitude: parseFloat(report.report_detail[0]?.longitude),
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleDelete = async () => {
    setLoading(true);
    await axios
      .post(`${BASE_URL}/user/report/delete`, {
        id: report.id,
        user_id: report.user_id,
      })
      .then((response) => {
        setLoading(false);
        setReports(response.data);
        router.goBack();
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <View className="flex-1 relative">
      <MapView
        className="w-full h-full"
        initialRegion={mapRegion}
        provider={PROVIDER_GOOGLE}
      >
        {report.report_detail.length > 2 && (
          <Polygon
            coordinates={report.report_detail}
            strokeColor="#F00"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={2}
          />
        )}
      </MapView>
      {loading && (
        <ActivityIndicator
          className="absolute left-0 right-0 top-0 bottom-0"
          size={"large"}
          color={Color.primary}
        />
      )}
      <TouchableOpacity
        className="absolute right-4 bottom-4"
        onPress={handleDelete}
      >
        <FontAwesome name="trash" size={30} color="red" />
      </TouchableOpacity>
    </View>
  );
};

export default ReportDetails;
