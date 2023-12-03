import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation, useLocalSearchParams } from "expo-router";
import MapView, {
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  Polygon,
  Polyline,
} from "react-native-maps";

import { Appbar, Button, IconButton, Menu } from "react-native-paper";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import WindInfo from "../src/components/fireguard/WindInfo";
import axios from "axios";
import fireDirectionImage from "../src/assets/fire-dir.png";

const ViewLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { report } = useLocalSearchParams();
  const router = useNavigation();
  const map = useRef(null);
  const [MenuVisible, setMenuVisible] = useState(false);
  const GOOGLE_MAPS_APIKEY = "AIzaSyAQrBDvwyt-UZyeTQFmO52xVf5Iu23Qoqw";
  const origin = {
    latitude: location?.coords.latitude,
    longitude: location?.coords.longitude,
  };
  const destination = {
    latitude: parseFloat(report.report_detail[0]?.latitude),
    longitude: parseFloat(report.report_detail[0]?.longitude),
  };

  const [windDirection, setWindDirection] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [spreadDistance, setSpreadDistance] = useState(null);
  const [areas, setAreas] = useState("");

  const openViewAPI = "c14e51f1f5fb7d1491352f44a1788115";

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  const onZoomInPress = () => {
    map?.current?.getCamera().then((cam) => {
      cam.zoom += 4;
      map?.current?.animateCamera(cam);
    });
  };

  useEffect(() => {
    const fetchWindDirection = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${destination.latitude}&lon=${destination.longitude}&appid=${openViewAPI}`
        );

        const windData = response.data.wind;
        const newWindDirection = windData.deg;
        const newWindSpeed = windData.speed;

        setWindDirection(newWindDirection);

        setWindSpeed(newWindSpeed);
        console.log(windData);
        handleMapRegionChange(newWindDirection);

        const rateOfSpread = 5;
        const projectedTime = 3600;
        const newSpreadDistance = rateOfSpread * projectedTime;

        setSpreadDistance(newSpreadDistance);
      } catch (error) {
        console.error("Error fetching wind data:", error);
      }
    };

    // Initial fetch
    fetchWindDirection();

    const interval = setInterval(fetchWindDirection, 60000);

    return () => clearInterval(interval);
  }, []);

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

  const getAreaName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_APIKEY}`
      );

      if (
        response.data &&
        response.data.results &&
        response.data.results.length > 0
      ) {
        const areaDetails = response.data.results[0];
        const areaName = areaDetails.formatted_address;
        const coordinates = {
          latitude: areaDetails.geometry.location.lat,
          longitude: areaDetails.geometry.location.lng,
        };

        console.log("Area Name:", areaName);
        console.log("Coordinates:", coordinates);
        setAreas(areaName);
      }
    } catch (error) {
      console.error("Error fetching area name:", error.message);
    }
  };

  const handleMapRegionChange = (windDir) => {
    const { latitude, longitude } = destination;

    // You can change the angle as needed (55 degrees in this case)
    const direction = windDir;

    // Calculate new coordinates based on the direction
    const newLatitude = latitude + Math.cos((direction * Math.PI) / 180) * 0.01;
    const newLongitude =
      longitude + Math.sin((direction * Math.PI) / 180) * 0.01;

    getAreaName(newLatitude, newLongitude);
  };

  console.log(areas);
  return (
    <View className="flex-1 relative">
      <Appbar.Header className="bg-primary">
        <Appbar.BackAction color="#fff" onPress={() => router.goBack()} />
        <Appbar.Content color="#fff" title={report.location} />
        <Menu
          visible={MenuVisible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              color="white"
              icon="dots-vertical"
              onPress={openMenu}
            />
          }
        >
        

          <Menu.Item
            onPress={() => {
              closeMenu();
              router.navigate("FireguardChat", {
                id: report.id,
                user_id: report.user_id,
                first_name: report.user.first_name,
                last_name: report.user.last_name,
              });
            }}
            title="Chat"
          />

          <Menu.Item
            onPress={() => {
              closeMenu();
              router.navigate("CheckWind", {
                latitude: report.report_detail[0].latitude,
                longitude: report.report_detail[0].longitude,
              });
            }}
            title="Check wind"
          />
        </Menu>
      </Appbar.Header>
      {loading ? (
        <View className="flex flex-row items-center justify-center space-x-2">
          <ActivityIndicator size={"small"} />
          <Text>Getting your location</Text>
        </View>
      ) : (
        <MapView
          className="w-full h-full"
          initialRegion={{
            latitude: destination.latitude,
            longitude: destination.longitude,
            latitudeDelta: 0.0622,
            longitudeDelta: 0.0121,
          }}
          provider={PROVIDER_GOOGLE}
          ref={map}
        >
          <Marker coordinate={destination} title="Fire Location" pinColor="red">
            <View style={styles.markerContainer}>
              {/* Rotate the arrow image based on wind direction */}
              <Image
                source={fireDirectionImage}
                style={{
                  width: 100,
                  height: 150,
                  transform: [{ rotate: `${windDirection}deg` }],
                  marginBottom: 10,
                }}
              />
            </View>
          </Marker>
        </MapView>
      )}
      {areas && (
        <View className="absolute top-28 px-4 py-2 bg-white w-full mx-2">
          <Text className="text-xl font-Poppins_600">Possible Affected Areas</Text>
          <Text className="font-Poppins_400">{areas}</Text>
        </View>
      )}
      {windDirection !== null && windSpeed !== null && (
        <WindInfo windDirection={windDirection} windSpeed={windSpeed} />
      )}
      <IconButton
      icon={'arrow-expand-all'}
      size={24}
      className="absolute bottom-2 right-2 bg-primary"
      iconColor="#fff"
      mode="contained"
      onPress={() => {
        closeMenu();
        onZoomInPress();
      }}
      />
    </View>
  );
};

export default ViewLocation;

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 5,
    paddingRight: 5,
  },
  windInfoContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 10,
    borderRadius: 5,
  },
  windInfoText: {
    fontSize: 14,
  },
});
