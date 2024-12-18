import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { Ionicons } from "@expo/vector-icons"; // Using Ionicons for icons
import axios from "axios";
import { BASE_URL } from "../config";

export default function RepairRequestForm() {
  const [modalVisible, setModalVisible] = useState(false);
  const [repairRequests, setRepairRequests] = useState([]);
  const [vehicleName, setVehicleName] = useState("");
  const [driverID, setDriverID] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [reportedIssue, setReportedIssue] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [priorityLevel, setPriorityLevel] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // New state for search bar
  const [vehicles, setVehicles] = useState([]);
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleSubmit = async () => {
    const newRequest = {
      vehicleName,
      requestDate,
      reportedIssue,
      issueDescription,
      priorityLevel,
    };
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.post(
        `${BASE_URL}create-repair-request`,
        newRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data) {
        setRepairRequests([...repairRequests, newRequest]);
        toggleModal();
        resetForm();
        fetchRepairRequests();
      } else {
        Alert.alert(
          "Error",
          response.data.message || "An unexpected error occurred."
        );
      }
    } catch (error) {
      console.error("Error submitting repair request:", error);

      if (error.response) {
        const errorMessage =
          error.response.data.error || "An unexpected error occurred.";

        Alert.alert("Error", errorMessage);
      } else {
        Alert.alert(
          "Error",
          "An error occurred while submitting the repair request."
        );
      }
    }


  };


const fetchRepairRequests = async () => {
  const token = await AsyncStorage.getItem("userToken");
  const response = await axios.get(`${BASE_URL}repair-requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    
  });

  if(response.data){
    setRepairRequests(response.data);
  }else{
    console.error("Error fetching repair requests:", response.data);
  }
};

  const resetForm = () => {
    setVehicleName("");
    setDriverID("");
    setRequestDate("");
    setReportedIssue("");
    setIssueDescription("");
    setPriorityLevel("");
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          const response = await axios.get(`${BASE_URL}vehicles`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });

          setVehicles(response.data);
        } else {
          console.error("No token found in AsyncStorage.");
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };
    fetchVehicles();
    fetchRepairRequests();
  }, []);

  const renderRequestCard = ({ item }) => {
    const showAlert = () => {
      Alert.alert(
        "Repair Request Details",
        `Vehicle Name: ${item.VehicleName}\nDriver ID: ${item.user_id}\nRequest Date: ${item.RequestDate}\nReported Issue: ${item.ReportedIssue}\nIssue Description: ${item.Issues}\nPriority Level: ${item.PriorityLevel}`,
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
          <Text style={styles.cardTitle}>{item.VehicleName}</Text>
        </View>
        <Text>Reported Issue: {item.RequestDate}</Text>
        <Text>Priority: {item.ReportedIssue}</Text>
      </TouchableOpacity>
    );
  };


  const filteredRequests = repairRequests.filter(
    (request) =>
      request &&
      typeof request.VehicleName === "string" &&
      request.VehicleName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Repair Requests</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Vehicle Name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* List of Repair Requests */}
      <FlatList
        data={filteredRequests}
        renderItem={renderRequestCard}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No matching requests found</Text>
        }
      />

      {/* Add Request Button */}
      <TouchableOpacity style={styles.addRequestButton} onPress={toggleModal}>
        <Ionicons name="add-circle" size={30} color="white" />
        <Text style={styles.addRequestButtonText}>Add Request</Text>
      </TouchableOpacity>

      {/* Modal Form */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Add Repair Request</Text>

              <Text style={styles.label}>Vehicle</Text>
              <Picker
                selectedValue={setVehicleName}
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

              <TextInput
                style={styles.input}
                placeholder="Request Date (dd/mm/yyyy)"
                value={requestDate}
                onChangeText={setRequestDate}
              />

              <Picker
                selectedValue={reportedIssue}
                style={styles.input}
                onValueChange={(itemValue) => setReportedIssue(itemValue)}
              >
                <Picker.Item label="Reported Issue" value="" />
                <Picker.Item label="Engine" value="Engine" />
                <Picker.Item label="Transmission" value="Transmission" />
                <Picker.Item label="Suspension" value="Suspension" />
                <Picker.Item label="Air Conditioner" value="Air Conditioner" />
                <Picker.Item label="Exhaust" value="Exhaust" />
                <Picker.Item label="Windshield" value="Windshield" />
                {/* Add more issues as needed */}
              </Picker>

              <TextInput
                style={styles.input}
                placeholder="Issue Description"
                value={issueDescription}
                onChangeText={setIssueDescription}
              />

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
});
