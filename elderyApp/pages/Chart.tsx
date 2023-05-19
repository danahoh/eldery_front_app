import React, { useState } from 'react';
import { View, Button, Image, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LineChart } from 'react-native-chart-kit';
import { NavigationProp } from '@react-navigation/native';
import { ParamList } from './types';
import DatesTimePicker from './DatesTimePicker';


type ChartExampleProps = {
  navigation: NavigationProp<ParamList, 'ChartExample'>;
};

const ChartExample: React.FC<ChartExampleProps> = ({ navigation }) => {
  const data = {
    labels: ['Jan', 'Feb', 'March', 'April', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  const Tab = createBottomTabNavigator();
  const [selectedButton, setSelectedButton] = useState('');

  const ChartScreen = () => (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity
            style={selectedButton === 'button1' ? styles.selectedButton : styles.button}
            onPress={() => setSelectedButton('button1')}
          >
            <Text style={selectedButton === 'button1' ? styles.selectedButtonText : styles.buttonText}>
              דיכאון
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity
            style={selectedButton === 'button3' ? styles.selectedButton : styles.button}
            onPress={() => setSelectedButton('button3')}
          >
            <Text style={selectedButton === 'button3' ? styles.selectedButtonText : styles.buttonText}>
              שינה
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity
            style={selectedButton === 'button4' ? styles.selectedButton : styles.button}
            onPress={() => setSelectedButton('button4')}
          >
            <Text style={selectedButton === 'button4' ? styles.selectedButtonText : styles.buttonText}>
              בדידות
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity
            style={selectedButton === 'button5' ? styles.selectedButton : styles.button}
            onPress={() => setSelectedButton('button5')}
          >
            <Text style={selectedButton === 'button5' ? styles.selectedButtonText : styles.buttonText}>
              מצב גופני
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LineChart
          data={data}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>
    </View>
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabelStyle: {
          fontSize: 26, 
        },
        tabBarStyle: { position: 'absolute', height: 85 },
      })}
    >
      <Tab.Screen
        name="סובייקטיבי"
        component={ChartScreen}
        options={{
        tabBarIcon: ({ color }) => (
            <Image
                source={require('../assets/icons/subjectiveIcon.png')} 
                style={{ width: 30, height: 40, tintColor: color }} 
            />
            ),
          headerTitle: 'נתונים סובייקטיבים',
          headerTitleStyle: {
            fontSize: 35,
            color: 'blue',
          },
          headerTitleAlign: 'center', // Align the header title in the center
          headerStyle: {
            backgroundColor: '#ffffff',
          },
        }}
      />
      <Tab.Screen
        name="אובייקטיבי"
        component={DatesTimePicker}
        options={{
        tabBarIcon: ({ color }) => (
            <Image
                source={require('../assets/icons/objectiveIcon.png')} 
                style={{ width: 30, height: 40, tintColor: color }} 
            />
            ),
          headerTitle: 'נתונים גופניים',
          headerTitleStyle: {
            fontSize: 35,
            color: 'blue',
          },
          headerTitleAlign: 'center', // Align the header title in the center
          headerStyle: {
            backgroundColor: '#ffffff',
          },
        }}
      />
    </Tab.Navigator>
  );
  
  
};

const styles = {
  chart: {
    marginVertical: 35,
    borderRadius: 40,
    width: '80%', 
    height: 500,
  },
  button: {
    width: 160,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    margin: 4,
  },
  selectedButton: {
    width: 160,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2196f3',
    borderRadius: 8,
    margin: 4,
  },
  buttonText: {
    fontSize: 30,
    color: '#000000',
  },
  selectedButtonText: {
    fontSize: 30,
    color: '#ffffff',
  },
};

export default ChartExample;
