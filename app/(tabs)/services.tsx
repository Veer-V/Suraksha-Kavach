import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Services() {
  const router = useRouter();

  const services = [
    { name: 'Location Search', route: '/location-search', icon: '🔍' },
    { name: 'Emergency Contacts', route: '/emergency-contacts', icon: '📞' },
    { name: 'Text Translate', route: '/text-translate', icon: '📝' },
    { name: 'Voice Translate', route: '/voice-translate', icon: '🎤' },
    { name: 'Camera Translate', route: '/camera-translate', icon: '📷' },
    { name: 'Report Emergency', route: '/report-emergency', icon: '🚨' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Services</Text>
      {services.map((service, index) => (
        <TouchableOpacity
          key={index}
          style={styles.serviceItem}
          onPress={() => router.push(service.route as any)}
        >
          <Text style={styles.icon}>{service.icon}</Text>
          <Text style={styles.serviceName}>{service.name}</Text>
        </TouchableOpacity>
      ))}
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
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 30,
    marginRight: 15,
  },
  serviceName: {
    fontSize: 18,
    color: '#333',
  },
});
