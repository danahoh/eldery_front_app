import React, { useEffect, useState } from 'react'
import { AppState,StyleSheet, Text, View, Image, TouchableOpacity, PermissionsAndroid } from 'react-native'
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { ParamList } from './questionnaire';
import ExitApp from 'react-native-exit-app';
import GoogleFit, { Scopes } from 'react-native-google-fit'
import axios from 'axios';


interface HomeProps {
  navigation: NavigationProp<ParamList>;
  // onInGoogleSignInUpdate: (inGoogleSignIn: boolean) => void;
}
export const HomeMenuView: React.FC<HomeProps> = ({ navigation, route }) => {
  const elderlyNum = route.params?.elderlyNum;

  const [notificationPersmission, setNotificationPermission] = useState(false)
  const requestNotificationsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Eldery App Notification Permission',
          message:
            'Need you to accept notifications ' +
            'so we׳ll send you reminders.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setNotificationPermission(true)
        console.log('You can send notification');
      } else {
        console.log('push notifications denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    !notificationPersmission && requestNotificationsPermission();
  },[])
  
  console.log("the elderlyNum in home",elderlyNum);// useEffect(() => {
//   const options = {
//     scopes: [
//       Scopes.FITNESS_ACTIVITY_READ,
//       Scopes.FITNESS_BODY_READ,
//       Scopes.FITNESS_HEART_RATE_READ,
//     ],
//   }
//   GoogleFit.authorize(options)
//     .then(authResult => {
//       if (authResult.success) {
//         console.log("AUTH_SUCCESS",authResult);
//         const opt = {
//           startDate: "2022-12-26T00:00:17.971Z", // required ISO8601Timestamp
//           endDate: new Date().toISOString(), // required ISO8601Timestamp
//           bucketUnit: "DAY", // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
//           bucketInterval: 1, // optional - default 1. 
//         };
        
//         GoogleFit.getDailyStepCountSamples(opt)
//          .then((res) => {
//              console.log('Daily steps >>> ', res)
//          })
//          .catch((err) => {console.warn(err)});
//          GoogleFit.getHeartRateSamples(opt)
//          .then((res) => {
//              console.log('HeartRate >>> ', res)
//          })
//          .catch((err) => {console.warn(err)});
        

//       } else {
//         console.log("AUTH_DENIED", authResult.message);
//       }
//     })
//     .catch((e) => {
//       console.log("AUTH_ERROR",e);
//     })
// },[])
  
  const[isDailyQuestionnaireDisabled, setDailyQuestionnaireDisabled] = useState(false)
  const[isStartQuestionnaireDisabled, setStartQuestionnaireDisabled] = useState(false)
  useFocusEffect(() => {
    disableStartQuestionnaire().then(shouldDisableStart => {
      setStartQuestionnaireDisabled(shouldDisableStart);
    })
    disableDailyQuestionnaire().then(shouldDisableDaily => {
      setDailyQuestionnaireDisabled(shouldDisableDaily);
    });
  })

  const disableDailyQuestionnaire = async () => {
    const currentDate = new Date()
    let latestDate = new Date()
    latestDate.setFullYear(1900)

    await axios.get(`https://elderyresearch.cs.bgu.ac.il/subjective/lastSubjectiveDate/${elderlyNum}`)
    .then(response => {
      latestDate = new Date(response.data.date)
      console.log("latestDate: ",latestDate);
    })
    .catch(error => {
      console.log('Error getting last date from db:', error);
    });
    if(currentDate.getFullYear() === latestDate.getFullYear() && currentDate.getMonth() === latestDate.getMonth() && currentDate.getDate() === latestDate.getDate()){
      return true
    }
    return false;
  }

  const disableStartQuestionnaire = async () => {
    let answered = false;
    await axios.get(`https://elderyresearch.cs.bgu.ac.il/elderly/answerFirstQues/${elderlyNum}`)
    .then(response => {
      answered = response.data.success
    })
    .catch(error => {
      console.log('Error getting response from db:', error);
      return false;
    });
    return answered;
  }


  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.menuBox, isStartQuestionnaireDisabled&& styles.disabledOverlay]} disabled={isStartQuestionnaireDisabled} onPress={() => navigation.navigate('StartQuestionnaire', { elderlyNum })}>
        <Image
          style={styles.icon}
          source={require('../assets/icons/startQuestionnaire.png')}
        />
        <Text style={styles.info}>שאלון התחלתי</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuBox, isDailyQuestionnaireDisabled && styles.disabledOverlay]} disabled={isDailyQuestionnaireDisabled}  onPress={() => navigation.navigate('Questionnaire', { elderlyNum })}>
        <Image
          style={styles.icon}
          source={require('../assets/icons/dailyQuestionnaire.png')}
        />
        <Text style={styles.info}>שאלון יומי</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBox} onPress={() => navigation.navigate('DatesTimePicker', { elderlyNum })}>
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
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
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
  },           
  disabledOverlay: {
    backgroundColor: 'gray',
    opacity: 0.5,
    borderRadius: 5,
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

