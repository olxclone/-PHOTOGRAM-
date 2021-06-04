import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  View,
  FlatList,
  Image,
  TextInput,
  Keyboard,
  Text,
  TextInputComponent,
  KeyboardAvoidingView,
} from 'react-native';
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
    <View style={{flex: 1}}>
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={comments}
          renderItem={({item}) => <CommentList item={item} />}
        />
      </View>
      <KeyboardAvoidingView behavior='padding' style={{flex: 1, justifyContent: 'flex-end'}}>
        <View style={{flexDirection: 'row'}}>
          <TextInput
            onChangeText={(text) => setCommentText(text)}
            style={{
              padding: 10,
              width: width - 30,
              backgroundColor: 'rgba(0,0,0,0.12)',
            }}
          />
          <MaterialCommunityIcons
            onPress={onSendComment}
            style={{marginTop: 12}}
            name="send"
            size={24}
            color="black"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
