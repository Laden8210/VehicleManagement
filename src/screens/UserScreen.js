import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, BackHandler } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserScreen = ({ userId, userName, setUserType }) => { 
  const [repairRequests, setRepairRequests] = useState(0);
  const [maintenanceRecommendations, setMaintenanceRecommendations] = useState(0);
  const [reminders, setReminders] = useState(0);
  const [dispatch, setDispatch] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://samplesytems.shop/backend/dashboard.php?userId=${userId}`);
        if (response.data) {
          const { repairRequests, maintenanceRecommendations, reminders, dispatch } = response.data;
          setRepairRequests(repairRequests);
          setMaintenanceRecommendations(maintenanceRecommendations);
          setReminders(reminders);
          setDispatch(dispatch);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserData(); 
    }
  }, [userId]);

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Sign out canceled"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              console.log("Attempting to sign out...");

              // Remove user token and ID from AsyncStorage
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userId');

              // Confirm removal
              console.log("User data cleared from AsyncStorage.");

              // Reset userType to null (not logged in)
              setUserType(null);  // This should trigger a re-render in the parent component

              // Check if setUserType was successful
              console.log("UserType after reset:", userType);

              // Close the app
              BackHandler.exitApp(); // This will close the app on Android
            } catch (error) {
              console.error('Error during sign-out:', error);
              Alert.alert("Error", "An error occurred while signing out. Please try again.");
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {userName || 'Guest'}.</Text>
        
        <TouchableOpacity onPress={handleSignOut}>
       
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.row}>
          <View style={[styles.statCard, { backgroundColor: '#f8d7da' }]} >
            <Icon name="wrench" size={30} color="#dc3545" />
            <Text style={[styles.statTitle, { color: '#dc3545' }]}>REPAIR REQUEST</Text>
            <Text style={[styles.statValue, { color: '#dc3545' }]}>{repairRequests}</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#d1ecf1' }]} >
            <Icon name="cogs" size={30} color="#17a2b8" />
            <Text style={[styles.statTitle, { color: '#17a2b8' }]}>MAINTENANCE RECOMMENDATION</Text>
            <Text style={[styles.statValue, { color: '#17a2b8' }]}>{maintenanceRecommendations}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.statCard, { backgroundColor: '#fff3cd' }]} >
            <Icon name="bell" size={30} color="#ffc107" />
            <Text style={[styles.statTitle, { color: '#ffc107' }]}>REMINDERS</Text>
            <Text style={[styles.statValue, { color: '#ffc107' }]}>{reminders}</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#d4edda' }]} >
            <Icon name="truck" size={30} color="#28a745" />
            <Text style={[styles.statTitle, { color: '#28a745' }]}>DISPATCH</Text>
            <Text style={[styles.statValue, { color: '#28a745' }]}>{dispatch}</Text>
          </View>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          markedDates={{
            '2024-12-07': { marked: true, dotColor: 'blue', activeOpacity: 0 },
            '2024-12-09': { marked: true, dotColor: 'blue', activeOpacity: 0 },
          }}
          markingType={'multi-dot'}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  signOutText: {
    fontSize: 14,
    color: '#007bff',
    marginTop: 10,
  },
  statsContainer: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  calendarContainer: {
    marginTop: 20,
    padding: 10,
  },
});

export default UserScreen;
