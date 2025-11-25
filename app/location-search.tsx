import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { MapMarkerProps, MapViewProps } from 'react-native-maps';
import Button from './components/Button';
import Card from './components/Card';
import Input from './components/Input';
import { useTheme } from './contexts/ThemeContext';

const isWeb = Platform.OS === 'web';
let MapViewComponent: React.ComponentType<MapViewProps> | null = null;
let MarkerComponent: React.ComponentType<MapMarkerProps> | null = null;

if (!isWeb) {
  const Maps = require('react-native-maps');
  MapViewComponent = Maps.default || Maps.MapView;
  MarkerComponent = Maps.Marker;
}

// Using free APIs: Nominatim for search, Wikipedia for descriptions

interface Place {
  id: string;
  name: string;
  description: string;
  rating: number;
  lat: number;
  lng: number;
  risk: 'high' | 'low' | 'safe';
  distance?: number; // distance from current location
}

export default function LocationSearch() {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapRegion, setMapRegion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [placeDetails, setPlaceDetails] = useState<any>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const userLoc = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
      setCurrentLocation(userLoc);
      setMapRegion({ ...userLoc, latitudeDelta: 0.05, longitudeDelta: 0.05 });
    })();
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distance in km
  };

  const fetchWikipediaSummary = async (title: string) => {
    try {
      const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
        headers: {
          'User-Agent': 'SurakshaKavach/1.0 (contact@example.com)',
        },
      });
      return res.data.extract || 'No description available.';
    } catch {
      return 'No description available.';
    }
  };

  const assignRisk = (type: string) => {
    if (type === 'city' || type === 'town') return 'safe';
    if (type === 'village') return 'low';
    return 'high';
  };

  const searchLocation = async () => {
    if (!searchQuery) return;

    setSearchResults([]); // Clear previous results to prevent duplicates
    setIsLoading(true);
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&countrycodes=IN&format=json&limit=10`,
        {
          headers: {
            'User-Agent': 'SurakshaKavach/1.0 (contact@example.com)',
          },
        }
      );

      const places: Place[] = await Promise.all(res.data.map(async (p: any, index: number) => {
        const name = p.display_name.split(',')[0];
        const description = await fetchWikipediaSummary(name);
        return {
          id: p.osm_id.toString(),
          name: name,
          description: description,
          rating: 0, // no rating in Nominatim
          lat: parseFloat(p.lat),
          lng: parseFloat(p.lon),
          risk: assignRisk(p.type),
          distance: currentLocation
            ? parseFloat(
                calculateDistance(
                  currentLocation.latitude,
                  currentLocation.longitude,
                  parseFloat(p.lat),
                  parseFloat(p.lon)
                ).toFixed(2)
              )
            : undefined,
        };
      }));

      setSearchResults(places);
      setSelectedPlace(places[0] || null);
      if (places.length > 0) {
        setMapRegion({
          latitude: places[0].lat,
          longitude: places[0].lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch locations');
    } finally {
      setIsLoading(false);
    }
  };

  const getPinColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'red';
      case 'low': return 'yellow';
      case 'safe': return 'green';
      default: return 'blue';
    }
  };

  const zoomIn = () => {
    if (mapRegion) {
      setMapRegion({
        ...mapRegion,
        latitudeDelta: mapRegion.latitudeDelta * 0.5,
        longitudeDelta: mapRegion.longitudeDelta * 0.5,
      });
    }
  };

  const zoomOut = () => {
    if (mapRegion) {
      setMapRegion({
        ...mapRegion,
        latitudeDelta: mapRegion.latitudeDelta * 2,
        longitudeDelta: mapRegion.longitudeDelta * 2,
      });
    }
  };

  const selectPlace = (place: Place) => {
    setSelectedPlace(place);
    setMapRegion({
      latitude: place.lat,
      longitude: place.lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  const fetchPlaceDetails = async (place: Place) => {
    setIsLoadingDetails(true);
    try {
      setPlaceDetails(place);

      // Fetch nearby places using Overpass API
      const query = `[out:json]; (node(around:1500,${place.lat},${place.lng})["amenity"]; node(around:1500,${place.lat},${place.lng})["tourism"]; node(around:1500,${place.lat},${place.lng})["shop"]; ); out 10;`;
      const res = await axios.post('https://overpass-api.de/api/interpreter', query, {
        headers: {
          'Content-Type': 'text/plain',
          'User-Agent': 'SurakshaKavach/1.0 (contact@example.com)',
        },
      });
      const nearby = res.data.elements.map((el: any) => ({
        name: el.tags?.name || 'Unnamed Place',
        type: el.tags?.amenity || el.tags?.tourism || el.tags?.shop || 'Unknown',
        lat: el.lat,
        lng: el.lon,
      }));
      setNearbyPlaces(nearby);
    } catch (err) {
      console.error(err);
      setNearbyPlaces([]);
      Alert.alert('Error', 'Failed to fetch nearby places');
    } finally {
      setIsLoadingDetails(false);
    }
  };



  const openDetailsModal = (place: Place) => {
    setSelectedPlace(place);
    setModalVisible(true);
    fetchPlaceDetails(place);
  };

  const generateSafetyInfo = (place: any) => {
    let safety = '';
    if (place.risk === 'safe') {
      safety = 'This area is generally safe for visitors. Well-populated with good security measures. ';
    } else if (place.risk === 'low') {
      safety = 'Moderate safety. Exercise caution, especially at night. ';
    } else {
      safety = 'High risk area. Avoid traveling alone, especially at night. ';
    }

    safety += 'For women: Avoid isolated areas at night. Theft risk: Moderate in crowded areas. ';

    return safety;
  };

  const themeColors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    card: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    border: isDarkMode ? '#383838' : '#E0E0E0',
    primary: '#4CAF50',
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Suraksha Kavach</Text>
      </View>
      <Text style={[styles.pageTitle, { color: themeColors.text }]}>Location Search</Text>
      <Card style={styles.headerCard}>
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search for a place in India"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchLocation}
            style={styles.input}
          />
          <Button onPress={searchLocation} disabled={isLoading} style={styles.searchButton}>
            {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Ionicons name="search" size={20} color="#FFFFFF" />}
          </Button>
        </View>
        <View style={styles.zoomControls}>
          <Button onPress={zoomIn} style={styles.zoomButton}>
            <Ionicons name="add-circle" size={24} color="#FFFFFF" />
          </Button>
          <Button onPress={zoomOut} style={styles.zoomButton}>
            <Ionicons name="remove-circle" size={24} color="#FFFFFF" />
          </Button>
        </View>
      </Card>

      {mapRegion && !isWeb && MapViewComponent && (
        <MapViewComponent style={[styles.map, { flex: 1 }]} region={mapRegion} showsUserLocation>
          {searchResults.map(place => {
            const Marker = MarkerComponent!;
            return (
              <Marker
                key={place.id}
                coordinate={{ latitude: place.lat, longitude: place.lng }}
                title={place.name}
                description={`${place.description}\nRisk: ${place.risk}\nDistance: ${place.distance ? `${place.distance} km` : 'N/A'}`}
                pinColor={getPinColor(place.risk)}
              />
            );
          })}
        </MapViewComponent>
      )}

      <FlatList
        style={styles.list}
        data={searchResults}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => selectPlace(item)}>
            <Card style={[styles.placeCard, { backgroundColor: themeColors.card }]}>
              <Text style={[styles.placeName, { color: themeColors.text }]}>{item.name}</Text>
              <Text style={[styles.riskText, { color: getRiskColor(item.risk) }]}>Risk Level: {item.risk}</Text>
              <Text style={{ color: themeColors.text, marginBottom: 5 }}>Distance: {item.distance ? `${item.distance} km` : 'N/A'}</Text>
              <Text style={{ color: themeColors.text }}>Rating: {item.rating}</Text>
              <Button onPress={() => openDetailsModal(item)} style={styles.detailsButton}>Details</Button>
            </Card>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {isLoadingDetails ? (
              <ActivityIndicator size="large" color={themeColors.primary} />
            ) : placeDetails ? (
              <>
                <Text style={[styles.modalTitle, { color: themeColors.primary }]}>{placeDetails.name}</Text>
                <Text style={[styles.descriptionText, { color: themeColors.text }]}>{placeDetails.description}</Text>
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: themeColors.primary }]}>Risk Level</Text>
                  <Text style={[styles.riskText, { color: getRiskColor(placeDetails.risk) }]}>{placeDetails.risk.toUpperCase()}</Text>
                </View>
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: themeColors.primary }]}>Safety Information</Text>
                  <Text style={[styles.safetyText, { color: themeColors.text }]}>{generateSafetyInfo(placeDetails)}</Text>
                </View>
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: themeColors.primary }]}>Nearby Places</Text>
                  {nearbyPlaces.length > 0 ? (
                    <View style={styles.nearbyContainer}>
                      {nearbyPlaces.map((nearby: any, index: number) => (
                        <View key={index} style={[styles.nearbyBox, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
                          <Text style={[styles.nearbyBoxText, { color: themeColors.text }]}>{nearby.name}</Text>
                          <Text style={[styles.nearbyBoxSubText, { color: themeColors.text }]}>({nearby.type})</Text>
                        </View>
                      ))}
                    </View>
                  ) : <Text style={[styles.noNearbyText, { color: themeColors.text }]}>No nearby places found.</Text>}
                </View>
              </>
            ) : null}
          </ScrollView>
          <Button onPress={() => setModalVisible(false)} style={styles.closeButton}>Close</Button>
        </View>
      </Modal>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: '#2eacecff',
    padding: 25,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' },
  pageTitle: { fontSize: 24, margin: 15, textAlign: 'center' },
  headerCard: { padding: 20, margin: 20, marginTop: 0, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  input: { flex: 1, marginRight: 10 },
  searchButton: { minWidth: 50, minHeight: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  zoomControls: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  zoomButton: { minWidth: 50, minHeight: 50, borderRadius: 25, marginHorizontal: 10, justifyContent: 'center', alignItems: 'center' },
  map: { flex: 1 },
  list: { maxHeight: 300, paddingHorizontal: 20 },
  placeCard: { marginVertical: 6, padding: 15 },
  placeName: { fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  riskText: { fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  detailsButton: { marginTop: 12 },
  modalContainer: { flex: 1, padding: 30 },
  scrollContent: { paddingBottom: 30 },
  modalTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  descriptionText: { fontSize: 18, textAlign: 'justify', lineHeight: 28, marginBottom: 25 },
  section: { marginVertical: 20 },
  sectionTitle: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  safetyText: { fontSize: 20, textAlign: 'justify', lineHeight: 30 },
  nearbyText: { fontSize: 18, marginVertical: 3 },
  noNearbyText: { fontSize: 18, fontStyle: 'italic' },
  nearbyContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  nearbyBox: { width: '48%', padding: 12, marginVertical: 6, borderWidth: 1, borderRadius: 10, alignItems: 'center' },
  nearbyBoxText: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  nearbyBoxSubText: { fontSize: 16 },
  closeButton: { marginTop: 25 },
});

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'high': return '#FF3B30';
    case 'low': return '#FF9500';
    case 'safe': return '#34C759';
    default: return '#007AFF';
  }
};
