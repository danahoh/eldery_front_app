/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 // eslint-disable-next-line prettier/prettier
 */
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import Logo from '../assets/Logo.png';

// GoogleSignin.configure({
//   // scopes: ['https://www.googleapis.com/auth/fitness.activity.read profile email openid'], // what API you want to access on behalf of the user, default is email and profile
//   webClientId: '59463143891-01tuqo1e1qf76e0pairsceqe231e72m8.apps.googleusercontent.com',
//   offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
//   hostedDomain: '', // specifies a hosted domain restriction
//   forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
//   accountName: '', // [Android] specifies an account name on the device that should be used
// });
GoogleSignin.configure({
  webClientId: '59463143891-j5k7c9loabghrkdbacb92gpprfrkheed.apps.googleusercontent.com'
});

const LoginScreen = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  // const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    getCurrentUser();
  }, [loggedIn]);

  const handleSignIn = async () => {
    try {
      // await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setLoggedIn(true);
      // setUserInfo(userInfo.user);
      console.log(userInfo);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Operation (e.g. sign in) is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        const unknownError = error as Error;
        console.log(`Unknown error occurred: ${unknownError.message}`);
      }
    }
  };

  const getCurrentUser = async () => {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser) {
        setLoggedIn(true);
        // setUserInfo(currentUser.user);
      } else {
        setLoggedIn(false);
        // setUserInfo(null);
      }
    } catch (error) {
      console.log(`Error getting current user: ${error}`);
    }
  };

  const styles = StyleSheet.create({
    root:{
      alignItems: 'center',
      padding: 20,
    },
    logo: {
      width: '70%',
      maxHeight: 200,
      maxWidth: 300,
      marginLeft: 30,
    },
  });

  const {height} = useWindowDimensions();

  return (
    <View style={{ height: height, flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#add8e6' }}>
          <Image source={Logo} style={[styles.logo, {height: height * 0.3}]} resizeMode="contain"/>
          <Text
            style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize:35,
            marginTop: 33,
            color:'#000000',
            }}>
            ברוכים הבאים!
        </Text>
          <Text
            style={{
            textAlign: 'center',
            fontSize:26,
            marginTop: 33,
            color:'#000000',
            }}>
            אנא התחבר עם חשבון הגוגל שלך
        </Text>
        <View style={{
          marginTop:100,
          alignItems:'center',
          }}>
          <GoogleSigninButton
            style={{ width: 192, height: 48 }}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={handleSignIn}
            disabled={false}
          />
        </View>
    </View>
  );
};

export default LoginScreen;
