import React, {useEffect, useState} from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getReadings } from '../utils/localStorageUtil';

export default function VisualizationScreen() {

  const [daily, setDaily] = useState({labels:[],data:[]});

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const readings = await getReadings();
    const recent = readings.slice(-20);

    setDaily({
      labels: recent.map(r => new Date(r.timestamp).getHours().toString()),
      data: recent.map(r => r.hr)
    });
  };

  const width = Dimensions.get("window").width - 20;

  return (
    <ScrollView contentContainerStyle={{padding:20}}>
      <Text style={{fontSize:20,marginBottom:10}}>Daily Heart Rate Trend</Text>

      {daily.data.length > 0 ? (
        <LineChart
          data={{
            labels: daily.labels,
            datasets: [{ data: daily.data }]
          }}
          width={width}
          height={220}
          yAxisSuffix=" BPM"
          chartConfig={{
            backgroundGradientFrom:"#fff",
            backgroundGradientTo:"#fff",
            decimalPlaces:0,
            color:(opacity=1)=>`rgba(0,0,0,${opacity})`
          }}
          bezier
        />
      ) : (
        <Text>No data available yet</Text>
      )}
    </ScrollView>
  );
}
