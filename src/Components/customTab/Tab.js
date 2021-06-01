import React from 'react';
import {View, Text} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

export function Tab({isSelected, icon}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Ionicons name={icon} size={24} color={isSelected ? 'black' : 'grey'} />
    </View>
  );
}
