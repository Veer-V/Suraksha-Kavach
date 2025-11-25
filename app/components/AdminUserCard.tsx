import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Card from './Card';

interface User {
  id: string;
  email: string;
  location: { lat: number; lng: number; city: string; type?: string };
  active: boolean;
  lastSeen: string;
}

interface AdminUserCardProps {
  user: User;
}

export default function AdminUserCard({ user }: AdminUserCardProps) {
  const { isDarkMode } = useTheme();

  const formatLastSeen = (timestamp: string) => {
    const now = new Date();
    const lastSeen = new Date(timestamp);
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hr ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <Card style={[styles.card, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
      <View style={styles.header}>
        <Text style={[styles.email, { color: isDarkMode ? '#FFF' : '#333' }]}>{user.email}</Text>
        <View style={[styles.status, { backgroundColor: user.active ? '#28A745' : '#DC3545' }]}>
          <Text style={styles.statusText}>{user.active ? 'Active' : 'Inactive'}</Text>
        </View>
      </View>
      <View style={styles.details}>
        <Text style={[styles.location, { color: isDarkMode ? '#CCC' : '#666' }]}>
          Location: {user.location.city} ({user.location.type || 'Unknown'})
        </Text>
        <Text style={[styles.coords, { color: isDarkMode ? '#CCC' : '#666' }]}>
          Lat: {user.location.lat.toFixed(4)}, Lng: {user.location.lng.toFixed(4)}
        </Text>
        <Text style={[styles.lastSeen, { color: isDarkMode ? '#CCC' : '#666' }]}>
          Last seen: {formatLastSeen(user.lastSeen)}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  details: {
    marginTop: 5,
  },
  location: {
    fontSize: 14,
    marginBottom: 5,
  },
  coords: {
    fontSize: 12,
    marginBottom: 5,
  },
  lastSeen: {
    fontSize: 12,
  },
});
