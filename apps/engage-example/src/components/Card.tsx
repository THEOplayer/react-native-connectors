import { Entity } from "@theoplayer/react-native-engage";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const { width } = Dimensions.get('window');
const cardRatio = 9.0 / 16.0;

export interface CardProps {
  item: Entity,
  onTap?: (entity: Entity) => void
}

export const Card = (props: CardProps) => (
  <TouchableOpacity style={styles.card} onPress={() => props.onTap?.(props.item)}>
    <Image source={{ uri: props.item.posters?.[0].uri }} resizeMode={'cover'} style={styles.cardImage} />
    <View style={{ margin: 10, flex: 1, justifyContent: 'flex-end' }}>
      <Text style={styles.cardTitle} ellipsizeMode={"tail"} numberOfLines={2}>{props.item.name}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: width * 0.25,
    height: (width * 0.25) / cardRatio,
    marginHorizontal: 10,
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    shadowColor: 'grey',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cardImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
