import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Button from './components/Button';
import Card from './components/Card';
import { useTheme } from './contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      router.replace('/dashboard');
    }
  };

  return (
    <View style={[styles.centerContainer, { backgroundColor: isDarkMode ? '#000' : '#F5F5F5' }]}>
      <Card style={{ width: width * 0.9 }}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: 'https://via.placeholder.com/96x96?text=Shield' }} style={styles.logo} />
          <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#333' }]}>{t('surakshaKavach')}</Text>
          <Text style={[styles.description, { color: isDarkMode ? '#CCC' : '#666' }]}>Your Shield for Safe Travels</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.welcomeText, { color: isDarkMode ? '#FFF' : '#333' }]}>
            {t('welcomeText')}
          </Text>
          <View style={styles.buttonGroup}>
            <Button onPress={() => router.push('/signup')} style={styles.fullButton}>
              {t('createAccount')}
            </Button>
            <Button variant="outline" onPress={() => router.push('/login')} style={styles.fullButton}>
              {t('signIn')}
            </Button>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Text style={[styles.footerText, { color: isDarkMode ? '#AAA' : '#999' }]}>
            {t('privacy')}
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
