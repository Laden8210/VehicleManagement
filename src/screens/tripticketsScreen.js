import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function TripTicketForm() {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripData, setTripData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [arrivalDate, setArrivalDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [driverId, setDriverId] = useState("");
  const [responderNames, setResponderNames] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [purpose, setPurpose] = useState("");
  const [kmBeforeTravel, setKmBeforeTravel] = useState("");
  const [balanceStart, setBalanceStart] = useState("");
  const [issuedFromOffice, setIssuedFromOffice] = useState("");
  const [departureTimeFromOffice, setDepartureTimeFromOffice] = useState("");
  const [kmAfterTravel, setKmAfterTravel] = useState("");

  const [arrivalAtDestination, setArrivalAtDestination] = useState("");
  const [departureFromDestination, setDepartureFromDestination] = useState("");
  const [arrivalAtOffice, setArrivalAtOffice] = useState("");
  const [addedDuringTrip, setAddedDuringTrip] = useState("");

  const [others, setOthers] = useState("");
  const [remarks, setRemarks] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");

  const [dateType, setDateType] = useState(null);

  const [arrivalTimeA, setArrivalTimeA] = useState("");
  const [arrivalTimeB, setArrivalTimeB] = useState("");
  const [departureTimeA, setDepartureTimeA] = useState("");
  const [departureTimeB, setDepartureTimeB] = useState("");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  

  const [latestTicket, setLatestTicket] = useState([]);

  const fetchTripData = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.get(`${BASE_URL}get-trip-ticket`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    setTripData(response.data);
  };

  const [loading, setLoading] = useState(false);

  const fetchLatestTicket = async (vehicleId) => {
    if (!vehicleId) {
      setLatestTicket(null);
      setKmBeforeTravel("");
      setBalanceStart(""); 
      return;
    }
  
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await axios.get(`${BASE_URL}getLatestTicketByCar`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        params: {
          vehicles_id: vehicleId,
        },
      });
  
      const ticket = response.data;
      setLatestTicket(ticket); 
      setKmBeforeTravel(ticket.kbt?.toString() || "0"); 
      setBalanceStart(ticket.totalFuelTank?.toString() || "0");
    } catch (error) {
      setKmBeforeTravel("0");
      setBalanceStart(")"); 
    } finally {
      setLoading(false);
    }
  };
  

  const handleVehicleChange = (vehicleId) => {
    setSelectedVehicle(vehicleId);
    fetchLatestTicket(vehicleId);
  };

  // UI:
  {
    loading ? <ActivityIndicator size="large" color="#0000ff" /> : null;
  }

  const handleSubmit = async () => {
    try {
      if (!arrivalDate || !returnDate) {
        Alert.alert("Error", "Please provide both arrival and return dates.");
        return;
      }
      if (!selectedVehicle) {
        Alert.alert("Error", "Please select a vehicle.");
        return;
      }
      if (!origin || !destination) {
        Alert.alert("Error", "Please provide both origin and destination.");
        return;
      }
      if (!purpose) {
        Alert.alert("Error", "Please specify the purpose of the trip.");
        return;
      }

      // Validate numeric fields
      const parsedKmBeforeTravel = parseInt(kmBeforeTravel, 10);
      const parsedKmAfterTravel = parseInt(kmAfterTravel, 10);
      const parsedBalanceStart = parseFloat(balanceStart);
      const parsedAddedDuringTrip = parseFloat(addedDuringTrip);

      if (isNaN(parsedKmBeforeTravel) || parsedKmBeforeTravel < 0) {
        Alert.alert(
          "Error",
          "Kilometers before travel must be a valid non-negative number."
        );
        return;
      }
      if (
        isNaN(parsedKmAfterTravel) ||
        parsedKmAfterTravel < parsedKmBeforeTravel
      ) {
        Alert.alert(
          "Error",
          "Kilometers after travel must be a valid number greater than or equal to kilometers before travel."
        );
        return;
      }
      if (isNaN(parsedBalanceStart) || parsedBalanceStart < 0) {
        Alert.alert(
          "Error",
          "Balance start must be a valid non-negative number."
        );
        return;
      }
      if (isNaN(parsedAddedDuringTrip) || parsedAddedDuringTrip < 0) {
        Alert.alert(
          "Error",
          "Amount added during trip must be a valid non-negative number."
        );
        return;
      }

      // Validate time fields (optional)
      if (!departureTimeA || !arrivalTimeA) {
        Alert.alert(
          "Error",
          "Please provide departure and arrival times for segment A."
        );
        return;
      }
      if (departureTimeB && !arrivalTimeB) {
        Alert.alert(
          "Error",
          "Please provide both departure and arrival times for segment B."
        );
        return;
      }

      const response = await fetch(`${BASE_URL}add-trip-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${await AsyncStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({
          ArrivalDate: arrivalDate,
          ReturnDate: returnDate,
          vehicles_id: selectedVehicle,
          Origin: origin,
          Destination: destination,
          Purpose: purpose,
          KmBeforeTravel: parsedKmBeforeTravel,
          BalanceStart: parsedBalanceStart,
          IssuedFromOffice: issuedFromOffice,
          TimeDeparture_A: departureTimeA,
          KmAfterTravel: parsedKmAfterTravel,
          TimeArrival_A: arrivalTimeA,
          TimeDeparture_B: departureTimeB,
          TimeArrival_B: arrivalTimeB,

          AddedDuringTrip: parsedAddedDuringTrip,

          Others: others,
          Remarks: remarks,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Trip Ticket Added Successfully");

        setAddModalVisible(false);
        resetForm();
        console.log(result);
      } else {
        // Handle error response
        console.error(result);
      }
    } catch (error) {
      console.error("Error during submit:", error);
    }
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
    fetchTripData();
    fetchVehicles();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredData = tripData.filter((item) => {
    const query = searchQuery.toLowerCase();
  
    return (
      (item.TripTicketNumber?.toLowerCase().includes(query) || false) ||
      (item.VehicleName?.toLowerCase().includes(query) || false) ||
      (item.Origin?.toLowerCase().includes(query) || false) ||
      (item.Destination?.toLowerCase().includes(query) || false)
    );
  });
  
  const handleCardClick = (item) => {
    setSelectedTrip(item);
    setViewModalVisible(true); // Open view modal with full details when a card is clicked
  };

  const closeAddModal = () => {
    setAddModalVisible(false);
    resetForm();
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
  };
  const handleConfirm = (date) => {
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (dateType === "arrivalDate") {
      setArrivalDate(formattedDate);
    } else if (dateType === "returnDate") {
      setReturnDate(formattedDate);
    } else if (dateType === "arrivalAtDestination") {
      setArrivalAtDestination(formattedDate);
    } else if (dateType === "departureTimeFromOffice") {
      setDepartureTimeFromOffice(formattedDate);
    } else if (dateType === "TimeArrival_A") {
      setArrivalTimeA(formattedTime);
    } else if (dateType === "TimeArrival_B") {
      setArrivalTimeB(formattedTime);
    } else if (dateType === "TimeDeparture_A") {
      setDepartureTimeA(formattedTime);
    } else if (dateType === "TimeDeparture_B") {
      setDepartureTimeB(formattedTime);
    }

    setDatePickerVisibility(false);
  };

  const showDatePicker = (field) => {
    setDateType(field);
    setDatePickerVisibility(true);
  };

  const resetForm = () => {
    setArrivalDate("");
    setReturnDate("");
    setVehicleName("");
    setDriverId("");
    setResponderNames("");
    setOrigin("");
    setDestination("");
    setPurpose("");
    setKmBeforeTravel("");
    setBalanceStart("");
    setIssuedFromOffice("");
    setDepartureTimeFromOffice("");
    setKmAfterTravel("");

    setArrivalAtDestination("");
    setDepartureFromDestination("");
    setArrivalAtOffice("");
    setAddedDuringTrip("");

    setOthers("");
    setRemarks("");
  };

  return (
    <View style={styles.container}>
      {/* Search Bar and Add Button */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          onPress={() => setAddModalVisible(true)}
          style={styles.addButton}
        >
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Trip</Text>
        </TouchableOpacity>
      </View>

      {/* Table displaying data */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCardClick(item)}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Trip Ticket Number: {item.TripTicketNumber}
              </Text>
              <Text style={styles.cardText}>Vehicle: {item.VehicleName}</Text>
              <Text style={styles.cardText}>Driver ID: {item.user_id}</Text>
              <Text style={styles.cardText}>Origin: {item.Origin}</Text>
              <Text style={styles.cardText}>
                Destination: {item.Destination}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal to show selected trip details */}
      <Modal visible={viewModalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.header}>Trip Ticket Details</Text>
          {selectedTrip && (
            <>
              <Text style={styles.detailText}>
                Trip Ticket Number: {selectedTrip.TripTicketNumber}
              </Text>
              <Text style={styles.detailText}>
                Arrival Date: {selectedTrip.ArrivalDate}
              </Text>
              <Text style={styles.detailText}>
                Return Date: {selectedTrip.ReturnDate}
              </Text>
              <Text style={styles.detailText}>
                Vehicle Name: {selectedTrip.VehicleName}
              </Text>
              <Text style={styles.detailText}>
                Driver ID: {selectedTrip.user_id}
              </Text>
              <Text style={styles.detailText}>
                Responder Names: {selectedTrip.name}
              </Text>
              <Text style={styles.detailText}>
                Origin: {selectedTrip.Origin}
              </Text>
              <Text style={styles.detailText}>
                Destination: {selectedTrip.Destination}
              </Text>
              <Text style={styles.detailText}>
                Purpose: {selectedTrip.Purpose}
              </Text>
              <Text style={styles.detailText}>
                Km Before Travel: {selectedTrip.KmBeforeTravel}
              </Text>
              <Text style={styles.detailText}>
                Balance Start: {selectedTrip.BalanceStart}
              </Text>
              <Text style={styles.detailText}>
                Remarks: {selectedTrip.Remarks}
              </Text>
              <TouchableOpacity onPress={closeViewModal}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </Modal>

      {/* Modal to add new trip ticket */}
      <Modal visible={addModalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.header}>Add Trip Ticket</Text>
          <Text style={styles.label}>Vehicle</Text>
          <Picker
            selectedValue={selectedVehicle}
            onValueChange={(itemValue) => handleVehicleChange(itemValue)}
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
          {/* Arrival Date Picker */}
          <TouchableOpacity onPress={() => showDatePicker("arrivalDate")}>
            <Text style={styles.input}>{arrivalDate || "Arrival Date"}</Text>
          </TouchableOpacity>
          {/* Return Date Picker */}
          <Text style={styles.label}>Return Date</Text>
          <TouchableOpacity onPress={() => showDatePicker("returnDate")}>
            <Text style={styles.input}>{returnDate || "Return Date"}</Text>
          </TouchableOpacity>
          {/* Arrival At Destination Picker */}
          <Text style={styles.label}>Arrival At Destination</Text>
          <TouchableOpacity
            onPress={() => showDatePicker("arrivalAtDestination")}
          >
            <Text style={styles.input}>
              {arrivalAtDestination || "Arrival At Destination"}
            </Text>
          </TouchableOpacity>
          {/* Departure Time From Office Picker */}
          <Text style={styles.label}>Departure Time From Office</Text>
          <TouchableOpacity
            onPress={() => showDatePicker("departureTimeFromOffice")}
          >
            <Text style={styles.input}>
              {departureTimeFromOffice || "Departure Time From Office"}
            </Text>
          </TouchableOpacity>
          {/* Other fields as normal TextInput */}
          <Text style={styles.label}>Responder Names</Text>
          <TextInput
            style={styles.input}
            placeholder="Responder Names"
            value={responderNames}
            onChangeText={setResponderNames}
          />
          <Text style={styles.label}>Origin</Text>
          <TextInput
            style={styles.input}
            placeholder="Origin"
            value={origin}
            onChangeText={setOrigin}
          />
          <Text style={styles.label}>Destination</Text>
          <TextInput
            style={styles.input}
            placeholder="Destination"
            value={destination}
            onChangeText={setDestination}
          />
          <Text style={styles.label}>Purpose</Text>
          <TextInput
            style={styles.input}
            placeholder="Purpose"
            value={purpose}
            onChangeText={setPurpose}
          />
          <Text style={styles.label}>Km Before Travel</Text>
          <TextInput
            style={styles.input}
            placeholder="Km Before Travel"
            value={kmBeforeTravel}
            onChangeText={setKmBeforeTravel}
          />
          <Text style={styles.label}>Balance Start</Text>
          <TextInput
            style={styles.input}
            placeholder="Balance Start"
            value={balanceStart}
            onChangeText={setBalanceStart}
          />
          <Text style={styles.label}>Issued From Office</Text>
          <TextInput
            style={styles.input}
            placeholder="Issued From Office"
            value={issuedFromOffice}
            onChangeText={setIssuedFromOffice}
          />
          <Text style={styles.label}>Km After Travel</Text>
          <TextInput
            style={styles.input}
            placeholder="Km After Travel"
            value={kmAfterTravel}
            onChangeText={setKmAfterTravel}
          />
          {/* Show DatePicker Modal */}
          <Text style={styles.label}>Departure From Destination</Text>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={() => setDatePickerVisibility(false)}
          />
          <TextInput
            style={styles.input}
            placeholder="Departure From Destination"
            value={departureFromDestination}
            onChangeText={setDepartureFromDestination}
          />
          <Text style={styles.label}>Arrival At Office</Text>
          <TextInput
            style={styles.input}
            placeholder="Arrival At Office"
            value={arrivalAtOffice}
            onChangeText={setArrivalAtOffice}
          />
          <Text style={styles.label}>Added During Trip</Text>
          <TextInput
            style={styles.input}
            placeholder="Added During Trip"
            value={addedDuringTrip}
            onChangeText={setAddedDuringTrip}
          />
          k
          <TouchableOpacity
            onPress={() => showDatePicker("TimeArrival_A")}
            style={styles.input}
          >
            <Text>{arrivalTimeA || "Select Arrival Time A"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => showDatePicker("TimeArrival_B")}
            style={styles.input}
          >
            <Text>{arrivalTimeB || "Select Arrival Time B"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => showDatePicker("TimeDeparture_A")}
            style={styles.input}
          >
            <Text>{departureTimeA || "Select Departure Time A"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => showDatePicker("TimeDeparture_B")}
            style={styles.input}
          >
            <Text>{departureTimeB || "Select Departure Time B"}</Text>
          </TouchableOpacity>
          <Text style={styles.label}>Others</Text>
          <TextInput
            style={styles.input}
            placeholder="Others"
            value={others}
            onChangeText={setOthers}
          />
          <Text style={styles.label}>Remarks</Text>
          <TextInput
            style={styles.input}
            placeholder="Remarks"
            value={remarks}
            onChangeText={setRemarks}
          />
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.submitButton}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={closeAddModal}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  card: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 14,
    color: "#555",
  },
  modalContent: {
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 10,
    textAlignVertical: "center",
    marginBottom: 10,
  },

  picker: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 14,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: "#28a745",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  submitButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
  },
  cancelButton: {
    flexDirection: "row",
    backgroundColor: "#dc3545",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
  },
  closeButton: {
    flexDirection: "row",
    backgroundColor: "#dc3545",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
  },
});
