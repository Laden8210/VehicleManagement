import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import UserNavigator from './UserNavigator';

const Stack = createNativeStackNavigator();

const MainNavigator = ({ userId, setUserId }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userId === null ? (
        <Stack.Screen name="Auth">
          {() => <AuthNavigator setUserId={setUserId} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="User">
          {() => <UserNavigator userId={userId} setUserId={setUserId} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;
