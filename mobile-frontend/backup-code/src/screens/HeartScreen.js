import React, {useEffect, useState, useRef} from 'react';
import { View, Text, Button, Vibration, Alert, StyleSheet } from 'react-native';
import { startMockSensor, onHeartRate } from '../utils/mockSensor';
import { saveReading } from '../utils/localStorageUtil';
import * as Notifications from 'expo-notifications';

const SAFE_LIMIT = 110;

export default function HeartScreen() {
  const [hr, setHr] = useState(null);
  const stopRef = useRef(null);

  useEffect(() => {
    stopRef.current = startMockSensor();

    const unsubscribe = onHeartRate(async (reading) => {
      setHr(reading.hr);
      await saveReading(reading);

      if (reading.hr > SAFE_LIMIT) triggerAlert(reading.hr);
    });

    return () => {
      if (stopRef.current) stopRef.current();
      unsubscribe();
    };
  }, []);

  const triggerAlert = (value) => {
    Vibration.vibrate([500, 300, 500]);

    Notifications.scheduleNotificationAsync({
      content: {
        title: "High Heart Rate Alert!",
        body: `Heart rate ${value} BPM exceeded safe limit.`,
      },
      trigger: null,
    });

    Alert.alert("Alert", `Heart Rate ${value} BPM detected. Guardian will be notified.`);
  };

  const measureNow = () => {
    const simulated = Math.floor(55 + Math.random() * 90);
    setHr(simulated);
    const reading = { hr: simulated, timestamp: Date.now() };
    saveReading(reading);

    if (simulated > SAFE_LIMIT) triggerAlert(simulated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Heart Rate</Text>
      <Text style={styles.rate}>{hr ? `${hr} BPM` : "--"}</Text>
      <Button title="Measure Now (simulate)" onPress={measureNow} />
      <Text style={styles.note}>Safe Limit: {SAFE_LIMIT} BPM</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',alignItems:'center'},
  title:{fontSize:22,marginBottom:15},
  rate:{fontSize:50,fontWeight:'bold',marginBottom:20},
  note:{marginTop:20,color:'#555'}
});
