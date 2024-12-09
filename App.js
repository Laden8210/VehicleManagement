import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [userId, setUserId] = useState(null);

  return (
    <NavigationContainer>
      <MainNavigator userId={userId} setUserId={setUserId} />
    </NavigationContainer>
  );
}
