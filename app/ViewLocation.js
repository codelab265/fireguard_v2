import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useLocalSearchParams } from "expo-router";
import MapView, { PROVIDER_GOOGLE, Polygon } from "react-native-maps";

import { Button } from "react-native-paper";
import * as Location from "expo-location";

const ViewLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { report } = useLocalSearchParams();
  const router = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      console.log(loc);
      setLocation(loc);
      setLoading(false);
    })();
  }, []);

  return (
    <View className="flex-1 relative">
      {loading ? (
        <View className="flex flex-row items-center justify-center space-x-2">
          <ActivityIndicator size={"small"} />
          <Text>Getting your location</Text>
        </View>
      ) : (
        <MapView
          className="w-full h-full"
          initialRegion={{
            latitude: report.report_detail[0].latitude,
            longitude: report.report_detail[0].longitude,
            latitudeDelta: 0.0622,
            longitudeDelta: 0.0121,
          }}
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
      )}

      <View className="absolute bottom-3 w-full flex flex-row items-center justify-between px-4">
        <Button
          mode="contained"
          className=""
          onPress={() =>
            router.navigate("FireguardChat", {
              id: report.id,
              user_id: report.user_id,
              first_name: report.user.first_name,
              last_name: report.user.last_name,
            })
          }
        >
          <Text>Chat</Text>
        </Button>
        <Button
          mode="contained"
          className=""
          onPress={() =>
            router.navigate("Equipments", {
              id: report.id,
            })
          }
        >
          <Text>Equipments</Text>
        </Button>
        <Button
          mode="contained"
          className=""
          onPress={() =>
            router.navigate("CheckWind", {
              latitude:report.report_detail[0].latitude,
              longitude:report.report_detail[0].longitude,
            })
          }
        >
          <Text>Check wind</Text>
        </Button>
      </View>
    </View>
  );
};

export default ViewLocation;
