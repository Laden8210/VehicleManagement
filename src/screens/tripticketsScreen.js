import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, FlatList, TouchableOpacity, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function TripTicketForm() {
  const [addModalVisible, setAddModalVisible] = useState(false);  // For Add Trip Ticket modal
  const [viewModalVisible, setViewModalVisible] = useState(false); // For View Trip Details modal
  const [selectedTrip, setSelectedTrip] = useState(null);  // Track selected trip for view modal
  const [tripData, setTripData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form fields for adding a new trip
  const [tripTicketNumber, setTripTicketNumber] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [driverId, setDriverId] = useState('');
  const [responderNames, setResponderNames] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [kmBeforeTravel, setKmBeforeTravel] = useState('');
  const [balanceStart, setBalanceStart] = useState('');
  const [issuedFromOffice, setIssuedFromOffice] = useState('');
  const [departureTimeFromOffice, setDepartureTimeFromOffice] = useState('');
  const [kmAfterTravel, setKmAfterTravel] = useState('');
  const [distanceTravelled, setDistanceTravelled] = useState('');
  const [arrivalAtDestination, setArrivalAtDestination] = useState('');
  const [departureFromDestination, setDepartureFromDestination] = useState('');
  const [arrivalAtOffice, setArrivalAtOffice] = useState('');
  const [addedDuringTrip, setAddedDuringTrip] = useState('');
  const [totalFuelTank, setTotalFuelTank] = useState('');
  const [fuelConsumed, setFuelConsumed] = useState('');
  const [balanceEnd, setBalanceEnd] = useState('');
  const [others, setOthers] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleSubmit = () => {
    const newRow = {
      id: Date.now().toString(),
      tripTicketNumber,
      arrivalDate,
      returnDate,
      vehicleName,
      driverId,
      responderNames,
      origin,
      destination,
      purpose,
      kmBeforeTravel,
      balanceStart,
      issuedFromOffice,
      departureTimeFromOffice,
      kmAfterTravel,
      distanceTravelled,
      arrivalAtDestination,
      departureFromDestination,
      arrivalAtOffice,
      addedDuringTrip,
      totalFuelTank,
      fuelConsumed,
      balanceEnd,
      others,
      remarks,
    };
    setTripData([...tripData, newRow]);
    setAddModalVisible(false); // Close Add modal after adding data
    resetForm(); // Reset the form after submission
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredData = tripData.filter((item) => {
    return (
      item.tripTicketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.driverId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCardClick = (item) => {
    setSelectedTrip(item);
    setViewModalVisible(true);  // Open view modal with full details when a card is clicked
  };

  const closeAddModal = () => {
    setAddModalVisible(false);
    resetForm();
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
  };

  const resetForm = () => {
    setTripTicketNumber('');
    setArrivalDate('');
    setReturnDate('');
    setVehicleName('');
    setDriverId('');
    setResponderNames('');
    setOrigin('');
    setDestination('');
    setPurpose('');
    setKmBeforeTravel('');
    setBalanceStart('');
    setIssuedFromOffice('');
    setDepartureTimeFromOffice('');
    setKmAfterTravel('');
    setDistanceTravelled('');
    setArrivalAtDestination('');
    setDepartureFromDestination('');
    setArrivalAtOffice('');
    setAddedDuringTrip('');
    setTotalFuelTank('');
    setFuelConsumed('');
    setBalanceEnd('');
    setOthers('');
    setRemarks('');
  };

  return (
    <View style={styles.container}>
      {/* Search Bar and Add Button */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder=""
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={() => setAddModalVisible(true)} style={styles.addButton}>
          <Icon name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}></Text>
        </TouchableOpacity>
      </View>

      {/* Table displaying data */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCardClick(item)}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Trip Ticket Number: {item.tripTicketNumber}</Text>
              <Text style={styles.cardText}>Vehicle: {item.vehicleName}</Text>
              <Text style={styles.cardText}>Driver ID: {item.driverId}</Text>
              <Text style={styles.cardText}>Origin: {item.origin}</Text>
              <Text style={styles.cardText}>Destination: {item.destination}</Text>
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
              <Text style={styles.detailText}>Trip Ticket Number: {selectedTrip.tripTicketNumber}</Text>
              <Text style={styles.detailText}>Arrival Date: {selectedTrip.arrivalDate}</Text>
              <Text style={styles.detailText}>Return Date: {selectedTrip.returnDate}</Text>
              <Text style={styles.detailText}>Vehicle Name: {selectedTrip.vehicleName}</Text>
              <Text style={styles.detailText}>Driver ID: {selectedTrip.driverId}</Text>
              <Text style={styles.detailText}>Responder Names: {selectedTrip.responderNames}</Text>
              <Text style={styles.detailText}>Origin: {selectedTrip.origin}</Text>
              <Text style={styles.detailText}>Destination: {selectedTrip.destination}</Text>
              <Text style={styles.detailText}>Purpose: {selectedTrip.purpose}</Text>
              <Text style={styles.detailText}>Km Before Travel: {selectedTrip.kmBeforeTravel}</Text>
              <Text style={styles.detailText}>Balance Start: {selectedTrip.balanceStart}</Text>
              <Text style={styles.detailText}>Issued From Office: {selectedTrip.issuedFromOffice}</Text>
              <Text style={styles.detailText}>Departure Time from Office: {selectedTrip.departureTimeFromOffice}</Text>
              <Text style={styles.detailText}>Km After Travel: {selectedTrip.kmAfterTravel}</Text>
              <Text style={styles.detailText}>Distance Travelled: {selectedTrip.distanceTravelled}</Text>
              <Text style={styles.detailText}>Arrival at Destination: {selectedTrip.arrivalAtDestination}</Text>
              <Text style={styles.detailText}>Departure from Destination: {selectedTrip.departureFromDestination}</Text>
              <Text style={styles.detailText}>Arrival at Office: {selectedTrip.arrivalAtOffice}</Text>
              <Text style={styles.detailText}>Added During Trip: {selectedTrip.addedDuringTrip}</Text>
              <Text style={styles.detailText}>Total Fuel Tank: {selectedTrip.totalFuelTank}</Text>
              <Text style={styles.detailText}>Fuel Consumed: {selectedTrip.fuelConsumed}</Text>
              <Text style={styles.detailText}>Balance End: {selectedTrip.balanceEnd}</Text>
              <Text style={styles.detailText}>Others: {selectedTrip.others}</Text>
              <Text style={styles.detailText}>Remarks: {selectedTrip.remarks}</Text>
            </>
          )}
          <TouchableOpacity onPress={closeViewModal} style={styles.closeButton}>
            <Icon name="times" size={20} color="#fff" />
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      {/* Modal Form for adding a new trip ticket */}
      <Modal visible={addModalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.header}></Text>

          {/* Add all the inputs for each new field */}
          <TextInput style={styles.input} placeholder="Trip Ticket Number" value={tripTicketNumber} onChangeText={setTripTicketNumber} />
          <TextInput style={styles.input} placeholder="Arrival Date" value={arrivalDate} onChangeText={setArrivalDate} />
          <TextInput style={styles.input} placeholder="Return Date" value={returnDate} onChangeText={setReturnDate} />
          <TextInput style={styles.input} placeholder="Vehicle Name" value={vehicleName} onChangeText={setVehicleName} />
          <TextInput style={styles.input} placeholder="Driver ID" value={driverId} onChangeText={setDriverId} />
          <TextInput style={styles.input} placeholder="Responder Names" value={responderNames} onChangeText={setResponderNames} />
          <TextInput style={styles.input} placeholder="Origin" value={origin} onChangeText={setOrigin} />
          <TextInput style={styles.input} placeholder="Destination" value={destination} onChangeText={setDestination} />
          <TextInput style={styles.input} placeholder="Purpose" value={purpose} onChangeText={setPurpose} />
          <TextInput style={styles.input} placeholder="Kilometer Before Travel" value={kmBeforeTravel} onChangeText={setKmBeforeTravel} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Balance Start" value={balanceStart} onChangeText={setBalanceStart} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Issued From Office" value={issuedFromOffice} onChangeText={setIssuedFromOffice} />
          <TextInput style={styles.input} placeholder="Departure Time from Office" value={departureTimeFromOffice} onChangeText={setDepartureTimeFromOffice} />
          <TextInput style={styles.input} placeholder="Kilometer After Travel" value={kmAfterTravel} onChangeText={setKmAfterTravel} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Distance Travelled" value={distanceTravelled} onChangeText={setDistanceTravelled} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Arrival at Destination" value={arrivalAtDestination} onChangeText={setArrivalAtDestination} />
          <TextInput style={styles.input} placeholder="Departure from Destination" value={departureFromDestination} onChangeText={setDepartureFromDestination} />
          <TextInput style={styles.input} placeholder="Arrival at Office" value={arrivalAtOffice} onChangeText={setArrivalAtOffice} />
          <TextInput style={styles.input} placeholder="Added During Trip" value={addedDuringTrip} onChangeText={setAddedDuringTrip} />
          <TextInput style={styles.input} placeholder="Total Fuel Tank" value={totalFuelTank} onChangeText={setTotalFuelTank} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Fuel Consumed" value={fuelConsumed} onChangeText={setFuelConsumed} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Balance End" value={balanceEnd} onChangeText={setBalanceEnd} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Others" value={others} onChangeText={setOthers} />
          <TextInput style={styles.input} placeholder="Remarks" value={remarks} onChangeText={setRemarks} />

          {/* Submit and Cancel Buttons */}
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Icon name="check" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={closeAddModal} style={styles.cancelButton}>
            <Icon name="times" size={20} color="#fff" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#e9ecef', // Light gray background for the whole app
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems: 'center',
  },
  searchInput: {
    height: 40,
    width: '85%',
    borderColor: '#ced4da',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    fontSize: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745', // Green button
    padding: 15,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 0,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#ADD8E6',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    borderColor: '#dee2e6',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
  },
  cardText: {
    fontSize: 14,
    color: '#6c757d',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#495057',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 10,
  },
  input: {
    height: 45,
    borderColor: '#ced4da',
    borderWidth: 1,
    marginVertical: 8,
    paddingLeft: 12,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  submitButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  cancelButton: {
    flexDirection: 'row',
    backgroundColor: '#dc3545',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  closeButton: {
    flexDirection: 'row',
    backgroundColor: '#dc3545',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#495057',
  },
});
