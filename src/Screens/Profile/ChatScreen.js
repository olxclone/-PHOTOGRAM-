import React, {useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import {GiftedChat, Bubble, InputToolbar} from 'react-native-gifted-chat';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function chatRoom({route}) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log(route.params.uid);
    const docid =
      route.params.uid > auth().currentUser.uid
        ? auth().currentUser.uid + '-' + route.params.uid
        : route.params.uid + '-' + auth().currentUser.uid;
    const messageRef = firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc');
    const unSubscribe = messageRef.onSnapshot((querySnap) => {
      const allmsg = querySnap.docs.map((docSanp) => {
        const data = docSanp.data();
        if (data.createdAt) {
          return {
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docSanp.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allmsg);
      console.log(route.params.userImg);
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const onSend = (messageArray) => {
    const msg = messageArray[0];
    const mymsg = {
      ...msg,
      sentBy: auth().currentUser.uid,
      sentTo: route.params.uid,
      createdAt: new Date(),
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, mymsg),
    );
    const docid =
      route.params.uid > auth().currentUser.uid
        ? auth().currentUser.uid + '-' + route.params.uid
        : route.params.uid + '-' + auth().currentUser.uid;
    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .add({...mymsg, createdAt: firestore.FieldValue.serverTimestamp()});
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <GiftedChat
        showAvatarForEveryMessage={true}
        showUserAvatar={true}
        isLoadingEarlier
        messages={messages}
        renderInputToolbar={(props) => <InputToolbar {...props} />}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: '#229AC9',
                },
              }}
            />
          );
        }}
        user={{
          _id: auth().currentUser.uid,
          avatar: auth().currentUser.photoURL,
        }}
        onSend={(messages) => onSend(messages)}
      />
    </View>
  );
}
