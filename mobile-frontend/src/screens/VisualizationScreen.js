import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const width = Dimensions.get('window').width;

export default function VisualizationScreen() {

  // 🔁 Toggle state
  const [mode, setMode] = useState('weekly');

  // 📊 DATA
  const weeklyData = [80, 90, 100, 110, 120, 95, 85];
  const monthlyData = [85, 88, 92, 100, 110, 120, 115, 105, 98, 90, 95, 100];

  const data = mode === 'weekly' ? weeklyData : monthlyData;

  const labels =
    mode === 'weekly'
      ? ['1','2','3','4','5','6','7']
      : ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'];

  // 🔢 CALCULATIONS
  const avg = Math.round(data.reduce((a, b) => a + b, 0) / data.length);
  const min = Math.min(...data);
  const max = Math.max(...data);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>

        {/* 🔥 TITLE */}
        <Text style={styles.mainTitle}>Health Report</Text>
        <Text style={styles.title}>Vitals Overview</Text>

        {/* 🔁 TOGGLE */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'weekly' && styles.activeBtn]}
            onPress={() => setMode('weekly')}
          >
            <Text style={[styles.toggleText, mode === 'weekly' && styles.activeText]}>
              Weekly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'monthly' && styles.activeBtn]}
            onPress={() => setMode('monthly')}
          >
            <Text style={[styles.toggleText, mode === 'monthly' && styles.activeText]}>
              Monthly
            </Text>
          </TouchableOpacity>
        </View>

        {/* 📈 GRAPH */}
        <LineChart
          data={{
            labels,
            datasets: [{ data }]
          }}
          width={width - 20}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: () => '#ff2d55',
            labelColor: () => '#999',
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#ff2d55'
            }
          }}
          bezier
          style={styles.chart}
        />

        {/* 🔢 STATS */}
        <View style={styles.statsRow}>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Avg</Text>
            <Text style={styles.statValue}>{avg}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Min</Text>
            <Text style={styles.statValue}>{min}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Max</Text>
            <Text style={styles.statValue}>{max}</Text>
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },

  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5
  },

  title: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10
  },

  // 🔁 Toggle
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 15
  },

  toggleBtn: {
    marginRight: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#eee'
  },

  activeBtn: {
    backgroundColor: '#ff2d55'
  },

  toggleText: {
    color: '#555'
  },

  activeText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  // 📈 Chart
  chart: {
    borderRadius: 12
  },

  // 🔢 Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },

  statBox: {
    width: '30%',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center'
  },

  statLabel: {
    color: 'gray',
    fontSize: 12
  },

  statValue: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});