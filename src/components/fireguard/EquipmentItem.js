import { View, Text } from "react-native";
import React from "react";
import { IconButton, List } from "react-native-paper";

const EquipmentItem = ({item, onPress, loading}) => {

  return (
    <View>
      <List.Item
        titleStyle={{ fontFamily:"Poppins_400Regular" }}
        title={item.name}
        // description="Item description"
        left={(props) => <List.Icon {...props} icon="tools" />}
        right={(props) => <IconButton icon={"close"} iconColor="red" onPress={onPress} disabled={loading}/>}
      />
    </View>
  );
};

export default EquipmentItem;
