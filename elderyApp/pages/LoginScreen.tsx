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
import { View } from 'react-native';

GoogleSignin.configure({
  scopes: ["https://www.googleapis.com/auth/fitness.activity.read profile email openid"], // what API you want to access on behalf of the user, default is email and profile
  webClientId: '59463143891-j5k7c9loabghrkdbacb92gpprfrkheed.apps.googleusercontent.com',
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: '', // specifies a hosted domain restriction
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  accountName: '', // [Android] specifies an account name on the device that should be used
});

const LoginScreen = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  // const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    getCurrentUser();
  }, [loggedIn]);

  const handleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
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

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <GoogleSigninButton
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={handleSignIn}
          disabled={false}
        />
    </View>
  );
};

export default LoginScreen;
