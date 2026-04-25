import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HeartScreen from './src/screens/HeartScreen';
import RemindersScreen from './src/screens/RemindersScreen';
import VisualizationScreen from './src/screens/VisualizationScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


// 🔥 TAB NAVIGATOR (WITH ICONS + CLEAN UI)
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // ❌ removes top "Heart"
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },

        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Heart') iconName = 'heart';
          else if (route.name === 'Reminders') iconName = 'notifications';
          else if (route.name === 'Reports') iconName = 'bar-chart';
          else if (route.name === 'Profile') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Heart" component={HeartScreen} />
      <Tab.Screen name="Reminders" component={RemindersScreen} />
      <Tab.Screen name="Reports" component={VisualizationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}


// 🔥 MAIN APP
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {/* Login first */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Main App after login */}
        <Stack.Screen name="Main" component={TabNavigator} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}