import React, {useEffect, useState, useRef, useMo} from 'react';
import {
  View,
  RefreshControl,
  FlatList,
  Alert,
  SafeAreaView,
  Text,
  Animated,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import PostCard from '../../Components/PostCard/PostCard';
import {height, width} from '../../Utils/constants/styles';

export default function Home({navigation}) {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState();
  const [user, setUser] = useState();
  const [refresing, setRefreshing] = useState();
  const [deleted, setDeleted] = useState();
  const _isMounted = useRef(true);

  useEffect(() => {
    let unmounted = false;
    if (!unmounted) {
      getUser();
      fetchPosts().then(() => setRefreshing(false));
      setDeleted(false);
      fetchPosts();
    }
    return () => {
      unmounted = false;
    };
  }, [deleted]);

  const getUser = async () => {
    let currentUser = await firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .onSnapshot((documentSnaphot) => {
        setUser(documentSnaphot.data());
      }, []);
  };

  function onRefresh() {
    fetchPosts().then(() => setRefreshing(false));
  }

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

  const fetchPosts = async () => {
    try {
      const Lists = [];
      await firestore()
        .collection('Posts')
        .orderBy('createdAt', 'desc')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const {
              uid,
              displayName,
              userImage,
              createdAt,
              postText,
              image,
              likes,
            } = doc.data();

            Lists.push({
              id: doc.id,
              uid,
              displayName,
              userImage,
              createdAt,
              postText,
              image,
              liked: false,
              likes,
            });
          });
        });

      setPosts(Lists);

      if (loading) {
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const scrollY = React.useRef(new Animated.Value(0)).current;

  return (
    <View>
      <View style={{backgroundColor: '#FFF', padding: 16}}>
        <SafeAreaView>
          <Text
            style={{
              alignSelf: 'center',
              fontWeight: 'bold',
              fontSize: 38,
            }}>
            𝓟𝓱𝓸𝓽𝓸𝓰𝓻𝓪𝓶
          </Text>
        </SafeAreaView>
      </View>
      <Animated.FlatList
        data={posts}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            colors={['#45C1FF', '#45B9FF']}
            onRefresh={() => onRefresh()}
            refreshing={refresing}
          />
        }
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => {
          const inputRange = [
            -5,
            0,
            (width / 1.2) * index,
            (width / 1.2) * (index + 2),
          ];

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0],
          });

          return (
            <PostCard
              scale={scale}
              item={item}
              navigation={navigation}
              onDelete={handleDelete}
            />
          );
        }}
      />
    </View>
  );
}
