import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BASE_URL } from "../config";

export default function DispatchesScreen() {
  const [dispatches, setDispatches] = useState([]);
  const [filteredDispatches, setFilteredDispatches] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalDispatches, setTotalDispatches] = useState(0);

  const fetchDispatches = async () => {
    setError(null);

    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("Token:", token);

      const response = await fetch(`${BASE_URL}retrieve-dispatch`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : undefined, 
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Data:", data);

      if (Array.isArray(data)) {
        setDispatches(data); 
        setFilteredDispatches(data); 
        setTotalDispatches(data.length);
      } else {
        setError("Invalid response format");
      }
    } catch (err) {
      console.error(err.message);
      setError("Failed to fetch dispatches");
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);

    if (text.trim() === "") {
      setFilteredDispatches(dispatches); // Show all dispatches if the search query is empty
    } else {
      const filteredData = dispatches.filter((dispatch) =>
        dispatch.RequestorName.toLowerCase().includes(text.toLowerCase()) ||
        dispatch.RequestStatus.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredDispatches(filteredData);
    }
  };

  useEffect(() => {
    fetchDispatches();
  }, []); 
  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  return (
    <View style={styles.container}>
      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.row}>
          <View style={[styles.statCard, { backgroundColor: "#d4edda" }]}>
            <Ionicons
              name="people"
              size={60}
              color="#28a745"
              style={styles.icon}
            />
            <Text style={[styles.statTitle, { color: "#28a745" }]}>
              Total Transported Patients
            </Text>
            <Text style={[styles.statValue, { color: "#28a745" }]}>
              {totalDispatches}
            </Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search dispatches"
          value={searchQuery}
          onChangeText={handleSearch} 
        />
        <TouchableOpacity onPress={fetchDispatches}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Display Error */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Display Dispatches */}
      <ScrollView style={styles.scrollView}>
        {filteredDispatches.length === 0 ? (
          <Text style={styles.noDataText}>No dispatches found</Text>
        ) : (
          filteredDispatches.map((dispatch) => (
            <View key={dispatch.id} style={styles.card}>
              <Text style={styles.id}>ID: {dispatch.id}</Text>
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
    backgroundColor: "#f9f9f9",
  },
  statsContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center", 
    marginBottom: 10,
  },
  statCard: {
    backgroundColor: "#d4edda",
    padding: 15,
    borderRadius: 10,
    width: "90%", 
    alignItems: "center",
    elevation: 3,
    paddingVertical: 20,
  },
  icon: {
    marginBottom: 10, 
  },
  statTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  id: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});
