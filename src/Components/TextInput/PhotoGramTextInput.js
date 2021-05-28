import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

export function PhotogramTextInput({
  onChangeText,
  placeholder,
  extraStyles,
  secureTextEntry,
  padding,
  fontSize,
  fontFamily
}) {
  const styles = StyleSheet.create({
    textInput: {
      backgroundColor: '#F6F6F6',
      marginHorizontal: 18,
      fontSize,
      padding: padding || 18,
      fontFamily: fontFamily || 'Roboto-Bold',
      ...extraStyles,
    },
  });

  return (
    <View>
      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        style={styles.textInput}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}
