import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationProp } from '@react-navigation/native';
import { ParamList } from './questionnaire';

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

  const startDateToPass = new Date(startDate).toISOString().slice(0, 10);
  const endDateToPass = new Date(endDate).toISOString().slice(0, 10);

  console.log("start date is : ", startDateToPass);
  console.log("end date is : ", endDateToPass);
  
  console.log("elderlyNum is : ", elderlyNum);

  const fetchData = async (buttonTitle: string, url: string) => {
    setSelectedButton(buttonTitle);
    try {
      const response = await axios.get<DataItem[]>(url);
      setData(response.data);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };
  
  interface CustomButtonProps {
    title: string;
    onPress: () => void;
    isSelected: boolean;
  }
  
  const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, isSelected }) => (
    <TouchableOpacity style={isSelected ? styles.selectedButton : styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
  
  
  useEffect(() => {
    fetchData('צעדים',`https://elderyresearch.cs.bgu.ac.il/researcher/features/steps/${elderlyNum}/${startDateToPass}/${endDateToPass}`);
  }, [startDate, endDate]);

  const clearData = () => {
      setData([]);
    };
  
  const Tab = createBottomTabNavigator();


  const ObjectiveScreen = () => (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <CustomButton title="צעדים" onPress={() => fetchData("צעדים",`https://elderyresearch.cs.bgu.ac.il/researcher/features/steps/${elderlyNum}/${startDateToPass}/${endDateToPass}`)} isSelected={selectedButton === 'צעדים'} />
        <CustomButton title="דופק" onPress={() => fetchData("דופק",`https://elderyresearch.cs.bgu.ac.il/researcher/features/hr/${elderlyNum}/${startDateToPass}/${endDateToPass}`)} isSelected={selectedButton === 'דופק'}/>
        <CustomButton title="דקות פעילות" onPress={() => fetchData("דקות פעילות",`https://elderyresearch.cs.bgu.ac.il/researcher/features/activeMinutes/${elderlyNum}/${startDateToPass}/${endDateToPass}`)} isSelected={selectedButton === 'דקות פעילות'}/>
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
             propsForLabels: {
              fontSize: 13, 
              fontWeight: 'bold',
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
        <CustomButton title="דיכאון" onPress={() => fetchData("דיכאון",`https://elderyresearch.cs.bgu.ac.il/researcher/features/depression/${elderlyNum}/${startDateToPass}/${endDateToPass}`)} isSelected={selectedButton === 'דיכאון'}/>
        <CustomButton title="שינה" onPress={() => fetchData("שינה",`https://elderyresearch.cs.bgu.ac.il/researcher/features/sleep/${elderlyNum}/${startDateToPass}/${endDateToPass}`)} isSelected={selectedButton === 'שינה'}/>
        <CustomButton title="בדידות" onPress={() => fetchData("בדידות",`https://elderyresearch.cs.bgu.ac.il/researcher/features/loneliness/${elderlyNum}/${startDateToPass}/${endDateToPass}`)} isSelected={selectedButton === 'בדידות'}/>
        <CustomButton title="מצב גופני" onPress={() => fetchData("מצב גופני",`https://elderyresearch.cs.bgu.ac.il/researcher/features/physicalCondition/${elderlyNum}/${startDateToPass}/${endDateToPass}`)} isSelected={selectedButton === 'מצב גופני'}/>
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
             propsForLabels: {
              fontSize: 13, 
              fontWeight: 'bold',
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
        listeners={{
          tabPress: e => {
            clearData();
            fetchData('צעדים',`https://elderyresearch.cs.bgu.ac.il/researcher/features/steps/${elderlyNum}/${startDateToPass}/${endDateToPass}`);
          },
        }}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/icons/objectiveIcon.png')}
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
        listeners={{
          tabPress: e => {
            clearData();
            fetchData("בדידות",`https://elderyresearch.cs.bgu.ac.il/researcher/features/loneliness/${elderlyNum}/${startDateToPass}/${endDateToPass}`);
          },
        }} 
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../assets/icons/subjectiveIcon.png')}
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
        borderWidth: 2,
        borderColor: 'black',
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
