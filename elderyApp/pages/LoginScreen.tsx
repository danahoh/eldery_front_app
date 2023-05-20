import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {NavigationProp} from '@react-navigation/native';
import axios from 'axios';

import React, {useState, useEffect} from 'react';
import {Text, View, Image, StyleSheet, useWindowDimensions} from 'react-native';
import {getCookie, SetCookie} from './CookieManager';
import {ParamList} from './questionnaire';
// import { elderlyApi } from '../interceptors/elderyApi';

const elderlyApi = axios.create({
  baseURL: 'http://10.0.2.2:3000/api', // Set your base URL
});
elderlyApi.interceptors.request.use(
  async config => {
    const token = await GoogleSignin.getTokens();
    if (!config?.headers) {
      config.headers = {};
    }
    config.headers.AccessToken = token.accessToken;
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

GoogleSignin.configure({
  webClientId:
    '59463143891-j5k7c9loabghrkdbacb92gpprfrkheed.apps.googleusercontent.com',
});

interface LoginProps {
  navigation: NavigationProp<ParamList>;
  onInGoogleSignInUpdate: (inGoogleSignIn: boolean) => void;
}

export const LoginScreen: React.FC<LoginProps> = ({
  navigation,
  onInGoogleSignInUpdate,
}) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    getCurrentUser();
  }, [loggedIn]);

  const handleSignIn = async () => {
    try {
      const userInfo = await GoogleSignin.signIn();
      setLoggedIn(true);
      onInGoogleSignInUpdate(true);
      // elderlyApi
      //   .post('/cookies', {})
      //   .then(response => {})
      //   .catch(error => {
      //     console.error(error);
      //   });
      navigation.navigate('HomeMenuView', {inGoogleSignIn: true});
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
    root: {
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
    <View
      style={{
        height: height,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#add8e6',
      }}>
      <Image
        source={require('../assets/Logo.png')}
        style={[styles.logo, {height: height * 0.3}]}
        resizeMode="contain"
      />
      <Text
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 35,
          marginTop: 33,
          color: '#000000',
        }}>
        ברוכים הבאים!
      </Text>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 26,
          marginTop: 33,
          color: '#000000',
        }}>
        אנא התחבר עם חשבון הגוגל שלך
      </Text>
      <View
        style={{
          marginTop: 100,
          alignItems: 'center',
        }}>
        <GoogleSigninButton
          style={{width: 192, height: 48}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={handleSignIn}
          disabled={false}
        />
      </View>
    </View>
  );
};
