import React from 'react'
import { AppState,StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { NavigationProp } from '@react-navigation/native';
import { ParamList } from './questionnaire';
import ExitApp from 'react-native-exit-app';

interface HomeProps {
  navigation: NavigationProp<ParamList>;
  // onInGoogleSignInUpdate: (inGoogleSignIn: boolean) => void;
}
 export const HomeMenuView: React.FC<HomeProps> = ({navigation}) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuBox} onPress={() => navigation.navigate('StartQuestionnaire')}>
        <Image
          style={styles.icon}
          source={require('../assets/icons/startQuestionnaire.png')}
        />
        <Text style={styles.info}>שאלון התחלתי</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBox} onPress={() => navigation.navigate('Questionnaire')}>
        <Image
          style={styles.icon}
          source={require('../assets/icons/dailyQuestionnaire.png')}
        />
        <Text style={styles.info}>שאלון יומי</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBox} onPress={() => navigation.navigate('ChartExample')}>
        <Image
          style={styles.icon}
          source={require('../assets/icons/personalInfo.png')}
        />
        <Text style={styles.info}>הצגת נתונים אישיים</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBox} onPress={() => {
  // Close the app
  ExitApp.exitApp();
}}>
        <Image
          style={styles.icon}
          source={require('../assets/icons/signOut.png')}
        />
        <Text style={styles.info}>התנתקות מהמערכת</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: 40,
    flexDirection: 'column',
    // flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // backgroundColor: 'red',
    height: '100%',
  },
  menuBox: {
    backgroundColor:'#add8e6',
    width: '90%',
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderRadius: 8,
    borderColor: 'black',
    borderWidth: 2
    // alignSelf: 'center'


  },
  icon: {
    width: 100,
    height: 100,
  },
  info: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold'
  },
})

