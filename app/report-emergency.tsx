import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Button from './components/Button';

export default function ReportEmergency() {
  const [incidentType, setIncidentType] = useState('');
  const [description, setDescription] = useState('');
  const [specificLocation, setSpecificLocation] = useState('');
  const [witnesses, setWitnesses] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [reportTime, setReportTime] = useState('');
  const [status, setStatus] = useState('Not Reported');
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to report incidents.');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(`Lat: ${location.coords.latitude.toFixed(4)}°N, Long: ${location.coords.longitude.toFixed(4)}°E`);
      setReportTime(new Date().toLocaleString());
    })();
  }, []);

  const handleSOS = () => {
    Alert.alert('Emergency SOS', 'Alert sent to emergency services!');
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!incidentType || !description) {
      Alert.alert('Error', 'Please select incident type and provide description.');
      return;
    }
    setStatus('Reported');
    Alert.alert('Report Submitted', 'Your incident report has been submitted.');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Report an Emergency Situation</Text>

      <Text style={styles.infoText}>
        For immediate emergencies, use the SOS button to alert emergency services instantly.
      </Text>

      <Button onPress={handleSOS} variant="destructive" style={styles.sosButton}>
        Emergency SOS
      </Button>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Incident Type</Text>
        <Picker
          selectedValue={incidentType}
          onValueChange={(itemValue) => setIncidentType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select an incident type" value="" />
          <Picker.Item label="Medical Emergency" value="Medical Emergency" />
          <Picker.Item label="Theft/Robbery" value="Theft/Robbery" />
          <Picker.Item label="Harassment" value="Harassment" />
          <Picker.Item label="Accident" value="Accident" />
          <Picker.Item label="Lost/Missing" value="Lost/Missing" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Incident Details</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Describe what happened..."
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specific Location (Optional)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="e.g. Near Red Fort main gate"
          value={specificLocation}
          onChangeText={setSpecificLocation}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Number of Witnesses (Optional)</Text>
        <TextInput
          style={styles.textInput}
          placeholder="0"
          keyboardType="numeric"
          value={witnesses}
          onChangeText={setWitnesses}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location & Evidence</Text>
        <Text style={styles.label}>Current Location</Text>
        <Text style={styles.value}>{currentLocation || 'Fetching...'}</Text>

        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>Add Photo Evidence</Text>
        </TouchableOpacity>
        {imageUri && <Text style={styles.value}>Photo selected</Text>}

        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>Upload Document</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Report Time</Text>
        <Text style={styles.value}>{reportTime || 'Auto-captured'}</Text>
      </View>

      <Button onPress={handleSubmit} style={styles.submitButton}>
        Submit Incident Report
      </Button>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Incident Status</Text>
        <Text style={styles.status}>Current Status: {status}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    textAlign: 'center',
  },
  sosButton: {
    marginBottom: 30,
    height: 60,
  },
  section: {
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  submitButton: {
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    color: '#333',
  },
});
