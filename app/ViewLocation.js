import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation, useLocalSearchParams } from "expo-router";
import MapView, {
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  Polygon,
  Polyline,
} from "react-native-maps";

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

  const calculatePolygonCoordinates = () => {
    const earthRadius = 299478139;
    const latDelta = (spreadDistance / earthRadius) * (180 / Math.PI);
    const lonDelta =
      (spreadDistance /
        (earthRadius * Math.cos((Math.PI / 180) * destination.latitude))) *
      (180 / Math.PI);

    const topLeft = {
      latitude: destination.latitude + latDelta,
      longitude: destination.longitude - lonDelta,
    };
    const topRight = {
      latitude: destination.latitude + latDelta,
      longitude: destination.longitude + lonDelta,
    };
    const bottomRight = {
      latitude: destination.latitude - latDelta,
      longitude: destination.longitude + lonDelta,
    };
    const bottomLeft = {
      latitude: destination.latitude - latDelta,
      longitude: destination.longitude - lonDelta,
    };

    return [topLeft, topRight, bottomRight, bottomLeft];
  };

  const calculateSpreadDirectionCoordinates = () => {
    const spreadDirection = windDirection;
    const spreadDirectionLength = spreadDistance * 2;

    const spreadDirectionStart = {
      latitude: destination.latitude,
      longitude: destination.longitude,
    };

    const spreadDirectionEnd = {
      latitude:
        destination.latitude +
        spreadDirectionLength * Math.sin((spreadDirection * Math.PI) / 180),
      longitude:
        destination.longitude +
        spreadDirectionLength * Math.cos((spreadDirection * Math.PI) / 180),
    };

    return [spreadDirectionStart, spreadDirectionEnd];
  };

  const calculateArrowShapeCoordinates = () => {
    const arrowWidth = spreadDistance / 5; // Adjust the width of the arrow as needed
    const arrowLength = spreadDistance * 2; // Adjust the length of the arrow as needed

    const arrowHead = {
      latitude:
        destination.latitude +
        arrowLength * Math.sin((windDirection * Math.PI) / 180),
      longitude:
        destination.longitude +
        arrowLength * Math.cos((windDirection * Math.PI) / 180),
    };

    const arrowLeft = {
      latitude:
        arrowHead.latitude -
        arrowWidth * Math.cos(((windDirection + 90) * Math.PI) / 180),
      longitude:
        arrowHead.longitude -
        arrowWidth * Math.sin(((windDirection + 90) * Math.PI) / 180),
    };

    const arrowRight = {
      latitude:
        arrowHead.latitude +
        arrowWidth * Math.cos(((windDirection + 90) * Math.PI) / 180),
      longitude:
        arrowHead.longitude +
        arrowWidth * Math.sin(((windDirection + 90) * Math.PI) / 180),
    };

    return [arrowLeft, arrowHead, arrowRight];
  };

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
          <Marker coordinate={destination} pinColor="green" />
          <Circle
            center={destination}
            radius={300}
            fillColor="rgba(255, 0, 0, 0.3)"
          />
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={5}
            strokeColor="green"
          />

          {windDirection !== null && (
            <Polygon
              coordinates={calculatePolygonCoordinates()}
              fillColor="rgba(255, 0, 0, 0.3)"
              strokeColor="red"
            />
          )}

          {windDirection !== null && (
            <Polygon
              coordinates={calculateArrowShapeCoordinates()}
              fillColor="rgba(255, 0, 0, 0.3)"
              strokeColor="red"
            />
          )}

          {/* Display wind information on the map using the WindInfo component
          {windDirection !== null && windSpeed !== null && (
            <View style={styles.windInfoContainer}>
              <Text style={styles.windInfoText}>
                Wind Direction: {windDirection}°
              </Text>
              <Text style={styles.windInfoText}>
                Wind Speed: {windSpeed} m/s
              </Text>
            </View>
          )} */}

          {/* Display a marker for the fire location */}
          <Marker
            coordinate={destination}
            title="Fire Location"
            pinColor="red"
          />

          {/* Display a line representing the fire spread direction */}
          {/* {windDirection !== null && (
            <Polyline
              coordinates={calculateSpreadDirectionCoordinates()}
              strokeColor="orange"
              strokeWidth={2}
            />
          )} */}
        </MapView>
      )}
      {windDirection !== null && windSpeed !== null && (
        <WindInfo windDirection={windDirection} windSpeed={windSpeed} />
      )}
    </View>
  );
};

export default ViewLocation;

const styles = StyleSheet.create({
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
