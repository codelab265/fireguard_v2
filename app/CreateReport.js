import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Banner, Button, TextInput } from "react-native-paper";
import { useAuthContext } from "../src/context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../src/config/API";
import { ToastAndroid } from "react-native";
import MapView, { Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

const CreateReport = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [coordinates, setCoordinates] = useState([]);
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
    })();
  }, []);

  const handleMapPress = (e) => {
    setCoordinates([...coordinates, e.nativeEvent.coordinate]);
    console.log(e.nativeEvent);
  };

  return (
    <View className="flex-1 relative">
      <View className="p-2">
        <Banner visible={true}>
          <Text className="font-Poppins_400 text-xs">Draw the affected area and provide the location below</Text>
        </Banner>
      </View>

      <MapView
        provider={PROVIDER_GOOGLE}
        onPress={handleMapPress}
        initialRegion={initialRegion}
        className="flex-1"
      >
        {coordinates.length > 2 && (
          <Polygon
            coordinates={coordinates}
            strokeColor="#F00"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={2}
          />
        )}
      </MapView>
      <View className="absolute bottom-3 p-3 z-10 w-full">
        <TextInput
          mode="outlined"
          label={"Location"}
          className="mb-2"
          onChangeText={formik.handleChange("location")}
          onBlur={formik.handleBlur("location")}
          error={formik.errors.location}
          value={formik.values.location}
        />
        <Button
          mode="contained"
          className="py-2 w-full"
          disabled={loading || coordinates.length == 0}
          loading={loading}
          onPress={formik.handleSubmit}
        >
          <Text className="text-base font-Poppins_500">Create</Text>
        </Button>
      </View>
    </View>
  );
};

export default CreateReport;
