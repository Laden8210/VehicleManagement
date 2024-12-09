import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function DispatchesScreen() {
  const [dispatches, setDispatches] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch dispatches from backend
  const fetchDispatches = async () => {
    setError(null);

    try {
      const response = await axios.get(
        'https://samplesytems.shop/backend/dispatch.php',
        { params: { searchQuery } } // Adjust as needed in the PHP backend
      );

      if (Array.isArray(response.data)) {
        setDispatches(response.data);
      } else {
        setError('Failed to load dispatches: Invalid data format');
      }
    } catch (err) {
      setError('Failed to fetch dispatches');
    }
  };

  useEffect(() => {
    fetchDispatches();
  }, []);

  // Function to format the date as "Month Day, Year"
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  return (
    <View style={styles.container}>
      
      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.row}>
          <View style={[styles.statCard, { backgroundColor: '#d4edda' }]}>
            <Ionicons name="people" size={60} color="#28a745" style={styles.icon} />
            <Text style={[styles.statTitle, { color: '#28a745' }]}>
              Total Transported Patients
            </Text>
            <Text style={[styles.statValue, { color: '#28a745' }]}>4</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search dispatches"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity onPress={fetchDispatches}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Display Error */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Display Dispatches */}
      <ScrollView style={styles.scrollView}>
        {dispatches.length === 0 ? (
          <Text style={styles.noDataText}>No dispatches found</Text>
        ) : (
          dispatches.map((dispatch) => (
            <View key={dispatch.ID} style={styles.card}>
              <Text style={styles.id}>ID: {dispatch.ID}</Text>
              <Text>Request Date: {formatDate(dispatch.RequestDate)}</Text>
              <Text>Requestor Name: {dispatch.RequestorName}</Text>
              <Text>Travel Date: {formatDate(dispatch.TravelDate)}</Text>
              <Text>Request Status: {dispatch.RequestStatus}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  statsContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center', // Ensure center alignment
    marginBottom: 10,
  },
  statCard: {
    backgroundColor: '#d4edda', // Light green background
    padding: 15,
    borderRadius: 10,
    width: '90%', // Adjusted to fit the screen better
    alignItems: 'center',
    elevation: 3,
    paddingVertical: 20,
  },
  icon: {
    marginBottom: 10, // Space between icon and text
  },
  statTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
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
  id: {
    fontSize: 16,
    fontWeight: 'bold',
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
