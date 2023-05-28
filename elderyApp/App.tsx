import React, { useState, useEffect } from 'react';
import { AppState, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './pages/LoginScreen';
import { Questionnaire, AfterQuestionnaire } from './pages/questionnaire';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {HomeMenuView } from './pages/HomeMenuView';
import ChartExample from './pages/Chart';
import axios from 'axios';

import { StartQuestionnaire } from './pages/startQuestionnaire';

import DatesTimePicker from './pages/DatesTimePicker';
import PersonalCharts from './pages/PersonalCharts';


const Stack = createNativeStackNavigator();

export default function App() {
  const [inGoogleSignIn, setInGoogleSignIn] = useState<boolean>(false);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      try{
        (AppState as any).removeEventListener('change', handleAppStateChange);
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
        <Stack.Screen name="ChartExample" component={ChartExample} options={{ headerShown: true , title: "נתונים אישיים"}}/>
        <Stack.Screen name='StartQuestionnaire' component={StartQuestionnaire} options={{ headerShown: true , title: "שאלון התחלתי"}}/>
        <Stack.Screen name="DatesTimePicker" component={DatesTimePicker} options={{ headerShown: true , title: "נתונים אישיים"}}/>
        <Stack.Screen name="PersonalCharts" component={PersonalCharts} options={{ headerShown: true , title: "נתונים אישיים"}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
