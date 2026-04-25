import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getReminders, saveReminders } from '../utils/localStorageUtil';
import * as Notifications from 'expo-notifications';

export default function RemindersScreen() {

  const [reminders, setReminders] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    (async () => {
      setReminders(await getReminders());
    })();
  }, []);

  const addReminder = async () => {
    if (!text.trim()) return;

    const item = { id: Date.now().toString(), text };

    const updated = [item, ...reminders];
    setReminders(updated);
    await saveReminders(updated);

    setText("");

    Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder",
        body: item.text
      },
      trigger: { seconds: 5 } // demo
    });
  };

  const remove = async (id) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    await saveReminders(updated);
  };

  return (
    <View style={{padding:20}}>
      <Text style={styles.title}>Create a Reminder</Text>

      <TextInput
        placeholder="e.g. Take medicine"
        value={text}
        onChangeText={setText}
        style={styles.input}
      />

      <Button title="Add Reminder" onPress={addReminder} />

      <Text style={styles.subtitle}>Your Reminders</Text>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={styles.row}>
            <Text style={{flex:1}}>{item.text}</Text>
            <TouchableOpacity onPress={() => remove(item.id)}>
              <Text style={{color:'red'}}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title:{fontSize:20,marginBottom:10},
  input:{borderWidth:1,borderColor:"#ccc",padding:10,borderRadius:5,marginBottom:10},
  subtitle:{marginTop:20,fontSize:18},
  row:{flexDirection:'row',paddingVertical:10,borderBottomWidth:1,borderColor:'#eee'}
});
