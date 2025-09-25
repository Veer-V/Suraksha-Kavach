import React, { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from './components/Button';
import Card from './components/Card';
import Input from './components/Input';
import Label from './components/Label';

interface EmergencyService {
  name: string;
  number: string;
  description: string;
}

interface PersonalContact {
  name: string;
  number: string;
}

const emergencyServices: EmergencyService[] = [
  { name: 'Police', number: '100', description: 'For immediate police assistance' },
  { name: 'Ambulance', number: '108', description: 'Medical emergency services' },
  { name: 'Fire Brigade', number: '101', description: 'Fire emergency response' },
  { name: 'Women Helpline', number: '1091', description: 'Support for women in distress' },
  { name: 'Child Helpline', number: '1098', description: 'Help for children in need' },
  { name: 'Disaster Management', number: '1070', description: 'Natural disaster assistance' },
  { name: 'Railway Enquiry', number: '139', description: 'Railway information and emergencies' },
  { name: 'Electricity Complaint', number: '1912', description: 'Power supply issues' },
];

const EmergencyContacts: React.FC = () => {
  const [personalContacts, setPersonalContacts] = useState<PersonalContact[]>([]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactNumber, setNewContactNumber] = useState('');

  const makeCall = (number: string) => {
    const url = `tel:${number}`;
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to make a call from this device');
      }
    });
  };

  const addPersonalContact = () => {
    if (newContactName.trim() && newContactNumber.trim()) {
      setPersonalContacts([...personalContacts, { name: newContactName, number: newContactNumber }]);
      setNewContactName('');
      setNewContactNumber('');
    } else {
      Alert.alert('Error', 'Please enter both name and number');
    }
  };

  const removePersonalContact = (index: number) => {
    const updatedContacts = personalContacts.filter((_, i) => i !== index);
    setPersonalContacts(updatedContacts);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Emergency Contacts</Text>

      <Text style={styles.sectionTitle}>Emergency Services</Text>
      {emergencyServices.map((service, index) => (
        <Card key={index} style={styles.card}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceDescription}>{service.description}</Text>
          <Text style={styles.serviceNumber}>{service.number}</Text>
          <Button onPress={() => makeCall(service.number)} style={styles.callButton}>
            Call {service.number}
          </Button>
        </Card>
      ))}

      <Text style={styles.sectionTitle}>Personal Emergency Contacts</Text>
      {personalContacts.map((contact, index) => (
        <Card key={index} style={styles.card}>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.contactNumber}>{contact.number}</Text>
          <View style={styles.buttonRow}>
            <Button onPress={() => makeCall(contact.number)} style={styles.callButtonSmall}>
              Call
            </Button>
            <Button
              onPress={() => removePersonalContact(index)}
              variant="destructive"
              style={styles.removeButton}
            >
              Remove
            </Button>
          </View>
        </Card>
      ))}

      <Card style={styles.card}>
        <Label>Add New Contact</Label>
        <Input
          placeholder="Contact Name"
          value={newContactName}
          onChangeText={setNewContactName}
        />
        <Input
          placeholder="Phone Number"
          value={newContactNumber}
          onChangeText={setNewContactNumber}
          keyboardType="phone-pad"
        />
        <Button onPress={addPersonalContact} style={styles.addButton}>
          Add Contact
        </Button>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  card: {
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  serviceNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  contactNumber: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  callButton: {
    marginTop: 10,
  },
  callButtonSmall: {
    flex: 1,
    marginRight: 5,
  },
  removeButton: {
    flex: 1,
    marginLeft: 5,
  },
  addButton: {
    marginTop: 10,
  },
});

export default EmergencyContacts;
