import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation, useLocalSearchParams } from "expo-router";
import MapView, { Circle, Marker, PROVIDER_GOOGLE, Polygon } from "react-native-maps";

import { Appbar, Button, Menu } from "react-native-paper";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import WindInfo from "../src/components/fireguard/WindInfo";
import axios from "axios";

const ViewLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { report } = useLocalSearchParams();
  const router = useNavigation();
  const map = useRef(null);
  const [MenuVisible, setMenuVisible] = useState(false);
  const GOOGLE_MAPS_APIKEY = "AIzaSyAQrBDvwyt-UZyeTQFmO52xVf5Iu23Qoqw";
  const origin = { latitude: location?.coords.latitude, longitude: location?.coords.longitude };
  const destination = { latitude: parseFloat(report.report_detail[0]?.latitude), longitude: parseFloat(report.report_detail[0]?.longitude) };

  const [windDirection, setWindDirection] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);

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
    // Function to fetch wind direction data from OpenWeatherMap
    const fetchWindDirection = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${destination.latitude}&lon=${destination.longitude}&appid=${openViewAPI}`
        );

        const windData = response.data.wind;
        const newWindDirection = windData.deg;
        const newWindSpeed = windData.speed;

        // Update the wind direction and speed states
        setWindDirection(newWindDirection);
        setWindSpeed(newWindSpeed);
        console.log(windData);
      } catch (error) {
        console.error('Error fetching wind data:', error);
      }
    };

    // Initial fetch
    fetchWindDirection();

    // Set up a timer to periodically update wind direction
    const interval = setInterval(fetchWindDirection, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval); // Cleanup on unmount
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
              onZoomInPress();
            }}
            title="Zoom"
          />

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
          <Marker
            coordinate={destination}
            pinColor="green"
          />
          <Circle center={destination} radius={300}
          fillColor="rgba(255, 0, 0, 0.3)"/>
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY} // insert your API Key here
            strokeWidth={5}
            strokeColor="green"
          />
        </MapView>
      )}
      {windDirection !== null && windSpeed !== null && (
        <WindInfo windDirection={windDirection} windSpeed={windSpeed} />
      )}
      
    </View>
  );
};

export default ViewLocation;
