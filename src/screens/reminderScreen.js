import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';

const RemindersScreen = () => {
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');

  // Fetch reminders from backend
  const fetchReminders = async () => {
    setError(null);

    try {
      const response = await axios.get(
        'https://samplesytems.shop/backend/reminder.php',
        {
          params: { searchQuery, category }, // Adjust as needed in the PHP backend
        }
      );

      if (Array.isArray(response.data)) {
        setReminders(response.data);
      } else {
        setError('Failed to load reminders: Invalid data format');
      }
    } catch (err) {
      setError('Failed to fetch reminders');
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [category]);

  // Function to format the date as "December 6, 19916"
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  // Function to format the title as a date
  const formatTitle = (title) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(title).toLocaleDateString('en-US', options);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search reminders"
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
        {reminders.length === 0 ? (
          <Text style={styles.noDataText}>No reminders found</Text>
        ) : (
          reminders.map((reminder) => (
            <View key={reminder.id} style={styles.card}>
              {/* Formatting the title (date) */}
              <Text style={styles.title}>{formatTitle(reminder.title)}</Text>
              {/* Formatting the date */}
              <Text style={styles.date}>Due Date: {formatDate(reminder.date)}</Text>
              <Text>Status: {reminder.status}</Text>
              <Text>Remarks: {reminder.remarks}</Text>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
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
