import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { Button, ButtonProps } from "react-native-elements";

interface ButtonProps2 extends ButtonProps {
  width?: number | string;
  backgroundColor?: string;
  containerStyle: ViewStyle;
  titleColor?: string;
  imagePath?: string;
}
export const AppButton = ({
    title,
    onPress,
    backgroundColor,
    style,
    titleStyle,
    imagePath,
    containerStyle,
    ...rest
  } : ButtonProps2) => {
    const [pressed, setPressed] = useState(false);
    const handlePressIn = () => {
      setPressed(true);
    };
    const handlePress= () =>
    {
      // setPressed(!pressed);
      onPress;
    }
  
    const handlePressOut = () => {
      setPressed(false);
    };
    const buttonStyle = pressed
    ? [styles.button, styles.buttonPressed,containerStyle]
    : [styles.button];

  // const titleTextStyle = pressed
  //   ? [styles.titleText, styles.titleTextPressed, titleStyle]
  //   : [styles.titleText, titleStyle];

    return (
      <TouchableOpacity
        style={[styles.button,containerStyle]}
        onPress={onPress}
        activeOpacity={0.5}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...rest}
      >
        <Text
          style={[
            {
              textTransform: "uppercase",
              fontSize: 18,
              fontWeight: "bold",
              backgroundColor: "transparent",
              letterSpacing: 1.5,
              marginRight: 20
            },
            titleStyle,
          ]}
        >
          {title}
        </Text>
        {imagePath && <Image
          style={styles.icon}
          source={imagePath}
        />}
      </TouchableOpacity>
  );
};

export const OppButton = ({
  backgroundColor,
  titleStyle,
  containerStyle,
  ...rest
}: ButtonProps2) => {
  if (!rest.disabled) {
    rest.disabled = rest.loading;
  }
  return (
    <Button
      {...rest}
      buttonStyle={{
        backgroundColor,
        paddingVertical: 12,
        paddingHorizontal: 5,
        borderColor: 'black'
      }}
      containerStyle={[
        {
          alignSelf: "center",
          backgroundColor,
          borderRadius: 10,
        },
        containerStyle,
      ]}
      TouchableComponent={TouchableOpacity}
      titleStyle={[
        {
          color: "#FFF",
          textTransform: "uppercase",
          fontSize: 12,
          fontWeight: "bold",
          marginLeft: 3,
          backgroundColor: "transparent",
          letterSpacing: 2,
        },
        titleStyle,
      ]}
    />
  );
};
const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    alignSelf: "center",
    width: '100%',
    flexDirection: 'row'
  },
  buttonPressed: {
    // backgroundColor: 'green',
  },
  icon: {
    width: 50,
    height: 50,
  },
});