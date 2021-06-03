import firestore from '@react-native-firebase/firestore';
import React, {useEffect} from 'react';
import {View, Text} from 'react-native';

export default function Following(prop) {
  const fetchUserFollowingData = async () => {
    try {
      await firestore()
        .collection('users')
        .doc(route.params.id)
        .get()
        .then((d) => console.log('data @', d));
    } catch (error) {}
  };
  return (
    <View>
      <Text />
    </View>
  );
}
