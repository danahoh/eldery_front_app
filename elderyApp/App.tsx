import React, { useState, useEffect } from 'react';
import { AppState, Text, TouchableOpacity, View ,I18nManager} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './pages/LoginScreen';
import { Questionnaire, AfterQuestionnaire } from './pages/questionnaire';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import messaging from '@react-native-firebase/messaging';
import {HomeMenuView } from './pages/HomeMenuView';
import axios from 'axios';
import RNRestart from 'react-native-restart';

import { StartQuestionnaire } from './pages/startQuestionnaire';

import DatesTimePicker from './pages/DatesTimePicker';
import PersonalCharts from './pages/PersonalCharts';


const Stack = createNativeStackNavigator();

export default function App() {
  const [inGoogleSignIn, setInGoogleSignIn] = useState<boolean>(false);

  const fetchFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      if (token) {
        // Log and toast
        const msg = `FCM Registration Token: ${token}`;
        console.log(msg);
        shouldRestart(token);
      } else {
        console.log('Failed to get FCM registration token.');
      }
    } catch (error) {
      console.error('Error fetching FCM registration token:', error);
    }
  };
  const shouldRestart = async(token: string) => {
    try {
      const loggedInBefore = await axios.get(`https://elderyresearch.cs.bgu.ac.il/elderly/firstLogin/${token}`)
      console.log("SHOULD RESTART - " , !loggedInBefore.data);
      if(!loggedInBefore.data){
        RNRestart.restart();
      }
    }
    catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
    fetchFCMToken();

  messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return () => {
      try{
        (AppState as any).removeEventListener('change', handleAppStateChange);
        unsubscribe();
      }
      catch(e)
      {
        console.error(e);
        
      }
    };
  }, []);

  // useEffect(
  //   () => {
    
  //     axios.get('http://10.0.2.2:3000/api/cookies').then((response) => {
  //       console.log(response.data);
  //     }).catch((error)=>{console.log("%o",error)})   
  //    },[]);

  const handleAppStateChange = (nextAppState: any) => {
    console.log('app state is : ', nextAppState);
    if ((nextAppState === 'inactive' || nextAppState === 'background') && !inGoogleSignIn) {
      // Perform your desired action here when the app is being closed
      console.log('App is closing');
      GoogleSignin.signOut();
    }
  };

  const handleInGoogleSignInUpdate = (inSignIn: boolean) => {
    setInGoogleSignIn(inSignIn);
    console.log('handleInGoogleSignInUpdate', inSignIn);
  };
  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
            backgroundColor: '#1d7595',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 35
      }}}>
      <Stack.Screen 
  name="LoginScreen" 
  initialParams={{ inGoogleSignIn }}
  options={{ headerShown: false }}
>
  {(props) => <LoginScreen {...props} onInGoogleSignInUpdate={handleInGoogleSignInUpdate} />}
</Stack.Screen>
        <Stack.Screen name="HomeMenuView" component={HomeMenuView} options={{ headerShown: false }}/>
        <Stack.Screen name="Questionnaire" component={Questionnaire} options={{ headerShown: true , title: "שאלון יומי",
      }}/>
        <Stack.Screen name="AfterQuestionnaire" component={AfterQuestionnaire} options={{ headerShown: false }} />
        <Stack.Screen name='StartQuestionnaire' component={StartQuestionnaire} options={{ headerShown: true , title: "שאלון התחלתי"}}/>
        <Stack.Screen name="DatesTimePicker" component={DatesTimePicker} options={{ headerShown: true , title: "נתונים אישיים"}}/>
        <Stack.Screen name="PersonalCharts" component={PersonalCharts} options={{ headerShown: true , title: "נתונים אישיים"}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
