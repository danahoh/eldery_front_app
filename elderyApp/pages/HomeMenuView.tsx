import React, { useEffect } from 'react'
import { AppState,StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { NavigationProp } from '@react-navigation/native';
import { ParamList } from './questionnaire';
import ExitApp from 'react-native-exit-app';
import GoogleFit, { Scopes } from 'react-native-google-fit'


interface HomeProps {
  navigation: NavigationProp<ParamList>;
  // onInGoogleSignInUpdate: (inGoogleSignIn: boolean) => void;
}
 export const HomeMenuView: React.FC<HomeProps> = ({navigation}) => {
// useEffect(() => {
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


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuBox}>
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

     {/* <TouchableOpacity style={styles.menuBox}>
        <Image
          style={styles.icon}
          source={{ uri: 'https://img.icons8.com/color/70/000000/product.png' }}
        />
        <Text style={styles.info}>Product</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBox}>
        <Image
          style={styles.icon}
          source={{ uri: 'https://img.icons8.com/color/70/000000/traffic-jam.png' }}
        />
        <Text style={styles.info}>Order</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBox}>
        <Image
          style={styles.icon}
          source={{ uri: 'https://img.icons8.com/dusk/70/000000/visual-game-boy.png' }}
        />
        <Text style={styles.info}>Info</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBox}>
        <Image
          style={styles.icon}
          source={{ uri: 'https://img.icons8.com/color/70/000000/user.png' }}
        />
        <Text style={styles.info}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBox}>
        <Image
          style={styles.icon}
          source={{ uri: 'https://img.icons8.com/color/70/000000/family.png' }}
        />
        <Text style={styles.info}>Friends</Text>
      </TouchableOpacity> */}
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

