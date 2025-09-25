import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Place {
  id: string;
  name: string;
  description: string;
  rating: number;
}

const staticPlaces: Place[] = [
  { id: '1', name: 'Local Hospital', description: 'Emergency medical services available 24/7.', rating: 4.5 },
  { id: '2', name: 'Police Station', description: 'Nearest police station for safety.', rating: 4.0 },
  { id: '3', name: 'Fire Department', description: 'Fire and rescue services.', rating: 4.8 },
  { id: '4', name: 'Shopping Mall', description: 'Safe shopping area with security.', rating: 4.2 },
  { id: '5', name: 'Park', description: 'Public park, generally safe during day.', rating: 3.8 },
  { id: '6', name: 'Restaurant', description: 'Popular eatery with good reviews.', rating: 4.7 },
  // Add more static data as needed
];

export default function LocationSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const router = useRouter();

  const handleSearch = () => {
    if (!searchQuery) {
      Alert.alert('Error', 'Please enter a location name');
      return;
    }

    // TODO: Integrate with Google Places API or similar
    // For now, filter static data based on query
    const filtered = staticPlaces.filter(place =>
      place.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const viewDetails = (place: Place) => {
    Alert.alert('Details', `${place.name}\n${place.description}\nRating: ${place.rating}`);
    // TODO: Navigate to detailed view or show more info
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Search</Text>
      <TextInput
        style={styles.input}
        placeholder="Search for a location (e.g., hospital)"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => viewDetails(item)} style={styles.placeItem}>
            <Text style={styles.placeName}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>Rating: {item.rating}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Back to Profile" onPress={() => router.push('/profile')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  placeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 10,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
