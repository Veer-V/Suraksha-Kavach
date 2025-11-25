import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'safety' | 'update' | 'general' | 'alert';
}

const dummyNotifications: Notification[] = [
  {
    id: '1',
    title: 'Safety Alert',
    message: 'Emergency contact has been updated. Please verify your contacts.',
    timestamp: '2023-10-01 10:00 AM',
    isRead: false,
    type: 'safety',
  },
  {
    id: '2',
    title: 'App Update',
    message: 'New version available. Update now for better security features.',
    timestamp: '2023-10-02 2:00 PM',
    isRead: false,
    type: 'update',
  },
  {
    id: '3',
    title: 'General Message',
    message: 'Welcome to Suraksha Kavach! Stay safe and connected.',
    timestamp: '2023-10-03 5:00 PM',
    isRead: true,
    type: 'general',
  },
  {
    id: '4',
    title: 'Safety Alert',
    message: 'Location sharing is enabled. Your safety is our priority.',
    timestamp: '2023-10-04 8:00 AM',
    isRead: false,
    type: 'safety',
  },
  {
    id: '5',
    title: 'Update Session',
    message: 'Translation service updated. New languages added.',
    timestamp: '2023-10-05 12:00 PM',
    isRead: false,
    type: 'update',
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
  const [lastAlertId, setLastAlertId] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem('globalNotifications');
      if (stored) {
        const globalNotifs: Notification[] = JSON.parse(stored);
        const combined = [...dummyNotifications, ...globalNotifs];
        setNotifications(combined);

        // Check for new alerts and show pop-up
        const unreadAlerts = globalNotifs.filter(n => !n.isRead && n.type === 'alert');
        if (unreadAlerts.length > 0 && unreadAlerts[0].id !== lastAlertId) {
          setLastAlertId(unreadAlerts[0].id);
          Alert.alert('New Alert', unreadAlerts[0].message);
        }
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const simulateError = () => {
    Alert.alert(
      'Error',
      'Failed to load notifications. Please check your connection and try again.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Button onPress={markAllAsRead} style={styles.markAllButton}>
          Mark All as Read
        </Button>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {notifications.map(notification => (
          <Card key={notification.id} style={[styles.notificationCard, !notification.isRead && styles.unreadCard]}>
            <View style={styles.notificationHeader}>
              <Text style={[styles.notificationTitle, !notification.isRead && styles.unreadText]}>
                {notification.title}
              </Text>
              <Text style={styles.timestamp}>{notification.timestamp}</Text>
            </View>
            <Text style={styles.notificationMessage}>{notification.message}</Text>
            <Text style={styles.typeText}>{notification.type.toUpperCase()}</Text>
          </Card>
        ))}
      </ScrollView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  markAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
  },
  notificationCard: {
    marginBottom: 10,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  unreadText: {
    color: '#007AFF',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'right',
  },
  errorButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
