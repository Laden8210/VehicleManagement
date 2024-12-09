import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminScreen from '../screens/AdminScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { MaterialIcons } from '@expo/vector-icons'; // Importing MaterialIcons for icons

const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Assigning the correct icon names
          if (route.name === 'Admin') {
            iconName = 'dashboard'; // MaterialIcons doesn't have 'dashboard-outline'
          } else if (route.name === 'Settings') {
            iconName = 'settings'; // MaterialIcons doesn't have 'settings-outline'
          }

          // Return the icon component
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato', // Color for active tabs
        tabBarInactiveTintColor: 'gray', // Color for inactive tabs
      })}
    >
      <Tab.Screen name="Admin" component={AdminScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
