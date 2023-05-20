import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationProp } from '@react-navigation/native';
import { ParamList } from './types';
import ChartExample from './Chart';

interface ObjectiveChartProps {
  navigation: NavigationProp<ParamList, 'ObjectiveChartProps'>;
}

interface DataItem {
  date: string;
  value: number;
}

const ObjectiveChart: React.FC<ObjectiveChartProps> = ({ navigation, route }) => {
  const { startDate, endDate } = route.params;
  const [data, setData] = useState<DataItem[]>([]);
  const elderlyId = "4";
  const startDateToPass = new Date(startDate).toISOString().slice(0, 10);
  const endDateToPass = new Date(endDate).toISOString().slice(0, 10);

  console.log("start date is : ", startDateToPass);
  console.log("end date is : ", endDateToPass);

  const fetchData = (url: string) => {
    axios
      .get<DataItem[]>(url)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  };
  const CustomButton = ({ title, onPress }) => (
    <TouchableOpacity style={styles.selectedButton} onPress={onPress}>
      <Text style={styles.selectedButtonText}>{title}</Text>
    </TouchableOpacity>
  );
  
  
  useEffect(() => {
    // Fetch initial data
    fetchData(`http://10.0.2.2:3000/researcher/features/steps/${elderlyId}/${startDateToPass}/${endDateToPass}`);
  }, [startDate, endDate]);

  const Tab = createBottomTabNavigator();

  const ChartScreen = () => (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <CustomButton title="דיכאון" onPress={() => fetchData(`http://10.0.2.2:3000/researcher/features/depression/${elderlyId}/${startDateToPass}/${endDateToPass}`)} />
        <CustomButton title="שינה" onPress={() => fetchData(`http://10.0.2.2:3000/researcher/features/sleep/${elderlyId}/${startDateToPass}/${endDateToPass}`)} />
        <CustomButton title="בדידות" onPress={() => fetchData(`http://10.0.2.2:3000/researcher/features/loneliness/${elderlyId}/${startDateToPass}/${endDateToPass}`)} />
        <CustomButton title="מצב גופני" onPress={() => fetchData(`http://10.0.2.2:3000/researcher/features/physicalCondition/${elderlyId}/${startDateToPass}/${endDateToPass}`)} />
      </View>
      <View style={styles.chartContainer}>
        {data.length > 0 ? (
          <LineChart
            data={{
              labels: data.map(item => {
                const date = new Date(item.date);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();

                return `${day}.${month}.${year}`;
              }),
              datasets: [
                {
                  data: data.map(item => item.value),
                },
              ],
            }}
            width={400}
            height={300}
            chartConfig={{
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
        ) : (
        <Text style={{ fontSize: 35 , color: 'black' }}>אין מידע זמין עבור התאריכים הנבחרים</Text>
        )}
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
        name="סובייקטיבים"
        component={ChartScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/icons/subjectiveIcon.png')}
              style={{ width: 30, height: 40, tintColor: color }}
            />
          ),
          headerTitle: 'נתונים אובייקטיביים',
          headerTitleStyle: {
            fontSize: 35,
            color: 'blue',
          },
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
        }}
      />
      <Tab.Screen
        name="אובייקטיבים"
        component={ChartExample}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/icons/objectiveIcon.png')}
              style={{ width: 30, height: 40, tintColor: color }}
            />
          ),
          headerTitle: 'מידע נוסף',
          headerTitleStyle: {
            fontSize: 35,
            color: 'blue',
          },
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 70,
      },
      button: {
        width: 140,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',
        borderRadius: 8,
        margin: 10,
      },
      buttonText: {
        fontSize: 30,
        color: 'black',
      },
      selectedButton: {
        width: 140,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2196f3',
        borderRadius: 8,
        margin: 10,
      },
      selectedButtonText: {
        fontSize: 30,
        color: '#ffffff',
      },
  
  chartContainer: {
    flex: 1,
  },
  chart: {
    marginVertical: 25,
    borderRadius: 16,
  },
});

export default ObjectiveChart;
