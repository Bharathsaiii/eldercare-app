import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveReading = async (reading) => {
  try {
    const raw = await AsyncStorage.getItem('readings');
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(reading);
    await AsyncStorage.setItem('readings', JSON.stringify(arr));
  } catch (e) {
    console.error(e);
  }
};

export const getReadings = async () => {
  try {
    const raw = await AsyncStorage.getItem('readings');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveReminders = async (reminders) => {
  await AsyncStorage.setItem('reminders', JSON.stringify(reminders));
};

export const getReminders = async () => {
  const raw = await AsyncStorage.getItem('reminders');
  return raw ? JSON.parse(raw) : [];
};
