import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Animated,
  SafeAreaView,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PostCard from '../../Components/PostCard/PostCard';
import {width} from '../../Utils/constants/styles';
import {PhotogramText} from '../../Components/Text/PhotoGramText';
import {PhotoGramButton} from '../../Components/Buttons/PhotoGramButton';

function Profile({navigation, route}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState();
  const [userData, setUserData] = useState(null);
  const [chatUser, setChatUser] = useState();
  const [params, setParams] = useState();
  const [followers, setFollowers] = useState();
  const [followersId, setFollowersId] = useState([]);
  const _isMounted = React.useRef(true);

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const handleDelete = (postId) => {
    Alert.alert(
      'Delete post',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => deletePost(postId),
        },
      ],
      {cancelable: false},
    );
  };

  const fetchChatUser = async () => {
    await firestore()
      .collection('users')
      .doc(route.params.uid)
      .onSnapshot((data) => {
        setChatUser(data.data());
      });
  };

  const deletePost = (postId) => {
    firestore()
      .collection('Posts')
      .doc(postId)
      .get()
      .then((documentSnapshot) => {
        _isMounted.current = true;
        if (documentSnapshot.exists) {
          const {image} = documentSnapshot.data();

          if (image != null) {
            const storageRef = storage().refFromURL(image);
            const imageRef = storage().ref(storageRef.fullPath);

            imageRef
              .delete()
              .then(() => {
                deleteFirestoreData(postId);
              })
              .catch((e) => {
                console.log('Error while deleting the image. ', e);
              });
          } else {
            deleteFirestoreData(postId);
          }
        }
      });
  };

  const fetchUsersFollowers = async () => {
    await firestore()
      .collection('following')
      .doc(route.params ? route.params.uid : auth().currentUser.uid)
      .collection('userFollowing')
      .get()
      .then((data) => console.log(data.docs.length));
  };

  const deleteFirestoreData = (postId) => {
    firestore()
      .collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
        Alert.alert(
          'Post deleted!',
          'Your post has been deleted successfully!',
        );
        setDeleted(true);
      })
      .catch((e) => console.log('Error deleting post.', e));
  };

  const fetchUsersFollowing = async () => {
    await firestore()
      .collection('following')
      .doc(route.params ? route.params.uid : auth().currentUser.uid)
      .collection('userFollowing')
      .onSnapshot((querySnapshot) => {
        let followingData = querySnapshot.docs.map((doc) => {
          console.log(doc);
        });
        setFollowers(followingData.length);
        console.log(followingData);
      });
  };

  const onFollow = () => {
    firestore()
      .collection('following')
      .doc(auth().currentUser.uid)
      .collection('userFollowing')
      .doc(route.params.uid)
      .set({});
  };

  const onUnFollow = () => {
    firestore()
      .collection('following')
      .doc(auth().currentUser.uid)
      .collection('userFollowing')
      .doc(route.params.uid)
      .delete();
  };

  const fetchPosts = async () => {
    try {
      const list = [];

      await firestore()
        .collection('Posts')
        .where(
          'uid',
          '==',
          route.params ? route.params.uid : auth().currentUser.uid,
        )
        .orderBy('createdAt', 'desc')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const {uid, displayName, postText, image, createdAt, userImage} =
              doc.data();
            list.push({
              uid,
              displayName,
              postText,
              image,
              createdAt,
              userImage,
            });
          });
        });

      setPosts(list);
      if (loading) {
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUser = async () => {
    let getUsers = await firestore()
      .collection('users')
      .doc(route.params ? route.params.uid : auth().currentUser.uid)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      }, []);
  };

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      fetchUsersFollowing();
      getUser();
      fetchPosts();
      fetchUsersFollowers();
      fetchChatUser();
      console.log(followersId);
      if (followersId[0] === auth().currentUser.uid) {
        setFollowing(true);
      } else {
        setFollowing(false);
      }
    }
    navigation.addListener('focus', () => setLoading(!loading));

    return () => {
      unmounted = true;
    };
  }, [navigation, loading]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flexDirection: 'row'}}>
        <Image
          style={styles.userImg}
          source={{
            uri: userData
              ? userData.userImg ||
                'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png'
              : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
          }}
        />
        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{posts.length}</Text>
            <Text style={styles.userInfoSubTitle}>Posts</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>10,000</Text>
            <Text style={styles.userInfoSubTitle}>Followers</Text>
          </View>
          <View style={styles.userInfoItem}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Following', followersId)}>
              <Text style={styles.userInfoTitle}>{followers}</Text>
              <Text style={styles.userInfoSubTitle}>Following</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text style={styles.userName}>
        {userData ? userData.userName || 'Test' : 'Test'}
      </Text>
      <Text style={styles.aboutUser}>
        {userData ? userData.bio || 'No details added.' : ''}
      </Text>

      {route.params ? (
        route.params.uid === auth().currentUser.uid ? (
          <PhotoGramButton title={'EDIT'} onPress={() => navigation.navigate('EditScreen')} />
        ) : (
          <PhotoGramButton title={'Chat'}  padding={10} onPress={() => navigation.navigate('ChatRoom' ,chatUser)} />
        )
      ) : (
        <>
          <PhotoGramButton
            title={'EDIT'}
            padding={10}
            onPress={() => navigation.navigate('EditScreen')}
            backgroundColor={'#fff'}
            fontWeight={'h1'}
            color={'#000'}
            extraStyles={{width: width - 20, alignSelf: 'center'}}
          />
          <PhotoGramButton
            title={'LOGOUT'}
            padding={10}
            extraStyles={{
              marginVertical: 24 - 8,
              width: width - 20,
              alignSelf: 'center',
            }}
            fontWeight={'h1'}
            backgroundColor={'#fff'}
            color={'#000'}
          />
        </>
      )}

      {/* {route.params ? (
        route.params.uid === auth().currentUser.uid ? (
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditScreen')}
              style={styles.userBtn}>
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => auth().signOut()}
              style={{
                borderColor: '#000',
                borderWidth: 2,
                borderRadius: 3,
                paddingVertical: 8,
                paddingHorizontal: 12,
                marginHorizontal: 5,
                marginVertical: 4,
              }}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </>
        ) : following === true ? (
          <TouchableOpacity onPress={() => onUnFollow()} style={styles.userBtn}>
            <Text>Following</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => onFollow()} style={styles.userBtn}>
            <Text>follow</Text>
          </TouchableOpacity>
        )
      ) : (
        <TouchableOpacity
          onPress={() => navigation.navigate('EditScreen')}
          style={styles.userBtn}>
          <Text>Edit</Text>
        </TouchableOpacity>
      )}

      {route.params.uid !== auth().currentUser.uid ? (
        <TouchableOpacity
          onPress={() => navigation.navigate('ChatRoom', chatUser)}
          style={{
            borderColor: '#000',
            borderWidth: 2,
            borderRadius: 3,
            paddingVertical: 8,
            paddingHorizontal: 12,
            marginHorizontal: 5,
            marginVertical: 4,
          }}>
          <Text>Chat</Text>
        </TouchableOpacity>
      ) : (
        <View />
      )} */}

      <ScrollView>
        <Animated.FlatList
          data={posts}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => {
            const inputRange = [
              -1,
              0,
              (width / 7) * index,
              (width / 7) * (index + 2),
            ];

            const scale = scrollY.interpolate({
              inputRange,
              outputRange: [1, 1, 1, 0],
            });
            return (
              <PostCard
                scale={scale}
                item={item}
                onDelete={handleDelete}
                route={navigation}
              />
            );
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  userImg: {
    height: 100,
    width: 100,
    marginLeft: 35,
    marginTop: 24,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    left: 40,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    left: 40,
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    marginVertical: 24,
  },
  userBtnTxt: {
    color: '#000000',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '65%',
    marginVertical: 42,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
