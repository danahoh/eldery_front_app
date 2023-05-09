import  {LoginScreen } from './pages/LoginScreen';
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Questionnaire, AfterQuestionnaire } from './pages/questionnaire';
import React from 'react';


const Stack = createNativeStackNavigator();

function App()  {
    // <LoginScreen />
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='LoginScreen'>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="Questionnaire" component={Questionnaire} />
          <Stack.Screen name="AfterQuestionnaire" component={AfterQuestionnaire} />
        </Stack.Navigator>
      </NavigationContainer>
    );
}

export default App;