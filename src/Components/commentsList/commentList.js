import React, {useState, useEffect} from 'react';
import {View, Text, Alert, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {height, padding, width} from '../../Utils/constants/styles';
import {PhotogramText} from '../Text/PhotoGramText';

export default function CommentList({item, route}) {
  const [userData, setUserData] = useState();
  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(item.uid)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      }, []);
  };

  useEffect(() => {
    console.log(userData);
    getUser();
  }, []);

  return (
    <View>
      <View style={{borderBottomColor: '#333', borderBottomWidth: 0.5}} />
      <View style={{flexDirection: 'row', marginVertical: padding - 10}}>
        <Image
          style={{
            width: 50,
            borderRadius: 55,
            padding,
            height: 50,
            marginLeft: 12,
          }}
          source={{
            uri: userData
              ? userData.userImg
              : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
          }}
        />
        <View>
          <PhotogramText
            text={userData ? userData.userName : 'Test'}
            fontWeight={'h1'}
            fontSize={14}
            extraStyles={{marginHorizontal: padding - 10}}
          />
          <PhotogramText
            extraStyles={{marginHorizontal: padding - 10}}
            text={item.commentText}
          />
        </View>
      </View>
    </View>
  );
}
