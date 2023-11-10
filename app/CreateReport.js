import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  ActivityIndicator,
  Banner,
  Button,
  TextInput,
} from "react-native-paper";
import { useAuthContext } from "../src/context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../src/config/API";
import { ToastAndroid } from "react-native";
import MapView, { Circle, Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

const CreateReport = () => {
  const [loading, setLoading] = useState(false);
  const [mapLoader, setMapLoader] = useState(false);
  const router = useRouter();
  const [coordinates, setCoordinates] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

  const { userInfo, location, setReports } = useAuthContext();

  const handleReport = async (values, resetForm) => {
    setLoading(true);
    await axios
      .post(`${BASE_URL}/user/report`, {
        location: values.location,
        user_id: userInfo?.id,
        coordinates: coordinates,
      })
      .then((response) => {
        setLoading(false);
        ToastAndroid.show("Added successfully", ToastAndroid.LONG);
        setReports(response.data);
        formik.resetForm();
        setCoordinates([]);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const validationSchema = Yup.object().shape({
    location: Yup.string().required("location is required"),
  });
  const formik = useFormik({
    initialValues: {
      location: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      handleReport(values);
    },
  });

  useEffect(() => {
    (async () => {
      setMapLoader(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Location permission not granted");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;


      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      setMapLoader(false);
    })();
  }, []);

  const handleMapPress = (e) => {
    setCoordinates(e.nativeEvent.coordinate);
    
  };
  return (
    <View className="flex-1 relative">
      {mapLoader ? (
        <View className="flex flex-row justify-center mt-4">
          <ActivityIndicator size={"small"} />
          <Text className="ml-2 font-Poppins_400">
            Getting your location
          </Text>
        </View>
      ) : (
        <>
          <View className="p-2">
            <Banner visible={true}>
              <Text className="font-Poppins_400 text-xs">
                Click the affected area
              </Text>
            </Banner>
          </View>

          <MapView
            provider={PROVIDER_GOOGLE}
            onPress={handleMapPress}
            initialRegion={initialRegion}
            className="flex-1"
          >
            {coordinates && <Marker coordinate={coordinates} />}
            {coordinates && <Circle center={coordinates} radius={200} strokeColor="red" strokeWidth={3} />}
          </MapView>
          <View className="absolute bottom-3 p-3 z-10 w-full">
            <TextInput
              mode="outlined"
              label={"Location Name"}
              className="mb-2"
              onChangeText={formik.handleChange("location")}
              onBlur={formik.handleBlur("location")}
              error={formik.errors.location}
              value={formik.values.location}
            />
            <Button
              mode="contained"
              className="py-2 w-full"
              disabled={loading || coordinates==null}
              loading={loading}
              onPress={formik.handleSubmit}
            >
              <Text className="text-base font-Poppins_500">Create</Text>
            </Button>
          </View>
        </>
      )}
    </View>
  );
};

export default CreateReport;
