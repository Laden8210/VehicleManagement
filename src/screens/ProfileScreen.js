import React from 'react';
import { View, Button, Alert, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {

      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');


      BackHandler.exitApp();

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
