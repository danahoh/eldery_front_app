import AsyncStorage from '@react-native-async-storage/async-storage';

// for authentication persistence
export const SetCookie = async userData => {
  try {
    for (const [key, value] of Object.entries(userData)) {
      await AsyncStorage.setItem(key, value.toString());
    }
  } catch (e) {
    console.log(e);
  }
};

export const getCookie = async (field: string): Promise<any> => {
    return AsyncStorage.getItem(field);
}

 