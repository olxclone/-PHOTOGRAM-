import React, { useState, useEffect } from 'react';

import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  KeyboardAvoidingView,
  Alert,
  Platform,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { padding, width, height } from '../../Utils/constants/styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditProfileheader from '../../../header';
import ImagePicker from 'react-native-image-crop-picker';

export default function EditProfile({ navigation }) {
  const [imageUri, setImageUri] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [bio, setBio] = useState();
  const [web, setWeb] = useState();
  const [transferred, setTransferred] = useState(0);
  const [visible, setVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [userData, setUserData] = useState();

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then((image) => {
      console.log(image);
      const imageUri = image.path;
      setImage(imageUri);
      this.bs.current.snapTo(1);
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image.path);
      setImageUri(image.path);
      // this.bs.current.snapTo(1);
    });
  };

  useEffect(() => {
    const cleanUp = getUser();
    return () => cleanUp;
  });

  const getUser = () => {
    let currentUser = firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .get()
      .then((documentSnaphot) => {
        if (documentSnaphot.exists) {
          setUserData(documentSnaphot.data());
        }
      }, []);
  };

  const handleUpdate = () => {
    let image = imageUrl;
    firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .update({
        userName: firstName + ' ' + lastName,
        userImg: imageUrl,
        email: auth().currentUser.email,
        uid: auth().currentUser.uid,
        createdAt: Date.now(),
        bio,
        web,
      })
      .then(() => alert('updated'));
  };

  const uploadImage = async () => {
    const path = `profile/${Date.now()}/${Date.now()}`;
    return new Promise(async (resolve, rej) => {
      const response = await fetch(imageUri);
      const file = await response.blob();
      let upload = storage().ref(path).put(file);

      console.log('Post Added');
      upload.on(
        'state_changed',
        (snapshot) => {
          console.log(
            `${snapshot.bytesTransferred} transferred out of ${snapshot.totalBytes}`,
          );
          setTransferred(
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );

          setVisible(true);
        },

        (err) => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          console.log(url);
          setImageUrl(url);
          resolve(url);
          setVisible(false);
          setImageUri(null);
          setUploading(false);
        },
      );
    });
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <EditProfileheader onUpdate={handleUpdate} navigation={navigation} />
      <KeyboardAvoidingView enabled={true} behavior={'padding'}>
        <TouchableOpacity onPress={() => choosePhotoFromLibrary()}>
          <View style={{ alignSelf: 'center', marginTop: '7%' }}>
            <Image
              source={{
                uri: imageUri
                  ? imageUri
                  : userData
                    ? userData.userImg
                    : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
              }}
              style={{
                width: 105,
                borderRadius: 100,
                height: 105,
              }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => uploadImage()}>
          <Text
            style={{
              fontSize: padding - 6,
              color: '#128EF2',
              marginTop: '3%',
              alignSelf: 'center',
            }}>
            {'Change Profile Photo'}
          </Text>
        </TouchableOpacity>
        {/* Main */}
        <View style={{ marginTop: padding + 6 }}>
          <View>
            <Text style={{ marginLeft: padding - 6 }}>First Name</Text>
            <TextInput
              onChangeText={(val) => setFirstName(val)}
              style={{
                fontSize: padding - 4,
                borderBottomColor: 'rgba(0,0,0,0.4)',
                marginHorizontal: 18,
                borderBottomWidth: 1,
              }}
            />
          </View>
          <View style={{ marginVertical: padding }}>
            <Text style={{ marginLeft: padding - 6 }}>Last Name</Text>
            <TextInput
              onChangeText={(val) => setLastName(val)}
              style={{
                fontSize: padding - 4,
                borderBottomColor: 'rgba(0,0,0,0.4)',
                marginHorizontal: 18,
                borderBottomWidth: 1,
              }}
            />
          </View>
        </View>
        <View style={{ marginBottom: padding }}>
          <Text style={{ marginLeft: padding - 6 }}>website</Text>
          <TextInput
            onChangeText={(val) => setWeb(val)}
            style={{
              fontSize: padding - 4,
              borderBottomColor: 'rgba(0,0,0,0.4)',
              marginHorizontal: 18,
              borderBottomWidth: 1,
            }}
          />
        </View>
        <View>
          <Text style={{ marginLeft: padding - 6 }}>Bio</Text>
          <TextInput
            onChangeText={(val) => setBio(val)}
            style={{
              fontSize: padding - 4,
              borderBottomColor: 'rgba(0,0,0,0.4)',
              marginHorizontal: 18,
              borderBottomWidth: 1,
            }}
          />
        </View>
      </KeyboardAvoidingView>
      <Modal
        animationType="slide"
        style={{
          height: height / 2,
          justifyContent: 'center',
          alignSelf: 'center',
        }}
        visible={visible}>
        <View
          style={{
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: '50%',
          }}>
          <Text style={{ fontWeight: '700', fontSize: height / 18 }}>
            Uploading
          </Text>
          <Text
            style={{
              fontWeight: '700',
              fontSize: height / 28,
              alignSelf: 'center',
              marginTop: 24,
            }}>
            {transferred} %
          </Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
