import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

export interface TestButtonProps {
  onPress: () => void;
  image?: ImageSourcePropType;
  title?: string;
}

export const TestButton = (props: TestButtonProps) => {
  return <TouchableOpacity style={styles.button} onPress={props.onPress}>
    <>
      {props.image && <Image style={styles.image} source={props.image}/>}
      {props.title && <Text style={styles.buttonText}>{props.title}</Text>}
    </>
  </TouchableOpacity>
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 5,
  },
  image: {
    resizeMode: 'contain',
    width: 75,
    height: 75,
    tintColor: '#ffc50f',
  },
  buttonText: {
    fontSize: 20,
    marginVertical: 2,
    color: 'black',
    borderRadius: 4,
    padding: 3,
    backgroundColor: '#ffc50f',
  },
});
