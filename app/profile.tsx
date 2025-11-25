import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Button from './components/Button';
import Card from './components/Card';
import { useTheme } from './contexts/ThemeContext';

export default function ProfessionalProfile() {
  const { isDarkMode } = useTheme();
  const [profile, setProfile] = useState({
    avatarUrl: '',
    name: '',
    gender: '',
    dob: '',
    uniqueId: '',
    token: '',
    phone: '',
    email: '',
    address: '',
    travelHistory: '',
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const keys = [
        'avatarUrl', 'name', 'gender', 'dob', 'uniqueId', 'token',
        'phone', 'email', 'address', 'travelHistory'
      ];
      const values = await AsyncStorage.multiGet(keys);
      const data: any = {};
      values.forEach(([key, value]) => {
        if (value) data[key] = value;
      });
      setProfile(prev => ({ ...prev, ...data }));
    } catch (e) {
      console.log('Failed to load profile:', e);
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.multiSet(Object.entries(profile));
      Alert.alert('Profile saved successfully!');
      setEditing(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={[styles.flexContainer, { backgroundColor: isDarkMode ? '#000' : '#E0F7FA' }]}>
      <LinearGradient colors={isDarkMode ? ['#1a1a1a', '#333'] : ['#2eacecff', '#4dd0e1']} style={styles.header}>
        <Text style={styles.headerTitle}>Suraksha Kavach</Text>
        <Text style={styles.headerSubtitle}>Profile</Text>
      </LinearGradient>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Avatar Section */}
        <View style={styles.section}>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
            <View style={styles.cardContent}>
              <View style={styles.avatarContainer}>
                {profile.avatarUrl ? (
                  <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
                ) : (
                  <Text style={styles.avatarPlaceholder}>👤</Text>
                )}
              </View>
              <Text style={[styles.name, { color: isDarkMode ? '#FFF' : '#333333' }]}>{profile.name || 'Your Name'}</Text>
              <Text style={[styles.uniqueId, { color: isDarkMode ? '#CCC' : '#666666' }]}>ID: {profile.uniqueId || 'XXXX-XXXX'}</Text>
              <Text style={[styles.token, { color: isDarkMode ? '#CCC' : '#666666' }]}>Token: {profile.token || 'XXXX-XXXX-XXXX'}</Text>
            </View>
          </Card>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Personal Information</Text>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
            <View style={styles.cardContent}>
              {editing ? (
                <>
                  <TextInput
                    style={[styles.input, { backgroundColor: isDarkMode ? '#555' : '#fff', color: isDarkMode ? '#FFF' : '#333' }]}
                    placeholder="Gender"
                    placeholderTextColor={isDarkMode ? '#CCC' : '#666'}
                    value={profile.gender}
                    onChangeText={text => setProfile({ ...profile, gender: text })}
                  />
                  <TextInput
                    style={[styles.input, { backgroundColor: isDarkMode ? '#555' : '#fff', color: isDarkMode ? '#FFF' : '#333' }]}
                    placeholder="Date of Birth"
                    placeholderTextColor={isDarkMode ? '#CCC' : '#666'}
                    value={profile.dob}
                    onChangeText={text => setProfile({ ...profile, dob: text })}
                  />
                </>
              ) : (
                <>
                  <Text style={[styles.detail, { color: isDarkMode ? '#FFF' : '#333333' }]}>Gender: {profile.gender}</Text>
                  <Text style={[styles.detail, { color: isDarkMode ? '#FFF' : '#333333' }]}>DOB: {profile.dob}</Text>
                </>
              )}
            </View>
          </Card>
        </View>

        {/* Contact Details Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Contact Details</Text>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
            <View style={styles.cardContent}>
              {editing ? (
                <>
                  <TextInput
                    style={[styles.input, { backgroundColor: isDarkMode ? '#555' : '#fff', color: isDarkMode ? '#FFF' : '#333' }]}
                    placeholder="Phone"
                    placeholderTextColor={isDarkMode ? '#CCC' : '#666'}
                    value={profile.phone}
                    onChangeText={text => setProfile({ ...profile, phone: text })}
                  />
                  <TextInput
                    style={[styles.input, { backgroundColor: isDarkMode ? '#555' : '#fff', color: isDarkMode ? '#FFF' : '#333' }]}
                    placeholder="Email"
                    placeholderTextColor={isDarkMode ? '#CCC' : '#666'}
                    value={profile.email}
                    onChangeText={text => setProfile({ ...profile, email: text })}
                  />
                  <TextInput
                    style={[styles.input, { backgroundColor: isDarkMode ? '#555' : '#fff', color: isDarkMode ? '#FFF' : '#333' }]}
                    placeholder="Address"
                    placeholderTextColor={isDarkMode ? '#CCC' : '#666'}
                    value={profile.address}
                    onChangeText={text => setProfile({ ...profile, address: text })}
                  />
                </>
              ) : (
                <>
                  <Text style={[styles.detail, { color: isDarkMode ? '#FFF' : '#333333' }]}>Phone: {profile.phone}</Text>
                  <Text style={[styles.detail, { color: isDarkMode ? '#FFF' : '#333333' }]}>Email: {profile.email}</Text>
                  <Text style={[styles.detail, { color: isDarkMode ? '#FFF' : '#333333' }]}>Address: {profile.address}</Text>
                </>
              )}
            </View>
          </Card>
        </View>

        {/* Travel History Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Travel History</Text>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
            <View style={styles.cardContent}>
              {editing ? (
                <TextInput
                  style={[styles.input, { backgroundColor: isDarkMode ? '#555' : '#fff', color: isDarkMode ? '#FFF' : '#333' }]}
                  placeholder="Travel History"
                  placeholderTextColor={isDarkMode ? '#CCC' : '#666'}
                  value={profile.travelHistory}
                  onChangeText={text => setProfile({ ...profile, travelHistory: text })}
                  multiline
                />
              ) : (
                <Text style={[styles.detail, { color: isDarkMode ? '#FFF' : '#333333' }]}>{profile.travelHistory || 'No travel history'}</Text>
              )}
            </View>
          </Card>
        </View>

        {/* Edit / Save Button */}
        <View style={styles.section}>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
            <View style={styles.cardFooter}>
              <Button
                onPress={editing ? saveProfile : () => setEditing(true)}
              >
                {editing ? 'Save Profile' : 'Edit Profile'}
              </Button>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  header: {
    backgroundColor: '#2eacecff',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  sectionCard: {
    width: '100%',
  },
  cardContent: {
    marginBottom: 10,
  },
  cardFooter: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    fontSize: 50,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  uniqueId: {
    fontSize: 16,
    marginBottom: 2,
  },
  token: {
    fontSize: 16,
    marginBottom: 15,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
  },
});
