import React from 'react';
import { View, Button, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LineChart } from 'react-native-chart-kit';
import { NavigationProp } from '@react-navigation/native';
import { ParamList } from './types';

type ChartExampleProps = {
  navigation: NavigationProp<ParamList, 'ChartExample'>;
};

const ChartExample: React.FC<ChartExampleProps> = ({ navigation }) => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  const Tab = createBottomTabNavigator();

  const ChartScreen = () => (
    <View>
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
        }}
      />
    </View>
  );

  const OtherScreen = () => (
    <View>
      {/* Add content for the other screen */}
    </View>
  );

  return (
    <Tab.Navigator
      tabBarOptions={{
        labelStyle: {
          fontSize: 16, // Change the font size
          fontWeight: 'bold', // Make the characters bold
        },
        tabStyle: {
          height: 100, // Change the height of the tabs
        },
      }}
    >
      <Tab.Screen
        name="סובייקטיבי"
        component={ChartScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/icons/subjectiveIcon.png')} // Replace with the actual path to the image icon
              style={{ width: 30, height: 40, tintColor: color }} // Adjust the width and height of the icon
            />
          ),
        }}
      />
      <Tab.Screen
        name="אובייקטיבי"
        component={OtherScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/icons/objectiveIcon.png')} // Replace with the actual path to the image icon
              style={{ width: 30, height: 40, tintColor: color }} // Adjust the width and height of the icon
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ChartExample;
