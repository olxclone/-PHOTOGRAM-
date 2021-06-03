import React, {Children, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import firebase from '@react-native-firebase/app';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import firestore from '@react-native-firebase/firestore';
import {
  TouchableOpacity,
  View,
  LogBox,
  Text,
  Image,
  ViewPagerAndroid,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import PushNotifications from 'react-native-push-notification';
import { enableScreens } from 'react-native-screens'
enableScreens();

// SCREEN IMPORTS
import {firebaseConfig} from './src/Utils/firebaseConfig';
import Loading from './src/Screens/Auth/Loading';
import signIn from './src/Screens/Auth/SignIn';
import ForgotScreen from './src/Screens/Auth/forgetScreen';
import signUp from './src/Screens/Auth/signUp';
import Home from './src/Screens/Main/Home';
import Search from './src/Screens/Main/Search';
import PostScreen from './src/Screens/Main/PostScreen';
import chatRoom from './src/Screens/Profile/ChatScreen';
import Following from './src/Screens/Profile/Following';
import Profile from './src/Screens/Profile/Profile';
import EditProfile from './src/Screens/Profile/EditProfile';
import Notifications from './src/Screens/Profile/Notifications';
import ImageDetails from './src/Screens/Profile/ImageDetails';
import Comments from './src/Screens/Main/Comments';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = async props => {
  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
      console.log('Your Firebase Token is:', fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFcmToken();

      console.log('Authorization status:', authStatus);
    }
  };
  useEffect(() => {
   LogBox.ignoreAllLogs()
    requestUserPermission();
    messaging()
      .hasPermission()
      .then((enabled) => {
        console.log(enabled);
      });
    messaging()
      .getToken()
      .then((fcmToken) => {
        if (fcmToken) {
          console.log(fcmToken);
        } else {
          // user doesn't have a device token yet
        }
      });

    //  PushNotifications.configure({
    //   onRegister: function(token) {
    //     console.log('TOKEN:', token)
    //   },

    //   onNotification: function(notification) {
    //     console.log('REMOTE NOTIFICATION ==>', notification)
    //   },
    //   senderID: '1095734728208',
    //   popInitialNotification: true,
    //   requestPermissions: true
    // })
  }, []);

  if (!firebase.app()) {
    firebase.initializeApp(firebaseConfig);
    firestore().settings({experimentalForceLongPolling: true});
  } else {
    firebase.app();
  }

  function TabNavigator() {
    return (
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#000',
          inactiveTintColor: 'rgba(0,0,0,0.5)',
        }}>
        <Tab.Screen
          name="Home"
          options={{
            tabBarLabel: '',
            tabBarIcon: ({color, focused}) =>
              focused ? (
                <Entypo name="home" size={focused ? 32 : 24} color="black" />
              ) : (
                <AntDesign
                  name="home"
                  style={{}}
                  color={color}
                  size={focused ? 32 : 24}
                />
              ),
          }}
          component={Home}
        />

        <Tab.Screen
          name="search"
          options={{
            tabBarLabel: '',
            tabBarVisible: false,
            tabBarIcon: ({color, focused}) =>
              focused ? (
                <FontAwesome5
                  name="search"
                  size={focused ? 32 : 24}
                  color="black"
                />
              ) : (
                <AntDesign name="search1" size={24} color={color} />
              ),
          }}
          component={Search}
        />

        <Tab.Screen
          name={'Post'}
          component={PostScreen}
          options={{
            tabBarVisible: false,
            tabBarLabel: '',
            tabBarIcon: ({color, focused}) =>
              focused ? (
                <AntDesign
                  name="plussquare"
                  size={focused ? 32 : 24}
                  color={color}
                />
              ) : (
                <AntDesign name="plussquareo" size={24} color="black" />
              ),
          }}
        />

        <Tab.Screen
          name="Notification"
          options={{
            tabBarLabel: '',
            tabBarIcon: ({color, focused}) =>
              focused ? (
                <FontAwesome
                  name="bell"
                  size={focused ? 32 : 24}
                  color="black"
                />
              ) : (
                <FontAwesome name="bell-o" size={24} color="black" />
              ),
          }}
          component={Notifications}
        />

        <Tab.Screen
          name="Profile"
          options={{
            tabBarLabel: '',
            tabBarIcon: ({color, focused}) => (
              <Ionicons
                name={focused ? 'people' : 'people-outline'}
                style={{justifyContent: 'center', position: 'absolute'}}
                color={color}
                size={focused ? 32 : 24}
              />
            ),
          }}
          component={Profile}
        />
      </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Loading"
          options={{headerShown: false}}
          component={Loading}
        />

        <Stack.Screen
          name="signIn"
          options={{headerShown: false}}
          component={signIn}
        />
        <Stack.Screen
          name="signUp"
          options={{headerShown: false}}
          component={signUp}
        />
        <Stack.Screen
          name="Main"
          options={{headerShown: false}}
          component={TabNavigator}
        />
        <Stack.Screen
          name="PostScreen"
          options={{headerShown: true}}
          component={PostScreen}
        />
        <Stack.Screen name="Forgot" component={ForgotScreen} />
        <Stack.Screen
          name="EditScreen"
          options={{headerShown: false}}
          component={EditProfile}
        />
        <Stack.Screen
          name="HomeProfile"
          options={{headerShown: false}}
          component={Profile}
        />
        <Stack.Screen
          name="ChatRoom"
          options={({route}) => ({
            title: (
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={{
                    uri: route.params.userImg
                      ? route.params.userImg
                      : 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png',
                  }}
                  style={{borderRadius: 100, width: 50, height: 50}}
                />
                <Text
                  style={{fontSize: 22, marginTop: 8, marginHorizontal: 12}}>
                  {route.params.userName}
                </Text>
              </View>
            ),
          })}
          component={chatRoom}
        />
        <Stack.Screen component={Following} name="Following" />
        <Stack.Screen component={ImageDetails} name="ImageDetails" />
        <Stack.Screen component={Comments} name="Comments" />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;