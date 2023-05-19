import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationProp } from '@react-navigation/native';
import { ParamList } from './types';

type DatesTimePickerProps = {
  navigation: NavigationProp<ParamList, 'DateTimePicker'>;
};

const DatesTimePicker: React.FC<DatesTimePickerProps> = ({ navigation }) => {
  const [startDate, setStartDate] = useState(new Date().getTime());
  const [endDate, setEndDate] = useState(new Date().getTime());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    // Perform any necessary actions when start date or end date changes
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
  }, [startDate, endDate]);

  const handleStartDateChange = (_, selectedDate) => {
    const currentDate = selectedDate || startDate;
    const selectedTime = currentDate.getTime();
    setStartDate(selectedTime);
  
    // Disable dates in endDate picker smaller than the selected startDate
    if (endDate < selectedTime) {
      setEndDate(selectedTime);
    }
  
    setShowStartDatePicker(false);
  };
  

  const handleEndDateChange = (_, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate.getTime());
    setShowEndDatePicker(false);
  };

  const handleStartDatePress = () => {
    setShowStartDatePicker(true);
  };

  const handleEndDatePress = () => {
    setShowEndDatePicker(true);
  };

  const handleConfirmation = () => {
    navigation.navigate('ObjectiveChart', { startDate, endDate });
    // navigation.navigate('ObjectiveChart', { startDate, endDate });
  };

  const currentDate = new Date().getTime();

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Text style={styles.label}>הגדר תאריך התחלה:</Text>
        <Button title={new Date(startDate).toDateString()} onPress={handleStartDatePress} />
        {showStartDatePicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={new Date(startDate)}
            mode="date"
            maximumDate={currentDate}
            onChange={handleStartDateChange}
          />
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Text style={styles.label}>הגדר תאריך סיום:</Text>
        <Button title={new Date(endDate).toDateString()} onPress={handleEndDatePress} />
        {showEndDatePicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={new Date(endDate)}
            mode="date"
            maximumDate={currentDate}
            onChange={handleEndDateChange}
          />
        )}
      </View>
      <TouchableOpacity style={styles.okButton} onPress={handleConfirmation}>
        <Text style={styles.buttonText}>אישור</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    height: 50,
  },
  okButton: {
    width: 110,
    height: 80,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 30,
    color: 'white',
  },
});

export default DatesTimePicker;
