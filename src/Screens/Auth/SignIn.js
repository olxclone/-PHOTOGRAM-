import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, KeyboardAvoidingView, Alert} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {padding, width, height} from '../../Utils/constants/styles';
import color from '../../Utils/constants/color';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import {PhotogramTextInput} from '../../Components/TextInput/PhotoGramTextInput';
import {PhotoGramButton} from '../../Components/Buttons/PhotoGramButton';
import {PhotogramText} from '../../Components/Text/PhotoGramText';

export default function signIn({navigation}) {
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (email === undefined && password === undefined) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  });

  function Login() {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => console.log(result))
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email':
            Alert.alert('The email you have entered is invalid');
          case 'auth/user-disabled':
            Alert.alert('This user is Disabled');
          case 'auth/user-not-found':
            Alert.alert('The email you have entered could not be found');
          case 'auth/wrong-password':
            Alert.alert('The password is incorrect');
        }
      });
  }

  return (
    <KeyboardAvoidingView style={{backgroundColor: '#fff', flex: 1}}>
      <View>
        <PhotogramText
          text={'Photogram'}
          fontFamily={'Roboto-Bold'}
          fontSize={64}
          fontWeight={'h1'}
          extraStyles={{
            top: height / 5,
            alignSelf: 'center',
            position: 'absolute',
          }}
        />
        <KeyboardAvoidingView style={{marginTop: height / 3}}>
          <PhotogramTextInput
            onChangeText={(val) => setEmail(val)}
            padding={10}
            placeholder={'Email'}
            fontSize={padding - 6}
            extraStyles={{
              backgroundColor: '#F6F6F6',
              marginVertical: padding - 4,
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
            onPress={() => Login(email, password)}
            padding={10}
            title={'Login'}
            fontSize={padding - 4}
            extraStyles={{
              alignSelf: 'center',
              backgroundColor: '#45A4F976',
              padding: 10,
              borderRadius: 5,
              width: width - 40,
              marginTop: 24,
            }}
            backgroundColor={'#45A4F976'}
          />

          <PhotogramText
            onPress={() => {
              navigation.navigate('Forgot');
            }}
            fontSize={12}
            extraStyles={{textAlign: 'center', marginVertical: 24}}
            text={'Forgot yor password ? Get help in logging in .'}
          />
        </KeyboardAvoidingView>
      </View>
      <View
        style={{
          position: 'absolute',
          zIndex: 10,
          bottom: 5,
          borderTopColor: '#222',
          borderTopWidth: 0.5,
          flexDirection: 'row',
          width,
          padding: 10,
        }}>
        <PhotogramText text={"Dont't have an account?"} />
        <PhotoGramButton
          onPress={() => navigation.navigate('signUp')}
          title={'Register here'}
          color={'#1467b7'}
          extraStyles={{marginHorizontal: 4}}
          backgroundColor={'#fff'}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
