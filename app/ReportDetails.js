import { View, Text } from 'react-native'
import React, { useState } from 'react'
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSearchParams } from 'expo-router'


const ReportDetails = () => {
    let {report} = useSearchParams();

    report = JSON.parse(report);

    const [mapRegion, setmapRegion] = useState({
        latitude: parseFloat(report.latitude),
        longitude: parseFloat(report.longitude),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

    console.log(mapRegion);

  return (
    <View className="flex-1">
      <MapView className="w-full h-full" initialRegion={mapRegion} provider={PROVIDER_GOOGLE}>
        <Marker coordinate={mapRegion} title={report.location} />
        <Circle radius={500} center={mapRegion} />
        </MapView>
        
    </View>
  )
}

export default ReportDetails