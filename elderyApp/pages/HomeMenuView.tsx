import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { NavigationProp } from '@react-navigation/native';
import { ParamList } from './questionnaire';

interface HomeProps {
  navigation: NavigationProp<ParamList>;
  // onInGoogleSignInUpdate: (inGoogleSignIn: boolean) => void;
}
 export const HomeMenuView: React.FC<HomeProps> = ({navigation}) => {

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

      <TouchableOpacity style={styles.menuBox}>
        <Image
          style={styles.icon}
          source={require('../assets/icons/personalInfo.png')}
        />
        <Text style={styles.info}>הצגת נתונים אישיים</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBox}>
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

