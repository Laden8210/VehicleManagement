import React, { useState } from 'react';
import { View, Button, TextInput, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (username && password) {
      try {
        // Send login request to your backend API
        const response = await axios.post('https://samplesytems.shop/backend/user.php', {
          username,
          password,
        });

        console.log(response.data); // Check response structure

        if (response.data.success) {
          // Save user data or token in AsyncStorage for session management
          await AsyncStorage.setItem('userToken', 'dummy-token'); // replace with actual token
          await AsyncStorage.setItem('userId', 'dummy-user-id'); // replace with actual user ID

          // Navigate to ProfileScreen after successful login
          navigation.replace('ProfileScreen');
        } else {
          Alert.alert('Login Failed', 'Incorrect username or password');
        }
      } catch (error) {
        console.error('Login failed', error);
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      }
    } else {
      Alert.alert('Input Error', 'Please fill in both username and password.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 5 },
});

export default LoginScreen;
