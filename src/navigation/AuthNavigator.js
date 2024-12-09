import React, { useState } from 'react';
import { View, Button, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const AuthNavigator = ({ setUserId }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (username && password) {
      try {
        const response = await axios.post('https://samplesytems.shop/backend/user.php', {
          username,
          password,
        });

        if (response.data.success) {
          setUserId(response.data.userId); // Set the userId after login
          Alert.alert('Login Successful', 'You are logged in');
        } else {
          Alert.alert('Login Failed', 'Incorrect username or password');
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong. Please try again.');
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

export default AuthNavigator;
