import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Button from '../components/Button';
import Card from '../components/Card';
import { useTheme } from '../contexts/ThemeContext';

export default function Dashboard() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapRegion, setMapRegion] = useState<any>({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [places, setPlaces] = useState<Array<{ name: string; type: string; description: string; latitude: number; longitude: number; risk: { level: string; womenSafety: string; robberyTheft: string } }>>([]);
  const [currentCity, setCurrentCity] = useState<string>('New Delhi, India');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [currentRisk, setCurrentRisk] = useState<{ level: string; details: string; responseTime: string }>({ level: 'Low', details: 'Low crime rates.', responseTime: '8 minutes' });
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [displayTime, setDisplayTime] = useState<string>('just now');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for safety features.');
        // Fallback to default
        setPlaces(getPlacesForCity('New Delhi'));
        setCurrentRisk(getRiskForCity('New Delhi'));
        setLastUpdated(new Date());
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setCurrentLocation({ latitude, longitude });

      const region = {
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setMapRegion(region);

      // Reverse geocode to get city
      const geo = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (geo.length > 0) {
        const city = geo[0].city || 'New Delhi';
        const fullCity = `${city}, India`;
        setCurrentCity(fullCity);
        setPlaces(getPlacesForCity(city));
        setCurrentRisk(getRiskForCity(city));
      } else {
        setPlaces(getPlacesForCity('New Delhi'));
        setCurrentRisk(getRiskForCity('New Delhi'));
      }
      setLastUpdated(new Date());
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(updateDisplayTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const handleCall = (number: string) => {
    Alert.alert('Call', `Calling ${number}`);
    // In production, use Linking to make phone calls
  };

  const getPlacesForCity = (city: string) => {
    const placesData: { [key: string]: Array<{ name: string; type: string; description: string; latitude: number; longitude: number; risk: { level: string; womenSafety: string; robberyTheft: string } }> } = {
      'New Delhi': [
        { name: 'Red Fort', type: 'Historical Site', description: 'A historic fort known for its Mughal architecture.', latitude: 28.6562, longitude: 77.2410, risk: { level: 'Medium', womenSafety: 'Moderate', robberyTheft: 'Low' } },
        { name: 'India Gate', type: 'Monument', description: 'A war memorial and popular picnic spot.', latitude: 28.6129, longitude: 77.2295, risk: { level: 'Low', womenSafety: 'High', robberyTheft: 'Low' } },
        { name: 'Connaught Place', type: 'Shopping Area', description: 'A bustling commercial and business center.', latitude: 28.6304, longitude: 77.2177, risk: { level: 'Medium', womenSafety: 'Moderate', robberyTheft: 'Medium' } },
        { name: 'Lotus Temple', type: 'Religious Site', description: 'A Baháʼí House of Worship shaped like a lotus flower.', latitude: 28.5535, longitude: 77.2588, risk: { level: 'Low', womenSafety: 'High', robberyTheft: 'Low' } },
        { name: 'Akshardham Temple', type: 'Temple', description: 'A Hindu temple complex showcasing India\'s culture.', latitude: 28.6183, longitude: 77.2773, risk: { level: 'Low', womenSafety: 'High', robberyTheft: 'Low' } },
        { name: 'Qutub Minar', type: 'Historical Site', description: 'A towering minaret and UNESCO World Heritage Site.', latitude: 28.5244, longitude: 77.1855, risk: { level: 'Low', womenSafety: 'High', robberyTheft: 'Low' } },
        { name: 'Humayun\'s Tomb', type: 'Historical Site', description: 'A Mughal emperor\'s tomb and garden.', latitude: 28.5933, longitude: 77.2507, risk: { level: 'Low', womenSafety: 'High', robberyTheft: 'Low' } },
      ],
      'Mumbai': [
        { name: 'Gateway of India', type: 'Monument', description: 'An arch-monument built during the British Raj.', latitude: 18.9220, longitude: 72.8347, risk: { level: 'Medium', womenSafety: 'Moderate', robberyTheft: 'Medium' } },
        { name: 'Marine Drive', type: 'Promenade', description: 'A 3.6 km long promenade along the Arabian Sea.', latitude: 18.9436, longitude: 72.8233, risk: { level: 'Low', womenSafety: 'High', robberyTheft: 'Low' } },
        { name: 'Elephanta Caves', type: 'Historical Site', description: 'Ancient rock-cut caves with Hindu sculptures.', latitude: 18.9633, longitude: 72.9315, risk: { level: 'Low', womenSafety: 'High', robberyTheft: 'Low' } },
        { name: 'Chhatrapati Shivaji Terminus', type: 'Historical Building', description: 'A historic railway station and UNESCO site.', latitude: 18.9402, longitude: 72.8354, risk: { level: 'Medium', womenSafety: 'Moderate', robberyTheft: 'Medium' } },
      ],
      // Add more cities as needed
    };
    return placesData[city] || placesData['New Delhi'];
  };

  const getRiskForCity = (city: string) => {
    const riskData: { [key: string]: { level: string; details: string; responseTime: string } } = {
      'New Delhi': { level: 'Low', details: 'Low crime rates.', responseTime: '8 minutes' },
      'Mumbai': { level: 'Medium', details: 'Moderate crime rates in urban areas.', responseTime: '10 minutes' },
      // Add more cities
    };
    return riskData[city] || riskData['New Delhi'];
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(1);
  };

  const updateDisplayTime = () => {
    const now = new Date();
    const diff = now.getTime() - lastUpdated.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) setDisplayTime('just now');
    else if (minutes === 1) setDisplayTime('1 minute ago');
    else setDisplayTime(`${minutes} minutes ago`);
  };

  return (
    <View style={[styles.flexContainer, { backgroundColor: isDarkMode ? '#000' : '#E0F7FA' }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Suraksha Kavach</Text>
        <Text style={styles.headerSubtitle}>Active Protection Enabled</Text>
      </View>

      {/* Scroll Content */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>

        {/* Current Location Safety Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Current Location Safety</Text>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>{currentCity}</Text>
              <Text style={[styles.cardDesc, { color: isDarkMode ? '#CCC' : '#666666' }]}>Last updated: {displayTime}</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.riskIndicator}>
                <View style={[styles.riskDot, { backgroundColor: currentRisk.level === 'Low' ? '#28A745' : currentRisk.level === 'Medium' ? '#FFC107' : '#DC3545' }]} />
                <Text style={[styles.riskText, { color: isDarkMode ? '#FFF' : '#333333' }]}>{currentRisk.level} risk area</Text>
              </View>
              <Text style={[styles.riskDetails, { color: isDarkMode ? '#CCC' : '#666666' }]}>
                {currentRisk.details} Emergency response time: approximately {currentRisk.responseTime}.
              </Text>
            </View>
          </Card>
        </View>

        {/* Map Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Live Map</Text>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF', overflow: 'hidden' }]}>
            <View style={{ height: 350, borderRadius: 10, overflow: 'hidden' }}>
              <View style={{ height: 250 }}>
                <MapView
                  style={{ flex: 1 }}
                  region={mapRegion}
                >
                  <Marker
                    coordinate={currentLocation || { latitude: 28.6139, longitude: 77.2090 }}
                    title={currentCity.split(',')[0]}
                    description="Current Location"
                  />
                </MapView>
              </View>
              <View style={styles.placesContainer}>
                <Text style={[styles.placesTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Places to Visit</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.placesScroll}>
                  {places.map((place, index) => (
                    <TouchableOpacity key={index} style={[styles.placeCard, { backgroundColor: isDarkMode ? '#444' : '#F9F9F9' }]} onPress={() => { setSelectedPlace(place); setModalVisible(true); }}>
                      <Text style={[styles.placeName, { color: isDarkMode ? '#FFF' : '#333' }]}>{place.name}</Text>
                      <Text style={[styles.placeType, { color: isDarkMode ? '#CCC' : '#666' }]}>{place.type}</Text>
                      <Text style={[styles.placeDesc, { color: isDarkMode ? '#CCC' : '#666' }]}>{place.description}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Card>
        </View>

        {/* Emergency Contacts Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Emergency Contacts</Text>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
            <View style={styles.cardContent}>
              <View style={styles.contactList}>
                <View style={styles.contactItem}>
                  <View>
                    <Text style={[styles.contactTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Local Police</Text>
                    <Text style={[styles.contactNumber, { color: isDarkMode ? '#CCC' : '#666666' }]}>100</Text>
                  </View>
                  <Button variant="outline" style={styles.callButton} onPress={() => handleCall('100')}>
                    Call
                  </Button>
                </View>
                <View style={styles.contactItem}>
                  <View>
                    <Text style={[styles.contactTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Ambulance</Text>
                    <Text style={[styles.contactNumber, { color: isDarkMode ? '#CCC' : '#666666' }]}>108</Text>
                  </View>
                  <Button variant="outline" style={styles.callButton} onPress={() => handleCall('108')}>
                    Call
                  </Button>
                </View>
                <View style={styles.contactItem}>
                  <View>
                    <Text style={[styles.contactTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Emergency Contact</Text>
                    <Text style={[styles.contactNumber, { color: isDarkMode ? '#CCC' : '#666666' }]}>Mom (+91 9854544585)</Text>
                  </View>
                  <Button variant="outline" style={styles.callButton} onPress={() => handleCall('+15550123')}>
                    Call
                  </Button>
                </View>
              </View>
            </View>
            
          </Card>
        </View>

        {/* AI Translation Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>AI Translation</Text>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
            <View style={styles.translationHeader}>
              <Text style={[styles.cardTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Real-time Translator</Text>
              <Text style={[styles.cardDesc, { color: isDarkMode ? '#CCC' : '#666666' }]}>Speak or type to translate</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.translationButtons}>
                <Button variant="outline" style={styles.translationButton} onPress={() => router.push('/voice-translate')}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="mic-outline" size={24} color={isDarkMode ? '#FFF' : '#333'} />
                    <Text style={[styles.iconText, { color: isDarkMode ? '#FFF' : '#333' }]}>Speak</Text>
                  </View>
                </Button>
                <Button variant="outline" style={styles.translationButton} onPress={() => router.push('/text-translate')}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="document-text-outline" size={24} color={isDarkMode ? '#FFF' : '#333'} />
                    <Text style={[styles.iconText, { color: isDarkMode ? '#FFF' : '#333' }]}>Type</Text>
                  </View>
                </Button>
              </View>
            </View>
          </Card>
        </View>

      </ScrollView>

      {/* Place Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
            {selectedPlace && (
              <>
                <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFF' : '#333' }]}>{selectedPlace.name}</Text>
                <Text style={[styles.modalType, { color: isDarkMode ? '#CCC' : '#666' }]}>{selectedPlace.type}</Text>
                <Text style={[styles.modalDesc, { color: isDarkMode ? '#CCC' : '#666' }]}>{selectedPlace.description}</Text>
                <View style={styles.modalRisk}>
                  <Text style={[styles.modalRiskTitle, { color: isDarkMode ? '#FFF' : '#333' }]}>Safety Information:</Text>
                  <Text style={[styles.modalRiskDetail, { color: isDarkMode ? '#CCC' : '#666' }]}>Women's Safety: {selectedPlace.risk.womenSafety}</Text>
                  <Text style={[styles.modalRiskDetail, { color: isDarkMode ? '#CCC' : '#666' }]}>Robbery/Theft: {selectedPlace.risk.robberyTheft}</Text>
                  <Text style={[styles.modalRiskDetail, { color: isDarkMode ? '#CCC' : '#666' }]}>Overall Risk: {selectedPlace.risk.level}</Text>
                </View>
                <Button variant="outline" style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  Close
                </Button>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flexContainer: { flex: 1, backgroundColor: '#E0F7FA' },
  header: {
    backgroundColor: '#2eacecff',
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 16, color: '#FFFFFF' },
  scrollContainer: { flex: 1 },
  scrollContent: { padding: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333333', marginBottom: 10 },
  sectionCard: { width: '100%', borderRadius: 10, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardDesc: { fontSize: 14 },
  cardContent: { marginBottom: 10 },
  riskIndicator: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  riskDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  riskText: { fontSize: 16, fontWeight: '600' },
  riskDetails: { fontSize: 14 },
  contactList: { marginBottom: 10 },
  contactItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EEEEEE'
  },
  contactTitle: { fontSize: 16, fontWeight: '600' },
  contactNumber: { fontSize: 14 },
  callButton: { minWidth: 80 },
  cardFooter: { alignItems: 'center' },
  fullButton: { width: '100%' },
  translationButtons: { flexDirection: 'row', justifyContent: 'space-around' },
  translationButton: { flex: 1, marginHorizontal: 5, paddingVertical: 15 },
  translationHeader: { marginBottom: 15, alignItems: 'center' },
  iconContainer: { alignItems: 'center', justifyContent: 'center' },
  iconText: { marginTop: 5, fontSize: 14, fontWeight: '600' },
  placesContainer: {
    padding: 10,
    height: 100,
  },
  placesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  placesScroll: {
    height: 80,
  },
  placeCard: {
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  placeType: {
    fontSize: 12,
    marginTop: 2,
  },
  placeDesc: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalType: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalRisk: {
    width: '100%',
    marginBottom: 20,
  },
  modalRiskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalRiskDetail: {
    fontSize: 14,
    marginBottom: 5,
  },
  closeButton: {
    minWidth: 100,
  },
});
