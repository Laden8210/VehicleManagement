import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';

const RemindersScreen = () => {
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');

  const fetchReminders = async () => {
    setError(null);
    const token = await AsyncStorage.getItem('userToken');
    try {
      const response = await fetch(`${BASE_URL}reminder`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReminders(data);
      } else {
        setError('Failed to load reminders: ' + response.statusText);
      }
    } catch (err) {
      setError('Failed to fetch reminders: ' + err.message);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [category]);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const filteredReminders = reminders.filter((reminder) =>
    (reminder.Remarks?.toLowerCase() || '').includes(searchQuery?.toLowerCase() || '')
  );
  

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search reminders by remarks"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity onPress={fetchReminders}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Display Error */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Display Reminders */}
      <ScrollView style={styles.scrollView}>
        {filteredReminders.length === 0 ? (
          <Text style={styles.noDataText}>No reminders found</Text>
        ) : (
          filteredReminders.map((reminder) => (
            <View key={reminder.id} style={styles.card}>
              <Text style={styles.date}>
                Reminder Date: {formatDate(reminder.ReminderDate)}
              </Text>
              <Text style={styles.date}>
                Due Date: {formatDate(reminder.DueDate)}
              </Text>
              <Text>Status: {reminder.ReminderStatus}</Text>
              <Text>Remarks: {reminder.Remarks}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default RemindersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  scrollView: {
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  date: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 5,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
