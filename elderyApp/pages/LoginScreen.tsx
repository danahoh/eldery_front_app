import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import Logo from '../assets/Logo.png';
import { ParamList } from './questionnaire';
import axios from 'axios';
import GoogleFit, {Scopes} from 'react-native-google-fit';
import { getRequestHeaders } from './DataRequestManager';


GoogleSignin.configure({
  webClientId: '59463143891-j5k7c9loabghrkdbacb92gpprfrkheed.apps.googleusercontent.com'
});

interface LoginProps {
  route: RouteProp<ParamList, 'LoginScreen'>;
  navigation: NavigationProp<ParamList, 'Questionnaire'>;
  inGoogleSignin: boolean;
  handleGoogleSignin: () => void;
}

export const LoginScreen: React.FC<LoginProps> = ({ route, navigation, inGoogleSignin, handleGoogleSignin }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    getCurrentUser();
  }, [loggedIn]);

  // const handleLogIn = async () => {
  //   try {
  //     console.log("handleLogIn");
  //     const apiUrl = 'http://localhost:3000/elderly/login';
  //     const data = {
  //       email: "tamar",
  //       // Add other fields as needed
  //     };
  //     let headers= {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       }}
  //       console.log(amit)
  
  //     const response = await axios.post(apiUrl, 
  //       {data}, headers,
  //     )
  //     console.log(response)
  
  //     // const postDataUsingSimplePostCall = () => {
  //     //   console.log("before axios");
  //     //   axios.post(apiUrl, data)
  //     //     .then(function (response) {
  //     //       console.log(response.data);
  //     //     })
  //     //     .catch(function (error) {
  //     //       console.log("in axios error")
  //     //       console.log(error);
  //     //     });
  //     // };
  
  //     // Call the postDataUsingSimplePostCall function to trigger the axios.post request
  //     // postDataUsingSimplePostCall();
  //   } catch(error:any) {
  //     console.log("errorrrrr");

  //     console.log(error);
  //   }
  // };
  
  const handleSignIn = async () => {
    try {
      const userInfo = await GoogleSignin.signIn();
      const { accessToken } = await GoogleSignin.getTokens();
      setLoggedIn(true);
      console.log(userInfo);







      console.log("getRequestHeaders",getRequestHeaders(accessToken));






      navigation.navigate("Questionnaire")
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
      } else {
        setLoggedIn(false);
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

