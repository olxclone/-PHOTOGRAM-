import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import {padding, width, height} from '../../Utils/constants/styles';
import color from '../../Utils/constants/color';

export default function ForgotScreen() {
  const [email, setEmail] = useState();
  const [error, setError] = useState();

  const resetPassword = () => {
    auth()
      .sendPasswordResetEmail(email)
      .then(() => alert('check your email'))
      .catch((err) => {
        setError(err.message);
      });
  };
  return (
    <View style={{alignItems: 'center', top: '30%'}}>
      <TextInput
        placeholder="Email"
        onChangeText={(val) => setEmail(val)}
        style={{
          padding,
          fontSize: padding,
          elevation: 28,
          backgroundColor: color.primary,
          shadowColor: color.secondry,
          marginHorizontal: width / 2,
          fontWeight: 'bold',
          width: '80%',
        }}
      />
      <Text
        style={{
          color: 'red',
          top: 24 / 2,
          fontWeight: 'bold',
          letterSpacing: 0.5,
          fontSize: padding - 2,
          textAlign: 'center',
          marginTop: padding - 10,
        }}>
        {error}
      </Text>
      <TouchableOpacity
        onPress={() => resetPassword(email)}
        style={{
          elevation: 28,
          shadowColor: color.secondry,
          marginVertical: padding,
        }}>
        <View style={{elevation: 28, shadowColor: color.secondry}}>
          <Text
            style={{
              fontSize: padding - 1,
              marginLeft: padding,
              backgroundColor: color.secondry,
              padding,
              borderRadius: padding,
              width: width / 3,
              textAlign: 'center',
              color: color.primary,
            }}>
            Send
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
