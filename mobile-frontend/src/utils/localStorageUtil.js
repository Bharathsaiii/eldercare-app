// src/utils/localStorageUtil.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const READINGS_KEY = 'ELDERCARE_READINGS_V1';
const REMINDERS_KEY = 'ELDERCARE_REMINDERS_V1';

export async function saveReading(reading) {
  try {
    const raw = await AsyncStorage.getItem(READINGS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(reading);
    const trimmed = arr.slice(-500);
    await AsyncStorage.setItem(READINGS_KEY, JSON.stringify(trimmed));
    return true;
  } catch (e) {
    console.warn('saveReading error', e);
    return false;
  }
}

export async function getReadings() {
  try {
    const raw = await AsyncStorage.getItem(READINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('getReadings error', e);
    return [];
  }
}

export async function saveReminder(reminder) {
  try {
    const raw = await AsyncStorage.getItem(REMINDERS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(reminder);
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(arr));
    return true;
  } catch (e) {
    console.warn('saveReminder error', e);
    return false;
  }
}

export async function getReminders() {
  try {
    const raw = await AsyncStorage.getItem(REMINDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('getReminders error', e);
    return [];
  }
}
