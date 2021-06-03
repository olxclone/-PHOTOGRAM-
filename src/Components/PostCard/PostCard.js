import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, Animated} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {padding, width, height} from '../../Utils/constants/styles';
import {Card} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {PhotogramText} from '../Text/PhotoGramText';

export default function PostCard({item, navigation, onDelete, scale}) {
  const [userData, setUserData] = useState();
  const [likes, setLikes] = useState();
  const [liked, setLiked] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);
  const [comments, setComments] = useState();

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
    const cleanup = getUser();
    getAllComments();
    getLikes();
    return () => {
      cleanup;
    };
  }, []);
  let getLikes = async () => {
    await firestore()
      .collection('Posts')
      .doc(item.id)
      .collection('Likes')
      .onSnapshot((data) => {
        data.docs.map((snap) => {
          const List = [];
          List.push({
            id: snap.id,
          });
          setLikedUsers(List);
        });
        setLikes(data.docs.length);
      });
  };

  const setUpdates = async (postId) => {
    try {
      await firestore()
        .collection('Posts')
        .doc(postId)
        .collection('Likes')
        .doc(auth().currentUser.uid)
        .set({
          likes: firestore.FieldValue.increment(1),
        });
    } catch (e) {
      console.log(e);
    }
  };

  let getAllComments = async () => {
    await firestore()
      .collection('Posts')
      .doc(item.id)
      .collection('comments')
      .onSnapshot((data) => {
        const Allcomments = data.docs.map((doc) => {
          const id = doc.id;
          return {id};
        });
        setComments(Allcomments.length);
      });
  };

  let likeIcon = liked ? 'like1' : 'like2';
  let likeIconColor = liked === true ? '#45A4FF' : '#333';

  let likeText;
  if (item.likes == 1) {
    likeText = '1 Like';
  } else if (item.likes > 1) {
    likeText = item.likes + ' Likes';
  } else {
    likeText = 'Like';
  }

  let commentText;

  if (item.comments == 1) {
    commentText = '1 Comment';
  } else if (item.comments > 1) {
    commentText = item.comments + ' Comments';
  } else {
    commentText = 'Comment';
  }

  return (
    <Animated.View
      style={{
        width,
        marginVertical: 20,
        alignSelf: 'center',
        borderRadius: 24,
      }}>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 24,
          marginHorizontal: 18,
        }}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('HomeProfile', item)}
            style={{flexDirection: 'row'}}>
            <Image
              style={{
                width: width / 7,
                margin: padding - 4,
                borderRadius: 75,
                height: width / 7,
              }}
              source={{
                uri: userData
                  ? userData.userImg ||
                    'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png'
                  : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
              }}
            />
            <Text
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '8%',
                color: '#000',
                fontSize: padding,
              }}>
              {userData ? userData.userName : 'Test'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={{position: 'absolute', top: 58, left: '26%'}}>
          {new Date().toDateString(item.createdAt)}
        </Text>
        <Card.Divider />
        <PhotogramText
          fontSize={padding - 6}
          text={item.postText}
          extraStyles={{marginBottom: 16, marginHorizontal: 24}}
        />
        {/* <Text
          style={{
            fontSize: padding - 6,
            marginBottom: 16,
            marginHorizontal: 24,
          }}>
          {item.postText}
        </Text> */}

        <Image
          resizeMode="cover"
          source={{uri: item.image}}
          style={{
            width: item.image ? width - 42 : 0,
            alignSelf: 'center',
            height: item.image ? height / 2.7 : 0,
          }}
        />
        <View>
          {auth().currentUser.uid === item.uid ? (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <MaterialCommunityIcons
                  name="comment-text-outline"
                  size={32}
                  color="black"
                  style={{marginVertical: padding - 4, marginLeft: 42}}
                  onPress={() => {
                    navigation.navigate('Comments', {
                      docId: item.id,
                    });
                  }}
                />
                <PhotogramText
                  text={comments}
                  fontWeight={'h1'}
                  fontSize={22}
                  extraStyles={{marginTop: padding - 2, marginLeft: 6}}
                />
              </View>
              <AntDesign
                name="delete"
                style={{marginBottom: 15, marginTop: 12, marginHorizontal: 24}}
                onPress={() => onDelete(item.id)}
                size={32}
                color="black"
              />
            </View>
          ) : (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignSelf: 'flex-end',
                  top: 0,
                  position: 'absolute',
                }}>
                <TouchableOpacity
                  activeOpacity={0}
                  onPress={() => setUpdates(item.id)}>
                  <AntDesign
                    name={likeIcon}
                    size={32}
                    color={likeIconColor}
                    style={{marginHorizontal: 42, marginVertical: padding - 4}}
                  />
                  <PhotogramText
                    fontSize={22}
                    text={likes}
                    fontWeight={'h1'}
                    extraStyles={{
                      position: 'absolute',
                      right: 24,
                      top: -42,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row'}}>
                <MaterialCommunityIcons
                  name="comment-text-outline"
                  size={32}
                  color="black"
                  style={{marginVertical: padding - 4, marginLeft: 42}}
                  onPress={() => {
                    navigation.navigate('Comments', {
                      docId: item.id,
                    });
                  }}
                />
                <PhotogramText
                  text={comments}
                  fontWeight={'h1'}
                  fontSize={22}
                  extraStyles={{marginTop: padding - 2, marginLeft: 6}}
                />
              </View>
            </>
          )}
        </View>
      </View>
    </Animated.View>
  );
}
