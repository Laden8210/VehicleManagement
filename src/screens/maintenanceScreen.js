import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function MaintenanceRecommendationForm() {
  const [modalVisible, setModalVisible] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [vehicleName, setVehicleName] = useState("");
  const [driverID, setDriverID] = useState("");
  const [recommendationType, setRecommendationType] = useState("");
  const [issues, setIssues] = useState("");
  const [issueDescription, setIssueDescription] = useState("");

  const [priorityLevel, setPriorityLevel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [recommendationDate, setRecommendationDate] = useState(new Date());
  const [dueDate, setDueDate] = useState(new Date());

  const [showRecommendationDatePicker, setShowRecommendationDatePicker] =
    useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);

  const handleRecommendationDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setRecommendationDate(new Date(selectedDate)); // Ensure it's a Date object
    }
    setShowRecommendationDatePicker(false);
  };

  const handleDueDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDueDate(new Date(selectedDate)); // Ensure it's a Date object
    }
    setShowDueDatePicker(false);
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };



  const handleSubmit = async () => {
    const newRecommendation = {
      vehicleName,
      driverID,
      recommendationType,
      issues,
      issueDescription,
      recommendationDate,
      dueDate,
      priorityLevel,
    };
  
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "User token is missing.");
        console.log("No user token found.");
        return; // Prevent further execution if token is missing
      }
  
      const response = await fetch(`${BASE_URL}add-maintenance-recommendation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRecommendation),
      });
  
      const data = await response.json();
      console.log('Response data:', data); // Log response data
  
      if (response.ok) {

        fetchMaintenanceRecommendations();
        Alert.alert("Success", "Maintenance recommendation added successfully!");
        resetForm();
      } else {
        setErrorMessage(data.error || "Error adding maintenance recommendation.");
        Alert.alert("Error", data.error || "Error adding maintenance recommendation.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };
  
  

  const resetForm = () => {
    setVehicleName("");
    setDriverID("");
    setRecommendationType("");
    setIssues("");
    setIssueDescription("");
    setRecommendationDate("");
    setDueDate("");
    setPriorityLevel("");
  };

  const renderRecommendationCard = ({ item }) => {
    const showAlert = () => {
      Alert.alert(
        "Maintenance Recommendation Details",
        `Vehicle Name: ${item.VehicleName || "N/A"}\n` +
          `Driver ID: ${item.user_id || "N/A"}\n` +
          `Recommendation Type: ${item.RecommendationType || "N/A"}\n` +
          `Issues: ${
            item.Issues
              ? JSON.parse(item.Issues)
                  .map((issue) => issue.IssueDescription)
                  .join(", ")
              : "None"
          }\n` +
          `Priority Level: ${item.PriorityLevel || "N/A"}`,
        [{ text: "OK" }]
      );
    };

    return (
      <TouchableOpacity style={styles.card} onPress={showAlert}>
        <View style={styles.cardHeader}>
          <Ionicons
            name="car-sport"
            size={24}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.cardTitle}>
            {item.VehicleName || "Unknown Vehicle"}
          </Text>
        </View>
        <Text style={styles.cardText}>Driver ID: {item.user_id || "N/A"}</Text>
        <Text style={styles.cardText}>
          Issues:
          {item.Issues}
          
        </Text>
        <Text style={styles.cardText}>
          Priority: {item.PriorityLevel || "N/A"}
        </Text>
      </TouchableOpacity>
    );
  };

  const fetchMaintenanceRecommendations = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.get(`${BASE_URL}maintenance-recommendations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data) {
      setRecommendations(response.data);
    } else {
      console.error(
        "Error fetching maintenance recommendations:",
        response.data
      );
    }
  };

  const fetchDriverData = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.get(`${BASE_URL}driver`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) setDrivers(response.data);
  };

  const fetchVehicleData = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.get(`${BASE_URL}vehicles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data) setVehicles(response.data);
  };

  useEffect(() => {
    fetchMaintenanceRecommendations();
    fetchDriverData();
    fetchVehicleData();
  }, []);

  // Filter recommendations based on search query
  const filteredRecommendations = recommendations.filter((recommendation) =>
    (recommendation.VehicleName?.toLowerCase() || "").includes(
      searchQuery?.toLowerCase() || ""
    )
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Maintenance Recommendations</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Vehicle Name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* List of Maintenance Recommendations */}
      <FlatList
        data={filteredRecommendations}
        renderItem={renderRecommendationCard}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            No matching recommendations found
          </Text>
        }
      />

      {/* Add Recommendation Button */}
      <TouchableOpacity style={styles.addRequestButton} onPress={toggleModal}>
        <Ionicons name="add-circle" size={30} color="white" />
        <Text style={styles.addRequestButtonText}>Add Recommendation</Text>
      </TouchableOpacity>

      {/* Modal Form */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>
                Add Maintenance Recommendation
              </Text>

              <Picker
                selectedValue={vehicleName}
                style={styles.input}
                onValueChange={(itemValue) => setVehicleName(itemValue)}
              >
                <Picker.Item label="Select Vehicle" value="" />
                {vehicles.map((vehicle) => (
                  <Picker.Item
                    key={vehicle.id}
                    label={vehicle.VehicleName}
                    value={vehicle.id}
                  />
                ))}
              </Picker>
              <Picker
                selectedValue={driverID}
                style={styles.input}
                onValueChange={(itemValue) => setDriverID(itemValue)}
              >
                <Picker.Item label="Select Driver" value="" />
                {drivers.map((driver) => (
                  <Picker.Item
                    key={driver.id}
                    label={driver.name}
                    value={driver.id}
                  />
                ))}
              </Picker>

              <TextInput
                style={styles.input}
                placeholder="Recommendation Type"
                value={recommendationType}
                onChangeText={setRecommendationType}
              />

              <TextInput
                style={styles.input}
                placeholder="Issues"
                value={issues}
                onChangeText={setIssues}
              />

              <TextInput
                style={styles.input}
                placeholder="Issue Description"
                value={issueDescription}
                onChangeText={setIssueDescription}
              />



              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowRecommendationDatePicker(true)}
              >
                <Text style={styles.datePickerText}>
                  Recommendation Date:{" "}
                  {recommendationDate
                    ? recommendationDate.toLocaleDateString()
                    : new Date().toLocaleDateString()}

                    
                </Text>
              </TouchableOpacity>
              {showRecommendationDatePicker && (
                <DateTimePicker
                  value={recommendationDate}
                  mode="date"
                  display="default"
                  onChange={handleRecommendationDateChange}
                />
              )}

              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowDueDatePicker(true)}
              >
                <Text style={styles.datePickerText}>
                  Due Date:{" "}
                  {dueDate ? dueDate.toLocaleDateString() : new Date().toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {showDueDatePicker && (
                <DateTimePicker
                  value={dueDate}
                  mode="date"
                  display="default"
                  onChange={handleDueDateChange}
                />
              )}
              <Picker
                selectedValue={priorityLevel}
                style={styles.input}
                onValueChange={(itemValue) => setPriorityLevel(itemValue)}
              >
                <Picker.Item label="Priority Level" value="" />
                <Picker.Item label="Low Priority" value="Low Priority" />
                <Picker.Item label="Medium Priority" value="Medium Priority" />
                <Picker.Item label="High Priority" value="High Priority" />
              </Picker>

              {/* Submit and Cancel Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={toggleModal}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "white",
  },
  card: {
    backgroundColor: "#ADD8E6",
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 55,
    borderColor: "#ccc",
    borderWidth: 1,
    marginVertical: 10,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: "white",
  },
  modalButtons: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  addRequestButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  addRequestButtonText: {
    fontSize: 18,
    color: "white",
    marginLeft: 10,
  },
  emptyMessage: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  datePickerButton: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  datePickerText: {
    fontSize: 16,
    color: "#333",
  },
});
