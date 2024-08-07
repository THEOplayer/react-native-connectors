import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StyleProp,
  ViewStyle,
  Image, TouchableOpacity,
} from "react-native";
import { Entity } from "@theoplayer/react-native-engage";
import { Card } from "./Card";
import DeleteIcon from "../res/images/delete.png";

interface SwimlaneProps {
  title: string,
  style: StyleProp<ViewStyle>;
  data: Entity[];
  onTap?: (entity: Entity) => void;
  onDelete?: () => void;
}

export function Swimlane(props: SwimlaneProps) {
  return <View style={[props.style, styles.container]}>
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{props.title}</Text>
      {props.onDelete && <TouchableOpacity onPress={props.onDelete}>
        <Image source={DeleteIcon} style={styles.icon}/>
      </TouchableOpacity>}
    </View>
    <FlatList
      data={props.data}
      renderItem={({item}) => <Card item={item} onTap={props.onTap}/>}
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 10
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
