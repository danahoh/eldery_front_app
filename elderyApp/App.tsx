import React, { useState, useEffect } from 'react';
import { AppState, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './pages/LoginScreen';
import { Questionnaire, AfterQuestionnaire } from './pages/questionnaire';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {HomeMenuView } from './pages/HomeMenuView';

const Stack = createNativeStackNavigator();

export default function App() {
  const [inGoogleSignIn, setInGoogleSignIn] = useState<boolean>(false);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

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
    headerShown: false
  }}>
      <Stack.Screen 
  name="LoginScreen" 
  initialParams={{ inGoogleSignIn }}
  // options={{ headerShown: false }}
>
  {(props) => <LoginScreen {...props} onInGoogleSignInUpdate={handleInGoogleSignInUpdate} />}
</Stack.Screen>
        <Stack.Screen name="HomeMenuView" component={HomeMenuView}/>
        <Stack.Screen name="Questionnaire" component={Questionnaire} />
        <Stack.Screen name="AfterQuestionnaire" component={AfterQuestionnaire} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
