import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [user, setUser] = useState({
    name: '',
    age: '',
    weight: '',
    condition: '',
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const data = await AsyncStorage.getItem('user');
    if (data) {
      setUser(JSON.parse(data));
    }
  };

  const saveUser = async () => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    setEditMode(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>

        <Text style={styles.title}>👤 Patient Profile</Text>

        {/* 🟦 SINGLE CARD */}
        <View style={styles.card}>

          {/* NAME */}
          <Text style={styles.label}>Name</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={user.name}
              onChangeText={(t) => setUser({ ...user, name: t })}
            />
          ) : (
            <Text style={styles.value}>{user.name || '-'}</Text>
          )}

          {/* AGE */}
          <Text style={styles.label}>Age</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={user.age}
              keyboardType="numeric"
              onChangeText={(t) => setUser({ ...user, age: t })}
            />
          ) : (
            <Text style={styles.value}>{user.age || '-'}</Text>
          )}

          {/* WEIGHT */}
          <Text style={styles.label}>Weight</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={user.weight}
              keyboardType="numeric"
              onChangeText={(t) => setUser({ ...user, weight: t })}
            />
          ) : (
            <Text style={styles.value}>
              {user.weight ? `${user.weight} kg` : '-'}
            </Text>
          )}

          {/* CONDITION */}
          <Text style={styles.label}>Condition</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={user.condition}
              onChangeText={(t) => setUser({ ...user, condition: t })}
              placeholder="Medical Conditions"
            />
          ) : (
            <Text style={styles.value}>{user.condition || 'None'}</Text>
          )}

          {/* BUTTON */}
          <TouchableOpacity
            style={styles.btn}
            onPress={editMode ? saveUser : () => setEditMode(true)}
          >
            <Text style={styles.btnText}>
              {editMode ? 'Save Changes' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>

        </View>

        {/* 🧠 HEALTH TIPS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🧠 Health Tips</Text>

          <Text style={styles.tip}>• Drink at least 2–3L water daily 💧</Text>
          <Text style={styles.tip}>• Maintain stable heart rate ❤️</Text>
          <Text style={styles.tip}>• Take medicines on time 💊</Text>
          <Text style={styles.tip}>• Regularly monitor vitals 📊</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  label: {
    fontSize: 12,
    color: 'gray',
    marginTop: 10,
  },

  value: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },

  btn: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },

  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },

  tip: {
    fontSize: 13,
    marginBottom: 5,
  },
});