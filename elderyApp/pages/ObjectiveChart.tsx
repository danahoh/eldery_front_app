import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { NavigationProp } from '@react-navigation/native';
import { ParamList } from './types';

type ObjectiveChartProps = {
  navigation: NavigationProp<ParamList, 'ObjectiveChartProps'>;
};

const ObjectiveChart: React.FC<ObjectiveChartProps> = ({ navigation, route }) => {
  const { startDate, endDate } = route.params;
  const [data, setData] = useState([]);
  const elderlyId = "4";
  console.log("start date is : ",startDate);
  console.log("end date is : ",endDate);

  useEffect(() => {
    axios
      .get(`http://10.0.2.2:3000/researcher/features/steps/${elderlyId}/${startDate}/${endDate}`)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  }, [startDate, endDate]);

  return (
    <View style={styles.container}>
      {data.length > 0 ? (
        <LineChart
          data={{
            labels: data.map(item => item.date),
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
        <Text>No data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    marginVertical: 25,
    borderRadius: 16,
  },
});

export default ObjectiveChart;
