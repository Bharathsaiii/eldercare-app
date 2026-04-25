// src/screens/RemindersScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper: format time (ms or Date)
function formatTime(msOrDate) {
  if (!msOrDate) return '';
  const d = typeof msOrDate === 'number' ? new Date(msOrDate) : new Date(msOrDate);
  const h = d.getHours();
  const m = d.getMinutes();
  const hh = h % 12 === 0 ? 12 : h % 12;
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${String(hh).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}

// simple id
const makeId = () => Math.random().toString(36).slice(2, 9);

export default function RemindersScreen() {
  const [name, setName] = useState('User');
  const [medicine, setMedicine] = useState('');
  const [time, setTime] = useState(null);
  const [repeatDaily, setRepeatDaily] = useState(true);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [list, setList] = useState([]);

  // load reminders from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('ELDERCARE_REMINDERS_V1');
        const items = raw ? JSON.parse(raw) : [];
        setList(items || []);
      } catch (e) {
        console.warn('load reminders', e);
      }
    })();
  }, []);

  // add reminder: schedule notification + save
  async function addReminder() {
    if (!medicine.trim()) {
      Alert.alert('Please enter medicine name');
      return;
    }
    if (!time) {
      Alert.alert('Please pick a time');
      return;
    }

    const id = makeId();
    const title = `Hi ${name || 'User'}`;
    const body = `It's time to take your medicine: ${medicine}`;

    const hour = time.getHours();
    const minute = time.getMinutes();
    const trigger = { hour, minute, repeats: !!repeatDaily };

    let notificationId = null;
    try {
      notificationId = await Notifications.scheduleNotificationAsync({
        content: { title, body },
        trigger,
      });
    } catch (err) {
      console.warn('scheduleNotification failed', err);
    }

    const reminder = {
      id,
      medicine: medicine.trim(),
      time: time.getTime(),
      repeatDaily: !!repeatDaily,
      notificationId,
    };

    try {
      const raw = await AsyncStorage.getItem('ELDERCARE_REMINDERS_V1');
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(reminder);
      await AsyncStorage.setItem('ELDERCARE_REMINDERS_V1', JSON.stringify(arr));
      setList(arr);
      setMedicine('');
      setTime(null);
      setRepeatDaily(true);
      Alert.alert('Reminder set', `We will remind you at ${formatTime(reminder.time)}`);
    } catch (e) {
      console.warn('saveReminder failed', e);
      Alert.alert('Error', 'Could not save reminder');
    }
  }

  // remove reminder and cancel scheduled notification
  async function removeReminder(rem) {
    try {
      if (rem.notificationId) {
        try {
          await Notifications.cancelScheduledNotificationAsync(rem.notificationId);
        } catch (err) {
           console.warn('error in RemindersScreen:', err);
        }
      }
      const filtered = list.filter(r => r.id !== rem.id);
      setList(filtered);
      await AsyncStorage.setItem('ELDERCARE_REMINDERS_V1', JSON.stringify(filtered));
      Alert.alert('Reminder removed');
    } catch (err) {
      console.warn('removeReminder', err);
      Alert.alert('Error', 'Could not remove reminder');
    }
  }

  // render a reminder card
  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.medicine}</Text>
          <Text style={styles.cardTime}>{formatTime(item.time)}</Text>
          <Text style={styles.cardRepeat}>{item.repeatDaily ? 'Repeats daily' : 'One-time'}</Text>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              Alert.alert(
                'Delete reminder',
                `Remove reminder for ${item.medicine} at ${formatTime(item.time)}?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Remove', style: 'destructive', onPress: () => removeReminder(item) },
                ],
              );
            }}
          >
            <Text style={styles.actionText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Hi, <Text style={{ fontWeight: '700' }}>{name || 'User'}</Text>
      </Text>
      <Text style={styles.sub}>Set medicine reminders — we will notify you on time.</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Your name</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Enter your name" style={styles.input} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Medicine name</Text>
        <TextInput
          value={medicine}
          onChangeText={setMedicine}
          placeholder="E.g. Paracetamol 500mg"
          style={styles.input}
        />

        <View style={styles.row}>
          <TouchableOpacity style={styles.timeBtn} onPress={() => setPickerVisible(true)}>
            <Text style={styles.timeBtnText}>{time ? formatTime(time) : 'Pick time'}</Text>
          </TouchableOpacity>

          <View style={styles.repeat}>
            <Text style={{ marginRight: 8 }}>Repeat daily</Text>
            <Switch value={repeatDaily} onValueChange={setRepeatDaily} />
          </View>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={addReminder}>
          <Text style={styles.addBtnText}>Add Reminder</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.listHeading}>Upcoming reminders</Text>

      <FlatList
        data={list}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ color: '#666' }}>No reminders. Add one above.</Text>}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="time"
        date={time || new Date()}
        onConfirm={dt => {
          setPickerVisible(false);
          setTime(dt);
        }}
        onCancel={() => setPickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  greeting: { fontSize: 20, marginTop: 6, marginBottom: 2 },
  sub: { color: '#666', marginBottom: 12 },
  section: { marginBottom: 16 },
  label: { color: '#444', marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#e6e6e6', padding: 10, borderRadius: 10, backgroundColor: '#fafafa' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between' },
  timeBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#e1f0ff',
    alignItems: 'center',
  },
  timeBtnText: { color: '#0b67a6', fontWeight: '600' },
  repeat: { flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
  addBtn: { marginTop: 12, backgroundColor: '#0b67a6', padding: 12, borderRadius: 10, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: '700' },
  listHeading: { marginTop: 8, fontWeight: '700', marginBottom: 8 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardTime: { color: '#333', marginTop: 4 },
  cardRepeat: { color: '#666', marginTop: 4, fontSize: 12 },
  cardActions: { marginLeft: 12 },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  actionText: { color: '#d32f2f', fontWeight: '700' },
});
