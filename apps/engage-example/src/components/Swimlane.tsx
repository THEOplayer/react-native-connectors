import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Entity } from "@theoplayer/react-native-engage";
import { Card } from "./Card";

interface SwimlaneProps {
  title: string,
  style: StyleProp<ViewStyle>;
  data: Entity[];
  onTap?: (entity: Entity) => void;
}

export function Swimlane(props: SwimlaneProps) {
  return <View style={[props.style, styles.container]}>
    <Text style={styles.title}>{props.title}</Text>
    <FlatList
      data={props.data}
      renderItem={({ item }) => <Card item={item} onTap={props.onTap}/>}
      keyExtractor={(item, index) => `${props.title}_${item.id}_${index}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.flatListContainer}
    />
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  flatListContainer: {
    paddingVertical: 20,
  },
  title: {
    marginLeft: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white'
  },
});
