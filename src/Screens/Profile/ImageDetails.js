import React, {useState} from 'react';
import {View, Image, Text} from 'react-native';
import {PhotogramText} from '../../Components/Text/PhotoGramText';
import {height, padding, width} from '../../Utils/constants/styles';

export default function ImageDetails({route}) {
  console.log(route.params.item);
  return (
    <View style={{alignItems: 'center', flex: 1, backgroundColor: '#fff'}}>
      <View style={{flexDirection: 'row'}}>
        <Image
          style={{width: 50, height: 50, borderRadius: 100}}
          source={{
            uri: route.params.userData.userImg,
          }}
        />
        <PhotogramText
          text={route.params.item.displayName}
          fontSize={18}
          extraStyles={{
            marginHorizontal: padding,
            marginTop: padding - 8,
          }}
          fontWeight={'h1'}
        />
      </View>
      <PhotogramText text={route.params.item.postText} />
      <PhotogramText
        text={new Date(route.params.item.createdAt).toDateString()}
      />
      <Image
        resizeMode={'contain'}
        source={{uri: route.params.item.image}}
        style={{
          position: 'absolute',
          width: width / 1.1,
          height,
        }}
      />
    </View>
  );
}
