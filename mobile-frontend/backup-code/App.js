import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HeartScreen from './src/screens/HeartScreen';
import RemindersScreen from './src/screens/RemindersScreen';
import VisualizationScreen from './src/screens/VisualizationScreen';
import * as Notifications from 'expo-notifications';

const Tab = createBottomTabNavigator();

export default function App() {

  useEffect(() => {
    (async () => {
      await Notifications.requestPermissionsAsync();
    })();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false
      }),
    });
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Heart" component={HeartScreen} />
        <Tab.Screen name="Reminders" component={RemindersScreen} />
        <Tab.Screen name="Reports" component={VisualizationScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
