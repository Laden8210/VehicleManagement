import React from 'react';
import { View, Text, Button, Alert, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Remove user session data from AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');

      // Close the app
      BackHandler.exitApp();

      // Optionally, you can navigate to the Login screen before closing the app
      // This line is optional because `exitApp()` will close the app immediately
      // navigation.replace('LoginScreen');

    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Something went wrong while logging out. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default ProfileScreen;
