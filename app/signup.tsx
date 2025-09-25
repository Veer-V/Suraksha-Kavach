import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Button from './components/Button';
import Card from './components/Card';
import Input from './components/Input';
import Label from './components/Label';

const { width } = Dimensions.get('window');

export default function Signup() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleSignup = async () => {
    if (!userData.name || !userData.email || !userData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (userData.password !== userData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    // Blockchain Digital ID creation logic here (e.g., using ethers.js)
    console.log('Creating blockchain digital ID for:', userData.email);
    // Simulate signup
    try {
      const uniqueId = Math.random().toString(36).substr(2, 9); // Simple unique ID
      await AsyncStorage.setItem('userToken', 'fake-token');
      await AsyncStorage.setItem('userEmail', userData.email);
      await AsyncStorage.setItem('userName', userData.name);
      await AsyncStorage.setItem('userCountry', userData.country);
      await AsyncStorage.setItem('userGender', userData.gender);
      await AsyncStorage.setItem('userId', uniqueId);
      router.push('/permissions');
    } catch (error) {
      Alert.alert('Error', 'Signup failed');
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <Card style={{ width: width * 0.9 }}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>Create Your Digital ID</Text>
          <Text style={styles.description}>Your information is secured with blockchain technology</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.inputGroup}>
            <Label>Full Name</Label>
            <Input
              placeholder="Enter your full name"
              value={userData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Label>Email Address</Label>
            <Input
              placeholder="Enter your email"
              value={userData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputGroup}>
            <Label>Phone Number (Optional)</Label>
            <Input
              placeholder="Enter your phone number"
              value={userData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputGroup}>
            <Label>Country of Origin</Label>
            <Input
              placeholder="Select your country"
              value={userData.country}
              onChangeText={(text) => handleInputChange('country', text)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Label>Gender</Label>
            <Input
              placeholder="Enter your gender"
              value={userData.gender}
              onChangeText={(text) => handleInputChange('gender', text)}
            />
          </View>
          <View style={styles.inputGroup}>
            <Label>Password</Label>
            <Input
              placeholder="Create a secure password"
              value={userData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              secureTextEntry
            />
          </View>
          <View style={styles.inputGroup}>
            <Label>Confirm Password</Label>
            <Input
              placeholder="Confirm your password"
              value={userData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              secureTextEntry
            />
          </View>
          <View style={styles.switchRow}>
            <Switch value={true} onValueChange={() => {}} />
            <Text style={styles.switchText}>I agree to the Terms of Service and Privacy Policy</Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Button onPress={handleSignup} style={styles.fullButton}>
            Create Secure Account
          </Button>
          <Button variant="outline" onPress={() => router.push('/welcome')} style={styles.fullButton}>
            Back
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
  inputGroup: {
    marginBottom: 15,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  switchText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 10,
    flex: 1,
  },
  cardFooter: {
    alignItems: 'center',
  },
  fullButton: {
    width: '100%',
    marginVertical: 5,
  },
});
