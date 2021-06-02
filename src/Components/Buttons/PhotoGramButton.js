import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';

export function PhotoGramButton({
  title,
  extraStyles,
  color,
  backgroundColor,
  padding,
  fontSize,
  onPress,
  fontWeight,
}) {
  const styles = StyleSheet.create({
    Button: {
      backgroundColor: backgroundColor || '#45A4FF',
      padding: padding,
      alignItems: 'center',
      fontFamily: 'Roboto-Regular',
      ...extraStyles,
    },
    ButtonText: {
      color: color || '#fff',
      fontSize,
      fontWeight: fontWeight === 'h1' ? '700' : 'normal',
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.Button}>
      <Text style={styles.ButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}
