import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import auth from '@react-native-firebase/auth';

export default function Loading({navigation}) {
  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.push('Main');
      } else {
        navigation.push('signIn');
      }
    });
  });
  return (
    <View>
      <Text />
    </View>
  );
}
