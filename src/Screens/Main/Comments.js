import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {View, Text, FlatList, Alert, ScrollView, Image} from 'react-native';
import {PhotogramTextInput} from '../../Components/TextInput/PhotoGramTextInput';
import {height, padding, width} from '../../Utils/constants/styles';
import {PhotoGramButton} from '../../Components/Buttons/PhotoGramButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommentList from '../../Components/commentsList/commentList';

export default function Comments({route}) {
  let [commentText, setCommentText] = useState('');
  let [comments, setComments] = useState([]);
  let [user, setUser] = useState();

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
      })
  };

  return (
    <View>
      <View style={{flexDirection: 'row', marginVertical: padding}}>
        <Image
          source={{
            uri: user
              ? user.userImg
              : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
          }}
          style={{width: 50, height: 50, borderRadius: 50, marginLeft: padding}}
        />
        <PhotogramTextInput
          padding={10}
          placeholder="Comment ...."
          placeholderTextColor="#fff"
          onChangeText={(val) => setCommentText(val)}
          extraStyles={{
            width: width / 1.8,
            borderRadius: padding,
            alignSelf: 'baseline',
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
      <FlatList
        showsVerticalScrollIndicator={false}
        data={comments}
        renderItem={({item}) => <CommentList item={item} />}
      />
    </View>
  );
}
