import firestore from '@react-native-firebase/firestore';
import React, {useEffect} from 'react';
import {View, Text} from 'react-native';

export default function Following({route}) {
  const fetchUserFollowingData = async () => {
    try {
      await firestore()
        .collection('users')
        .doc(route.params)
        .get()
        .then((d) => console.log('data @', d));
    } catch (error) {}
  };

  useEffect(() => {
    fetchUserFollowingData();
  });
  return (
    <View>
      <Text />
    </View>
  );
}
