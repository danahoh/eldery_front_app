import React from 'react';
import { AppState, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { LoginScreen } from './pages/LoginScreen';
import { Questionnaire, AfterQuestionnaire } from './pages/questionnaire';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { LoginScreen } from './pages/LoginScreen';

const Stack = createNativeStackNavigator();

interface IAppState {
  inGoogleSignin: boolean;
}

class App extends React.Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      inGoogleSignin: false,
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    (AppState as any).removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState: string) => {
    if (nextAppState === 'inactive') {
      console.log('--------------inactive------------------');
      GoogleSignin.signOut();
      this.setState({ inGoogleSignin: false });
      console.log('App is closing');
    }
  };

  handleGoogleSignin = () => {
    this.setState({ inGoogleSignin: true });
    // code for Google signin
  };

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='LoginScreen'>
          <Stack.Screen name="LoginScreen">
            {(props) => <LoginScreen {...props} inGoogleSignin={this.state.inGoogleSignin} handleGoogleSignin={this.handleGoogleSignin} />}
          </Stack.Screen>
          <Stack.Screen name="Questionnaire" component={Questionnaire} />
          <Stack.Screen name="AfterQuestionnaire" component={AfterQuestionnaire} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;