import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Button from './components/Button';
import Card from './components/Card';

const { width } = Dimensions.get('window');

export default function Permissions() {
  const [permissions, setPermissions] = useState({
    location: false,
    camera: false,
    audio: false,
    notifications: false,
  });
  const router = useRouter();

  const handlePermissionToggle = (permission: keyof typeof permissions) => {
    setPermissions({ ...permissions, [permission]: !permissions[permission] });
  };

  const handlePermissionContinue = () => {
    if (!permissions.location) {
      Alert.alert(
        'Location Permission Required',
        'Location access is essential for your safety. Without it, we cannot provide geo-fencing alerts or emergency response services.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable', onPress: () => handlePermissionToggle('location') },
        ],
      );
      return;
    }
    // In production, request actual permissions
    router.push('/dashboard');
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <Card style={{ width: width * 0.9 }}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>Enable Safety Features</Text>
          <Text style={styles.description}>These permissions help keep you protected during your travels</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.permissionItem}>
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>Location Access</Text>
              <Text style={styles.permissionDesc}>For real-time tracking and geo-fencing alerts</Text>
            </View>
            <Switch value={permissions.location} onValueChange={() => handlePermissionToggle('location')} />
          </View>
          <View style={styles.permissionItem}>
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>Camera Access</Text>
              <Text style={styles.permissionDesc}>For emergency photo/video capture and AI analysis</Text>
            </View>
            <Switch value={permissions.camera} onValueChange={() => handlePermissionToggle('camera')} />
          </View>
          <View style={styles.permissionItem}>
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>Microphone Access</Text>
              <Text style={styles.permissionDesc}>For voice commands, translation, and emergency recording</Text>
            </View>
            <Switch value={permissions.audio} onValueChange={() => handlePermissionToggle('audio')} />
          </View>
          <View style={styles.permissionItem}>
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>Notifications</Text>
              <Text style={styles.permissionDesc}>For critical safety alerts and updates</Text>
            </View>
            <Switch value={permissions.notifications} onValueChange={() => handlePermissionToggle('notifications')} />
          </View>
          <View style={styles.privacyNote}>
            <Text style={styles.privacyText}>
              <Text style={styles.bold}>Privacy Note: </Text>
              Your data is protected by blockchain technology. We never share your location or personal information without your explicit consent, except during emergency situations to ensure your safety.
            </Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Button onPress={handlePermissionContinue} style={styles.fullButton}>
            Continue to Safety Dashboard
          </Button>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  cardContent: {
    marginBottom: 20,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  permissionText: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  permissionDesc: {
    fontSize: 14,
    color: '#666666',
  },
  privacyNote: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
  },
  privacyText: {
    fontSize: 14,
    color: '#856404',
  },
  bold: {
    fontWeight: 'bold',
  },
  cardFooter: {
    alignItems: 'center',
  },
  fullButton: {
    width: '100%',
  },
});
