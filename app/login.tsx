import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Dimensions, Image, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Button from './components/Button';
import Card from './components/Card';
import Input from './components/Input';
import Label from './components/Label';
import { useTheme } from './contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const router = useRouter();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const handleLoginChange = (field: string, value: any) => {
    setLoginData({ ...loginData, [field]: value });
  };

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      Alert.alert(t('error'), t('pleaseEnter'));
      return;
    }
    // Check for admin login
    if (loginData.email === 'admin@gmail.com' && loginData.password === '12345678') {
      try {
        await AsyncStorage.setItem('adminToken', 'fake-admin-token');
        await AsyncStorage.setItem('adminEmail', loginData.email);
        router.push('/admin-dashboard');
      } catch (error) {
        Alert.alert(t('error'), t('loginFailed'));
      }
      return;
    }
    // Authentication logic here
    console.log('Logging in:', loginData.email);
    // Simulate login
    try {
      const uniqueId = Math.random().toString(36).substr(2, 9); // Simple unique ID
      await AsyncStorage.setItem('userToken', 'fake-token');
      await AsyncStorage.setItem('userEmail', loginData.email);
      await AsyncStorage.setItem('userId', uniqueId);
      router.push('/dashboard');
    } catch (error) {
      Alert.alert(t('error'), t('loginFailed'));
    }
  };

  return (
    <View style={[styles.centerContainer, { backgroundColor: isDarkMode ? '#000' : '#F5F5F5' }]}>
      <Card style={{ width: width * 0.9 }}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: 'https://via.placeholder.com/64x64?text=Shield' }} style={styles.logo} />
          <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#333' }]}>{t('welcomeBack')}</Text>
          <Text style={[styles.description, { color: isDarkMode ? '#CCC' : '#666' }]}>{t('signInSecurely')}</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.inputGroup}>
            <Label>{t('emailAddress')}</Label>
            <Input
              placeholder={t('enterEmail')}
              value={loginData.email}
              onChangeText={(text) => handleLoginChange('email', text)}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputGroup}>
            <Label>{t('password')}</Label>
            <Input
              placeholder={t('enterPassword')}
              value={loginData.password}
              onChangeText={(text) => handleLoginChange('password', text)}
              secureTextEntry
            />
          </View>
          <View style={styles.row}>
            <View style={styles.switchRow}>
              <Switch value={loginData.rememberMe} onValueChange={(value) => handleLoginChange('rememberMe', value)} />
              <Text style={[styles.switchText, { color: isDarkMode ? '#CCC' : '#666' }]}>{t('rememberMe')}</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.linkText}>{t('forgotPassword')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <Button onPress={handleLogin} style={styles.fullButton}>
            {t('signIn')}
          </Button>
          <Button variant="outline" onPress={() => router.push('/welcome')} style={styles.fullButton}>
            {t('backToWelcome')}
          </Button>
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
    width: 64,
    height: 64,
    marginBottom: 16,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 10,
  },
  linkText: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  cardFooter: {
    alignItems: 'center',
  },
  fullButton: {
    width: '100%',
    marginVertical: 5,
  },
});
