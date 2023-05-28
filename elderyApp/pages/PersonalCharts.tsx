import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationProp } from '@react-navigation/native';
import { ParamList } from './types';

interface PersonalChartsProps {
  navigation: NavigationProp<ParamList, 'PersonalChartsProps'>;
}

interface DataItem {
  date: string;
  value: number;

}

const PersonalCharts: React.FC<PersonalChartsProps> = ({ navigation, route }) => {
  const [selectedButton, setSelectedButton] = useState('');
  const { startDate, endDate,elderlyNum } = route.params;
  const [data ,setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const startDateToPass = new Date(startDate).toISOString().slice(0, 10);
  const endDateToPass = new Date(endDate).toISOString().slice(0, 10);

  console.log("start date is : ", startDateToPass);
  console.log("end date is : ", endDateToPass);
  
  console.log("elderlyNum is : ", elderlyNum);

  const fetchData = (buttonTitle : string , url: string) => {
    setSelectedButton(buttonTitle);
    axios
      .get<DataItem[]>(url)
      .then(response => {
        setData(response.data);
        const values = data.map(item => item.value);
        minValue = Math.min(...values);
        maxValue = Math.max(...values);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  };
  const CustomButton = ({ title, onPress }) => (
    <TouchableOpacity style={selectedButton ? styles.selectedButton : styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
  );
  
  
  useEffect(() => {
    setIsLoading(true);
    // fetchData(`http://10.0.2.2:3000/researcher/features/loneliness/${elderlyNum}/${startDateToPass}/${endDateToPass}`);
  }, [startDate, endDate]);

  const Tab = createBottomTabNavigator();
                   const desiredYAxisValues = [1, 2, 3, 4, 5];


  const ObjectiveScreen = () => (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <CustomButton title="צעדים" onPress={() => fetchData("צעדים",`http://10.0.2.2:3000/researcher/features/activeMinutes/${elderlyNum}/${startDateToPass}/${endDateToPass}`)} />
        <CustomButton title="דופק" onPress={() => fetchData("דופק",`http://10.0.2.2:3000/researcher/features/hr/${elderlyNum}/${startDateToPass}/${endDateToPass}`)} />
        <CustomButton title="דקות פעילות" onPress={() => fetchData("דקות פעילות",`http://10.0.2.2:3000/researcher/features/activeMinutes/${elderlyNum}/${startDateToPass}/${endDateToPass}`)}/>
      </View>
      <View style={styles.chartContainer}>

        {data.length > 0 ? (
          console.log(data),

         <LineChart
         verticalLabelRotation={-40}
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
           height={250}
           chartConfig={{
             backgroundGradientFrom: '#ffffff',
             backgroundGradientTo: '#ffffff',
             decimalPlaces: 0, // Display integer values only
             color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
             style: {
               borderRadius: 16,
             },
             propsForDots: {
               r: '6',
               strokeWidth: '2',
               stroke: '#ffa726',
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

  const SubjectiveScreen = () => (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <CustomButton title="דיכאון" onPress={() => fetchData("דיכאון",`http://10.0.2.2:3000/researcher/features/depression/${elderlyNum}/${startDateToPass}/${endDateToPass}`)}/>
        <CustomButton title="שינה" onPress={() => fetchData("שינה",`http://10.0.2.2:3000/researcher/features/sleep/${elderlyNum}/${startDateToPass}/${endDateToPass}`)} />
        <CustomButton title="בדידות" onPress={() => fetchData("בדידות",`http://10.0.2.2:3000/researcher/features/loneliness/${elderlyNum}/${startDateToPass}/${endDateToPass}`)}/>
        <CustomButton title="מצב גופני" onPress={() => fetchData("מצב גופני",`http://10.0.2.2:3000/researcher/features/physicalCondition/${elderlyNum}/${startDateToPass}/${endDateToPass}`)} />
      </View>
      <View style={styles.chartContainer}>

        {data.length > 0 ? (
          console.log(data),

         <LineChart
         verticalLabelRotation={-40}
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
           height={250}
           chartConfig={{
             backgroundGradientFrom: '#ffffff',
             backgroundGradientTo: '#ffffff',
             decimalPlaces: 0, // Display integer values only
             color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
             style: {
               borderRadius: 16,
             },
             propsForDots: {
               r: '6',
               strokeWidth: '2',
               stroke: '#ffa726',
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
        name="אובייקטיבים"
        component={ObjectiveScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/icons/subjectiveIcon.png')}
              style={{ width: 30, height: 40, tintColor: color }}
            />
          ),
          headerTitle: 'אובייקטיבים',
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
        name="סובייקטיבים"
        component={SubjectiveScreen}        
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/icons/objectiveIcon.png')}
              style={{ width: 30, height: 40, tintColor: color }}
            />
          ),
          headerTitle: 'סובייקטיבים',
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
        backgroundColor: '#add8e6',
        borderRadius: 8,
        margin: 10,
      },
      buttonText: {
        fontSize: 20,
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
  
  chartContainer: {
    flex: 1,
  },
  chart: {
    marginVertical: 35,
    borderRadius: 30,
    width: '60%', 
    height: 500,
  },
});

export default PersonalCharts;
