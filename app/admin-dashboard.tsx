import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AdminUserCard from './components/AdminUserCard';
import Button from './components/Button';
import Card from './components/Card';
import Input from './components/Input';
import Label from './components/Label';
import { useAdmin } from './contexts/AdminContext';
import { useTheme } from './contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function AdminDashboard() {
  const { isDarkMode } = useTheme();
  const { users, notifications, sendAlert, getUserCount, getActiveUsers, getLocationTypes } = useAdmin();
  const [alertMessage, setAlertMessage] = useState('');

  const handleSendAlert = async () => {
    if (!alertMessage.trim()) {
      Alert.alert('Error', 'Please enter an alert message.');
      return;
    }
    try {
      await sendAlert(alertMessage, 'alert');
      setAlertMessage('');
      Alert.alert('Success', 'Alert sent to all users.');
    } catch (error) {
      Alert.alert('Error', 'Failed to send alert.');
    }
  };

  const userCount = getUserCount();
  const activeUsers = getActiveUsers();
  const locationTypes = getLocationTypes();

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#E0F7FA' }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Suraksha Kavach Admin Panel</Text>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333' }]}>Overview</Text>
          <View style={styles.statsRow}>
            <Card style={[styles.statCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
              <Text style={[styles.statNumber, { color: isDarkMode ? '#FFF' : '#333' }]}>{userCount}</Text>
              <Text style={[styles.statLabel, { color: isDarkMode ? '#CCC' : '#666' }]}>Total Users</Text>
            </Card>
            <Card style={[styles.statCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
              <Text style={[styles.statNumber, { color: isDarkMode ? '#FFF' : '#333' }]}>{activeUsers}</Text>
              <Text style={[styles.statLabel, { color: isDarkMode ? '#CCC' : '#666' }]}>Active Users</Text>
            </Card>
          </View>
        </View>

        {/* Location Types Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333' }]}>Location Types</Text>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
            {locationTypes.map((item, index) => (
              <View key={index} style={styles.locationType}>
                <Text style={[styles.locationTypeText, { color: isDarkMode ? '#FFF' : '#333' }]}>
                  {item.type}: {item.count}
                </Text>
              </View>
            ))}
          </Card>
        </View>

        {/* Map Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333' }]}>User Locations</Text>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF', overflow: 'hidden' }]}>
            <View style={{ height: 300, borderRadius: 10, overflow: 'hidden' }}>
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: 20.5937,
                  longitude: 78.9629,
                  latitudeDelta: 20,
                  longitudeDelta: 20,
                }}
              >
                {users.map((user) => (
                  <Marker
                    key={user.id}
                    coordinate={{ latitude: user.location.lat, longitude: user.location.lng }}
                    title={user.email}
                    description={`${user.location.city} - ${user.active ? 'Active' : 'Inactive'}`}
                  />
                ))}
              </MapView>
            </View>
          </Card>
        </View>

        {/* Users List Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333' }]}>Users</Text>
          {users.map((user) => (
            <AdminUserCard key={user.id} user={user} />
          ))}
        </View>

        {/* Send Alert Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333' }]}>Send Alert</Text>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
            <View style={styles.inputGroup}>
              <Label>Alert Message</Label>
              <Input
                placeholder="Enter alert message for users"
                value={alertMessage}
                onChangeText={setAlertMessage}
                multiline
              />
            </View>
            <Button onPress={handleSendAlert} style={styles.sendButton}>
              Send Alert
            </Button>
          </Card>
        </View>

        {/* Sent Alerts Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333' }]}>Sent Alerts</Text>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
            {notifications.filter(n => n.type === 'alert').length === 0 ? (
              <Text style={[styles.noAlerts, { color: isDarkMode ? '#CCC' : '#666' }]}>No alerts sent yet.</Text>
            ) : (
              notifications.filter(n => n.type === 'alert').map(alert => (
                <View key={alert.id} style={styles.alertItem}>
                  <Text style={[styles.alertTitle, { color: isDarkMode ? '#FFF' : '#333' }]}>Admin Alert</Text>
                  <Text style={[styles.alertMessage, { color: isDarkMode ? '#CCC' : '#666' }]}>{alert.message}</Text>
                  <Text style={[styles.alertTimestamp, { color: isDarkMode ? '#CCC' : '#666' }]}>{new Date(alert.timestamp).toLocaleString()}</Text>
                </View>
              ))
            )}
          </Card>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  sectionCard: { width: '100%', borderRadius: 10 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { flex: 1, marginHorizontal: 5, padding: 20, alignItems: 'center' },
  statNumber: { fontSize: 32, fontWeight: 'bold' },
  statLabel: { fontSize: 14, marginTop: 5 },
  locationType: { marginBottom: 10 },
  locationTypeText: { fontSize: 16 },
  inputGroup: { marginBottom: 15 },
  sendButton: { width: '100%' },
  noAlerts: { textAlign: 'center', fontSize: 16, marginVertical: 20 },
  alertItem: { marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  alertTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  alertMessage: { fontSize: 14, marginBottom: 5 },
  alertTimestamp: { fontSize: 12 },
});
