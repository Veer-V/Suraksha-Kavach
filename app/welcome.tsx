import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Button from './components/Button';
import Card from './components/Card';

const { width } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.centerContainer}>
      <Card style={{ width: width * 0.9 }}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: 'https://via.placeholder.com/96x96?text=Shield' }} style={styles.logo} />
          <Text style={styles.title}>सुरक्षा कवच</Text>
          <Text style={styles.description}>Your Shield for Safe Travels</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.welcomeText}>
            Join thousands of travelers who stay protected with our AI-powered safety monitoring system.
          </Text>
          <View style={styles.buttonGroup}>
            <Button onPress={() => router.push('/signup')} style={styles.fullButton}>
              Create Account
            </Button>
            <Button variant="outline" onPress={() => router.push('/login')} style={styles.fullButton}>
              Sign In
            </Button>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Privacy Policy and Terms of Service
          </Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
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
  welcomeText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonGroup: {
    gap: 10,
  },
  fullButton: {
    width: '100%',
  },
  cardFooter: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
  },
});
