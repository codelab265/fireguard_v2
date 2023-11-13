import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';

function WindInfo({ windDirection, windSpeed }) {
  return (
    <View style={styles.windInfoContainer}>
      <Text style={styles.windInfoText}>Wind Direction: {windDirection}°</Text>
      <Text style={styles.windInfoText}>Wind Speed: {windSpeed} m/s</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  windInfoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  windInfoText: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color:"red"
  },
});

export default WindInfo;
