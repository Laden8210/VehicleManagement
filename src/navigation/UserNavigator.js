import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, Ionicons } from '@expo/vector-icons'; // Importing icons
import UserScreen from '../screens/UserScreen';
import ProfileScreen from '../screens/ProfileScreen';
import dispatchesScreen from '../screens/dispatchesScreen';
import reminderScreen from '../screens/reminderScreen';
import repairrequestScreen from '../screens/repairrequestScreen';
import SettingsScreen from '../screens/repairrequestScreen';
import tripticketsScreen from '../screens/tripticketsScreen';
import maintenanceScreen from '../screens/maintenanceScreen';

const Tab = createBottomTabNavigator();

const UserNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-filled';
              return <MaterialIcons name={iconName} size={size} color={color} />;
            case 'Reminder':
              iconName = focused ? 'alarm' : 'alarm-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            case 'Dispatches':
              iconName = focused ? 'local-shipping' : 'local-shipping';
              return <MaterialIcons name={iconName} size={size} color={color} />;
            case 'Tickets':
              iconName = focused ? 'confirmation-number' : 'confirmation-number';
              return <MaterialIcons name={iconName} size={size} color={color} />;
            case 'Repair':
              iconName = focused ? 'build' : 'build';
              return <MaterialIcons name={iconName} size={size} color={color} />;
            case 'Maintenance':
              iconName = focused ? 'build-circle' : 'build-circle';
              return <MaterialIcons name={iconName} size={size} color={color} />;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              return <MaterialIcons name={iconName} size={size} color={color} />;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings';
              return <MaterialIcons name={iconName} size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={UserScreen} />
      <Tab.Screen name="Dispatches" component={dispatchesScreen} />
      <Tab.Screen name="Tickets" component={tripticketsScreen} />
      <Tab.Screen name="Repair" component={repairrequestScreen} />
      <Tab.Screen name="Maintenance" component={maintenanceScreen} />
      <Tab.Screen name="Reminder" component={reminderScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
     
    </Tab.Navigator>
  );
};

export default UserNavigator;
