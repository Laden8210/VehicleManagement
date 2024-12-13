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
    
        const response = await axios.post('https://samplesytems.shop/backend/user.php', {
          username,
          password,
        });

        console.log(response.data);

        if (response.data.success) {

          await AsyncStorage.setItem('userToken', 'dummy-token'); 
          await AsyncStorage.setItem('userId', 'dummy-user-id'); 
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
