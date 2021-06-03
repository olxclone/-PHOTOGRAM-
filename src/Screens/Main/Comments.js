import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {View, FlatList, Image, TextInput, Keyboard} from 'react-native';
import {PhotogramTextInput} from '../../Components/TextInput/PhotoGramTextInput';
import {height, padding, width} from '../../Utils/constants/styles';
import {PhotoGramButton} from '../../Components/Buttons/PhotoGramButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommentList from '../../Components/commentsList/commentList';
export default function Comments({route}) {
  let [commentText, setCommentText] = useState('');
  let [comments, setComments] = useState([]);
  let [keyboardShow, setKeyboardShow] = useState();
  let [user, setUser] = useState();

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => setKeyboardShow(true));
    Keyboard.addListener('keyboardDidHide', () => setKeyboardShow(false));
  });

  const getUser = async () => {
    let currentUser = await firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .onSnapshot((documentSnaphot) => {
        setUser(documentSnaphot.data());
      }, []);
  };

  let getAllComments = async () => {
    await firestore()
      .collection('Posts')
      .doc(route.params.docId)
      .collection('comments')
      .onSnapshot((data) => {
        const Allcomments = data.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return {id, ...data};
        });
        setComments(Allcomments);
      });
  };

  useEffect(() => {
    getAllComments();
    getUser();

    return () => {
      getAllComments();
    };
  }, [route.params.docId]);

  let onSendComment = async () => {
    await firestore()
      .collection('Posts')
      .doc(route.params.docId)
      .collection('comments')
      .add({
        commentText,
        uid: auth().currentUser.uid,
      });
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#fff',
          zIndex: 100,
          top: keyboardShow ? height / 2.6 : height / 1.26,
        }}>
        <View
          style={{
            position: 'absolute',
            padding: padding + 4,
            flexDirection: 'row',
          }}>
          <Image
            source={{
              uri: user
                ? user.userImg
                : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
            }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              marginLeft: padding,
            }}
          />
          <TextInput
            placeholder="Comment ...."
            placeholderTextColor="#fff"
            onChangeText={(val) => setCommentText(val)}
            style={{
              padding: 10,
              width: width / 1.8,
              borderRadius: padding,
              marginHorizontal: padding,
              backgroundColor: '#9999',
            }}
          />
          <MaterialCommunityIcons
            name="send-outline"
            style={{marginTop: padding - 12}}
            onPress={() => onSendComment()}
            size={24}
            color="black"
          />
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={comments}
        renderItem={({item}) => <CommentList item={item} />}
      />
    </View>
  );
}
