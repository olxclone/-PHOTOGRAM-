import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Modal,
} from 'react-native';
import {padding, width, height} from '../../Utils/constants/styles';
import color from '../../Utils/constants/color';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import DocumentPicker from 'react-native-document-picker';
import {PhotogramTextInput} from '../../Components/TextInput/PhotoGramTextInput';
import {PhotoGramButton} from '../../Components/Buttons/PhotoGramButton';
import {Alert} from 'react-native';
import {PhotogramText} from '../../Components/Text/PhotoGramText';

export default function signUp({navigation}) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState();
  const [firestoreNickName, setFirestoreNickName] = useState([]);
  const [userName, setUserName] = useState('');
  const [imageUrl, setImageUrl] = useState();
  const [nickName, setNickName] = useState('');

  async function findUsersWithNicName() {
    try {
      await firestore()
        .collection('users')
        .onSnapshot((data) => {
          data.docs.map((item) => {
            let nickname = item.data().nickname;
            setFirestoreNickName(nickname);
            console.log(nickname);
            return nickname;
          });
        });
    } catch (error) {}
  }

  async function signUp() {
    if (email.length < 0 || (email.length < 20 && password.length > 24)) {
      setError('Please provide a valid email or password');
      Alert.alert('Please provide a valid email or password');
    } else {
      if (nickName) {
        console.log(findUsersWithNicName);
      } else {
        auth()
          .createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            userCredential.user.updateProfile({
              displayName: userName,
              photoURL: imageUrl,
            });
            firestore().collection('users').doc(userCredential.user.uid).set({
              userName,
              nickName,
              userImg: '',
              email,
              uid: userCredential.user.uid,
              createdAt: Date.now(),
              bio: '',
              web: '',
            });
          })
          .catch((error) => {
            Alert.alert(error.message);
          });
      }
    }
  }

  useEffect(() => {
    let nickname = userName.toLowerCase().replace(/\s/g, '');
    setNickName(nickname);
    console.log(nickname);
  });

  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <ScrollView>
        <PhotogramText
          text={'𝓟𝓱𝓸𝓽𝓸𝓰𝓻𝓪𝓶'}
          fontSize={64}
          fontWeight={'h1'}
          extraStyles={{
            top: height / 5,
            alignSelf: 'center',
            position: 'absolute',
          }}
        />
        <KeyboardAvoidingView style={{marginTop: '65%'}}>
          <PhotogramTextInput
            padding={10}
            fontSize={padding - 6}
            onChangeText={(u) => setUserName(u)}
            onChange={() => findUsersWithNicName()}
            placeholder={'UserName'}
            extraStyles={{
              backgroundColor: '#F6F6F6',
              marginHorizontal: padding,
              borderColor: '#111',
              borderWidth: 0.5,
              borderRadius: 5,
            }}
          />
          <PhotogramTextInput
            placeholder={'Email'}
            onChangeText={(val) => setEmail(val)}
            extraStyles={{
              padding: 10,
              marginVertical: padding,
              fontSize: padding - 6,
              backgroundColor: '#F6F6F6',
              marginHorizontal: padding,
              borderColor: '#111',
              borderWidth: 0.5,
              borderRadius: 5,
            }}
          />
          <PhotogramTextInput
            placeholder={'Password'}
            onChangeText={(val) => setPassword(val)}
            secureTextEntry
            extraStyles={{
              padding: 10,
              fontSize: padding - 6,
              backgroundColor: '#F6F6F6',
              marginHorizontal: padding,
              borderColor: '#111',
              borderWidth: 0.5,
              borderRadius: 5,
            }}
          />

          <PhotoGramButton
            title={'Register'}
            padding={10}
            onPress={() => signUp()}
            fontSize={padding - 4}
            extraStyles={{
              alignSelf: 'center',
              padding: 10,
              borderRadius: 5,
              width: width - 40,
              marginTop: width / 7,
            }}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}

{
  /* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: width / 14,
              elevation: 28,
              shadowColor: color.secondry,
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              onPress={() => signUp()}
              style={{
                alignSelf: 'center',
                backgroundColor: '#45A4FF',
                padding: 10,
                borderRadius: 5,
                width: width - 40,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: padding - 4,

                    textAlign: 'center',
                    color: color.primary,
                  }}>
                  Sign up
                </Text>
              </View>
            </TouchableOpacity>
          </View> */
}
