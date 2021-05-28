import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Image, ScrollView, TextInput} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {width} from '../../Utils/constants/styles';

export default function Search() {
  const [userData, setUserData] = useState([]);

  const getUser = async (search) => {
    if (search) {
      firestore()
        .collection('users')
        .where('userName', '>=', `${search}`)
        .onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            const List = [];
            const {userImg, userName, email} = doc.data();
            List.push({
              userImg,
              userName,
              email,
              id: doc.id,
            });
            setUserData(List);
          });
        });
    } else {
      firestore()
        .collection('users')
        .onSnapshot((snapshot) => {
          snapshot.forEach((doc) => {
            const List = [];
            const {userImg, userName, email} = doc.data();
            List.push({
              userImg,
              userName,
              email,
              id: doc.id,
            });
            setUserData(List);
          });
        });
    }
  };

  return (
    <View
      style={{
        justifyContent: 'center',
        position: 'absolute',
        alignItems: 'center',
      }}>
      <TextInput
        style={{backgroundColor: 'rgba(0,0,0,0.1)', width}}
        onChangeText={(search) => getUser(search)}
        onChange={() => getUser()}
        placeholder={'hi'}
      />
      <Text onPress={() => console.log(userData)}>hello</Text>
      <FlatList
        data={userData}
        renderItem={({item}) => {
          console.log(item);
          return <Text>{item.userName}</Text>;
        }}
      />
    </View>
  );
}
