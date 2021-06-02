import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TextInput} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {height, width} from '../../Utils/constants/styles';
import {PhotogramTextInput} from '../../Components/TextInput/PhotoGramTextInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Image} from 'react-native';
import {PhotogramText} from '../../Components/Text/PhotoGramText';
import {TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native';

export default function Search({navigation}) {
  const [userData, setUserData] = useState([]);

  let getAllUsers = async (search) => {
    firestore()
      .collection('users')
      .where('userName', '>=', `${search}`)
      .onSnapshot((snapshot) => {
        let Lists = [];
        snapshot.forEach((data) => {
          let {userName, userImg, email, uid} = data.data();
          Lists.push({
            userName,
            userImg,
            uid,
            email,
          });
          setUserData(Lists);
        });
      });

    // call of duty ===>>>>
  };

  // const getUser = async (search) => {
  //   if (search) {
  //     firestore()
  //       .collection('users')
  //       .where('userName', '>=', `${search}`)
  //       .onSnapshot((snapshot) => {
  //         snapshot.forEach((doc) => {
  //           const List = [];
  //           const { userImg, userName, email } = doc.data();
  //           List.push({
  //             userImg,
  //             userName,
  //             email,
  //             id: doc.id,
  //           });
  //           setUserData(List);
  //         });
  //       });
  //   } else {
  //     firestore()
  //       .collection('users')
  //       .onSnapshot((snapshot) => {
  //         snapshot.forEach((doc) => {
  //           const List = [];
  //           const { userImg, userName, email } = doc.data();
  //           List.push({
  //             userImg,
  //             userName,
  //             email,
  //             id: doc.id,
  //           });
  //           setUserData(List);
  //         });
  //       });
  //   }
  // };

  return (
    <View
      style={{
        justifyContent: 'center',
        position: 'absolute',
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#fff',
          margin: 12,
          borderRadius: 124,
        }}>
        <Ionicons
          name="search"
          size={24}
          style={{
            marginTop: 12,
            marginHorizontal: 12,
            backgroundColor: 'transparent',
          }}
          color="black"
        />
        <PhotogramTextInput
          placeholderTextColor={'#000'}
          extraStyles={{
            alignSelf: 'center',
            backgroundColor: 'transparent',
            borderRadius: 24,
            width: width - 72,
            marginHorizontal: 0,
          }}
          onChangeText={(search) => getAllUsers(search)}
          placeholder={'Search'}
          padding={10}
        />
      </View>

      <FlatList
        data={userData}
        key={userData.uid}
        renderItem={({item}) => {
          return (
            <ScrollView>
              <TouchableOpacity
                activeOpacity={3}
                onPress={() => navigation.navigate('HomeProfile', item)}
                style={{
                  flexDirection: 'row',
                  width: width - 124,
                  padding: 10,
                  backgroundColor: '#fff',
                  borderRadius: 124,
                  width: width - 24,
                  marginVertical: 14,
                }}>
                <Image
                  source={{
                    uri: item.userImg
                      ? item.userImg
                      : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 24,
                    marginHorizontal: 12,
                  }}
                />
                <View>
                  <PhotogramText
                    fontWeight={'h1'}
                    extraStyles={{
                      marginTop: height / 90,
                    }}
                    text={item.userName}
                  />
                  <PhotogramText
                    extraStyles={{
                      marginLeft: 2,
                    }}
                    text={item.email}
                  />
                </View>
              </TouchableOpacity>
            </ScrollView>
          );
        }}
      />
    </View>
  );
}
