import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {padding, width, height} from '../../Utils/constants/styles';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import ImagePicker from 'react-native-image-crop-picker';
import {PhotogramTextInput} from '../../Components/TextInput/PhotoGramTextInput';

export default function PostScreen({navigation}) {
  const [imageUri, setImageUri] = useState();
  const [postText, setPostText] = useState();
  const [transferred, setTransferred] = useState(0);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(null);
  const [userData, setUserData] = useState();

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  };

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      getUser();
    }
    navigation.addListener('focus', () => setLoading(!loading));
    return () => {
      unmounted = true;
    };
  }, [navigation, loading]);

  const LauchCamera = () => {
    ImagePicker.openCamera({
      width: 500,
      height: 800,
      cropping: true,
      avoidEmptySpaceAroundImage: true,
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      // console.log(image.path);
      setImageUri(image.path);
      // this.bs.current.snapTo(1);
    });
  };

  const uploadImage = async () => {
    if (!imageUri) {
      return null;
    } else {
      const path = `photos/${auth().currentUser.uid}/${Date.now()}`;
      return new Promise(async (resolve, rej) => {
        const response = await fetch(imageUri);
        const file = await response.blob();
        let upload = storage().ref(path).put(file);
        upload.on(
          'state_changed',
          (snapshot) => {
            console.log(
              `${snapshot.bytesTransferred} transferred out of ${snapshot.totalBytes}`,
            ),
              setVisible(true);
            setTransferred(
              Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            );
          },
          (err) => {
            rej(err);
          },
          async () => {
            const url = await upload.snapshot.ref.getDownloadURL();
            setVisible(false);
            console.log(url);
            resolve(url);
            setImageUri(null);
          },
        );
      });
    }
  };

  async function handleUpload({Url}) {
    setPostText('');
    const uri = await uploadImage(Url);
    return new Promise((res, rej) => {
      firestore()
        .collection('Posts')
        .add({
          uid: auth().currentUser.uid,
          image: uri,
          postText: postText,
          createdAt: Date.now(),
          userImage: userData.imageUrl ? userData.imageUrl : null,
          displayName: userData.userName,
          likes: null,
          comments: null,
        })
        .then((ref) => {
          alert('post added');
          navigation.navigate('Home');
          res(ref);
        })
        .catch((err) => {
          console.log(err);
          rej(err);
        });
    });
  }

  return (
    <View>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={{
            uri: userData
              ? userData.userImg
                ? userData.userImg
                : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png'
              : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
          }}
          style={{
            width: 75,
            height: 75,
            borderRadius: 100,
            marginTop: 25,
            marginHorizontal: 4,
          }}
        />
        <PhotogramTextInput
          placeholder={"what's in your mind"}
          onChangeText={(val) => setPostText(val)}
          extraStyles={styles.PostInput}
        />
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Entypo name="images" size={24} color="black" />
        <TouchableOpacity
          style={{marginHorizontal: 32}}
          onPress={choosePhotoFromLibrary}>
          <AntDesign name="camera" size={28} color={'#000'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{alignSelf: 'flex-end'}}
          onPress={handleUpload}>
          <AntDesign
            name="upload"
            style={{fontWeight: '900', marginRight: 24}}
            size={28}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <Image
        resizeMode="stretch"
        source={{uri: imageUri}}
        style={styles.UploadImage}
      />
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
          <Text style={{fontWeight: '700', fontSize: height / 18}}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  PostInput: {
    marginVertical: padding + height / 40,
    textAlign: 'center',
    fontSize: 15,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    color: 'white',
    width: Dimensions.get('window').width - 120,
    borderRadius: 12,
  },
  UploadImage: {
    width,
    height: 500,
    marginHorizontal: 30,
    marginVertical: 30,
    alignSelf: 'center',
  },
});
