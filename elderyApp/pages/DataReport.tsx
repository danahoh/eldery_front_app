/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 // eslint-disable-next-line prettier/prettier
 */

import React from 'react';
import {Button, View, StyleSheet} from 'react-native';

interface Props {
  navigation: any; // navigation prop passed from react-navigation
}

const DataReport: React.FC<Props> = ({}) => {
  const handleObjectiveDataPress = () => {
    // Handle objective data button press
  };

  const handleSubjectiveDataPress = () => {
    // Handle subjective data button press
  };

  return (
    <View style={styles.container}>
      <Button title="Objective Data" onPress={handleObjectiveDataPress} />
      <Button title="Subjective Data" onPress={handleSubjectiveDataPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DataReport;
