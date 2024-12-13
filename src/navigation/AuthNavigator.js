import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, StyleSheet, Alert, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import { Ionicons } from '@expo/vector-icons';  // Icon library

const AuthNavigator = ({ setUserId }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);  // State for password visibility

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setIsLoggedIn(true); 
          const response = await fetch(`${BASE_URL}user`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setUserId(data.id); 
          } else {
            await AsyncStorage.removeItem('userToken');
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();  
  }, []);  

  useEffect(() => {
    if (isLoggedIn) {
      Alert.alert('Already Logged In', 'You are already logged in!');
    }
  }, [isLoggedIn]);  

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Input Error', 'Please fill in both username and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(username)) {
      Alert.alert('Input Error', 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });

      if (!response.ok) {
        setIsLoading(false);
        if (response.status === 422) {
          Alert.alert('Validation Error', 'Invalid email or password format.');
        } else if (response.status === 403) {
          Alert.alert('Login Failed', 'Incorrect username or password.');
        } else {
          Alert.alert('Error', 'Something went wrong. Please try again.');
        }
        return;
      }

      const data = await response.json();

      if (data.token) {
        await AsyncStorage.setItem('userToken', data.token);
        setUserId(data.user.id);
        Alert.alert('Login Successful', 'You are logged in');
        setIsLoggedIn(true);  
      } else {
        Alert.alert('Login Failed', 'No valid token returned. Please try again.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Login failed', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <View>
          <Text style={styles.loggedInText}>You are already logged in!</Text>
        </View>
      ) : (
        <>
          <View style={styles.formContainer}>
            <TextInput
              placeholder="Username (Email)"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Password"
                secureTextEntry={!isPasswordVisible}  // Toggle password visibility
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                <Ionicons 
                  name={isPasswordVisible ? 'eye-off' : 'eye'} 
                  size={24} 
                  color="gray" 
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>
            {isLoading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#f5f5f5' 
  },
  formContainer: { 
    width: '100%', 
    maxWidth: 400, 
    alignSelf: 'center',
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 10, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 5 
  },
  input: { 
    marginBottom: 15, 
    padding: 12, 
    borderWidth: 1, 
    borderRadius: 8, 
    borderColor: '#ccc', 
    backgroundColor: '#fafafa' 
  },
  passwordContainer: { 
    position: 'relative', 
    marginBottom: 20 
  },
  eyeIcon: { 
    position: 'absolute', 
    right: 10, 
    top: '50%', 
    transform: [{ translateY: -12 }] 
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loggedInText: { 
    textAlign: 'center', 
    fontSize: 18, 
    color: 'green', 
    marginBottom: 20 
  },
  loader: { 
    marginTop: 20 
  },
});

export default AuthNavigator;
