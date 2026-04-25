import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native';
import mockSensor from '../utils/mockSensor';

export default function HeartScreen() {
  const [hr, setHr] = useState(0);
  const [spo2, setSpo2] = useState(0);
  const [temp, setTemp] = useState(0);

  const [aiData, setAiData] = useState({
    risk: "Loading...",
    recommendation: "Analyzing...",
    summary: ""
  });

  const [lastAlert, setLastAlert] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const BASE_URL = "http://10.0.2.2:8000";

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  // ❤️ animation
  useEffect(() => {
    if (hr) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, { toValue: 1.1, duration: 300, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [hr]);

  // 📡 sensor
  useEffect(() => {
    mockSensor.start();

    const unsub = mockSensor.on((reading) => {
      setHr(reading.hr);
      setSpo2(reading.spo2);
      setTemp(reading.temp);
    });

    return () => {
      unsub();
      mockSensor.stop();
    };
  }, []);

  // 🤖 AI + ALERT
  useEffect(() => {
    if (!hr) return;

    const fetchAI = async () => {
      try {
        const res = await fetch(`${BASE_URL}/ai-analysis`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hr, spo2, temp }),
        });

        const data = await res.json();

        setAiData({
          risk: data.risk || "LOW",
          recommendation: data.recommendation || "",
          summary: data.summary || ""
        });

        const now = Date.now();

        const isDanger =
          data.risk === "HIGH" ||
          hr > 110 ||
          spo2 < 92 ||
          temp > 38;

        if (isDanger && now - lastAlert > 30000) {
          setLastAlert(now);

          await Notifications.scheduleNotificationAsync({
            content: {
              title: "🚨 Health Alert",
              body: `HR:${hr} SpO2:${spo2} Temp:${temp}`,
            },
            trigger: null,
          });
        }

      } catch {
        setAiData({
          risk: "ERROR",
          recommendation: "Backend not reachable",
          summary: "Check backend"
        });
      }
    };

    const timer = setTimeout(fetchAI, 1500);
    return () => clearTimeout(timer);

  }, [hr]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>

        <Text style={styles.title}>ElderCare</Text>

        <View style={styles.card}>
          <Animated.Text style={[styles.heart, { transform: [{ scale: scaleAnim }] }]}>
            ❤️
          </Animated.Text>
          <Text style={styles.hr}>{hr} BPM</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.smallCard}>
            <Text>SpO2🫁</Text>
            <Text>{spo2}%</Text>
          </View>

          <View style={styles.smallCard}>
            <Text>Temp🌡️</Text>
            <Text>{temp}°C</Text>
          </View>
        </View>

        <View style={styles.aiBox}>
          <Text style={styles.aiTitle}>AI Insights🤖</Text>
          <Text style={{
            color:
              aiData.risk === "HIGH" ? "red" :
              aiData.risk === "MEDIUM" ? "orange" :
              "green"
          }}>
            Risk: {aiData.risk}
          </Text>
          <Text>{aiData.summary}</Text>
        </View>

        <View style={styles.recoBox}>
          <Text style={styles.aiTitle}>Recommendation💡</Text>
          <Text>{aiData.recommendation}</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 20 },

  title: { fontSize: 22, fontWeight: 'bold' },

  card: {
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 3,
  },

  heart: { fontSize: 80 },
  hr: { fontSize: 40, fontWeight: 'bold' },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },

  smallCard: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
    alignItems: 'center'
  },

  aiBox: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#e3f2fd'
  },

  recoBox: {
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff3e0'
  }
});