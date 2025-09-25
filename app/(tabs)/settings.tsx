import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import LanguagePicker from '../components/LanguagePicker';
import { useTheme } from '../contexts/ThemeContext';
import i18n from '../i18n';

export default function Settings() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const [language, setLanguage] = useState('en');
  const [dataSharing, setDataSharing] = useState(false);
  const [locationAccess, setLocationAccess] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) setLanguage(savedLanguage);
    } catch (error) {
      console.error('Failed to load settings');
    }
  };


  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    AsyncStorage.setItem('language', lang);
    if (['en', 'hi', 'es'].includes(lang)) {
      i18n.changeLanguage(lang);
    } else {
      i18n.changeLanguage('en');
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('userToken');
            router.replace('/login');
          } catch (error) {
            console.error('Failed to logout');
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  const openModal = (title: string, content: string) => {
    setModalContent({ title, content });
    setModalVisible(true);
  };

  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.flexContainer}>
      <LinearGradient colors={isDarkMode ? ['#1a1a1a', '#333'] : ['#2eacecff', '#4dd0e1']} style={styles.header}>
        <Text style={styles.headerTitle}>Suraksha Kavach</Text>
        <Text style={styles.headerSubtitle}>Settings</Text>
      </LinearGradient>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Theme</Text>
          <Card style={styles.sectionCard}>
            <View style={styles.cardContent}>
              <View style={styles.settingItem}>
                <Text style={styles.settingText}>Dark Mode</Text>
                <Switch value={isDarkMode} onValueChange={toggleTheme} />
              </View>
            </View>
          </Card>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          <Card style={styles.sectionCard}>
            <View style={styles.cardContent}>
              <LanguagePicker selectedValue={language} onValueChange={changeLanguage} />
            </View>
          </Card>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <Card style={styles.sectionCard}>
            <View style={styles.cardContent}>
              <View style={styles.settingItem}>
                <Text style={styles.settingText}>Data Sharing</Text>
                <Switch value={dataSharing} onValueChange={setDataSharing} />
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingText}>Location Access</Text>
                <Switch value={locationAccess} onValueChange={setLocationAccess} />
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingText}>Notifications</Text>
                <Switch value={notifications} onValueChange={setNotifications} />
              </View>
            </View>
          </Card>
        </View>

        {/* Content Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content</Text>
          <Card style={styles.sectionCard}>
            <View style={styles.cardContent}>
              <TouchableOpacity style={styles.languageOption} onPress={() => Alert.alert('Age Rating', 'Set to All Ages')}>
                <Text style={styles.languageText}>Age Rating: All Ages</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.languageOption} onPress={() => Alert.alert('Content Filters', 'Enable Safe Content')}>
                <Text style={styles.languageText}>Content Filters: Enabled</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Laws Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <Card style={styles.sectionCard}>
            <View style={styles.cardContent}>
              <TouchableOpacity style={styles.languageOption} onPress={() => openModal('Terms of Service', 'These are the terms of service for Suraksha Kavach. By using this app, you agree to the following terms:\n\n1. User Responsibilities: Users must provide accurate information.\n2. Data Usage: We collect data to improve services.\n3. Termination: We reserve the right to terminate accounts.\n\nFor full terms, contact support.')}>
                <View style={styles.settingItem}>
                  <Ionicons name="document-text-outline" size={20} color={isDarkMode ? '#fff' : '#333333'} />
                  <Text style={styles.languageText}>Terms of Service</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.languageOption} onPress={() => openModal('Privacy Policy', 'Privacy Policy for Suraksha Kavach:\n\n1. Data Collection: We collect location and usage data with consent.\n2. Data Sharing: Data is not shared with third parties without permission.\n3. Security: We use encryption to protect your data.\n4. Your Rights: You can request data deletion at any time.\n\nFor more details, see our full policy.')}>
                <View style={styles.settingItem}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={isDarkMode ? '#fff' : '#333333'} />
                  <Text style={styles.languageText}>Privacy Policy</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.languageOption} onPress={() => openModal('Legal Notices', 'Legal Notices:\n\n1. Copyright: All content is copyrighted by Suraksha Kavach.\n2. Disclaimer: The app is provided as-is without warranties.\n3. Changes: We may update notices without prior notice.\n\nContact legal@surakshakavach.com for inquiries.')}>
                <View style={styles.settingItem}>
                  <Ionicons name="information-circle-outline" size={20} color={isDarkMode ? '#fff' : '#333333'} />
                  <Text style={styles.languageText}>Legal Notices</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          <Card style={styles.sectionCard}>
            <View style={styles.cardFooter}>
              <Button variant="outline" style={styles.logoutButton} onPress={handleLogout}>
                Logout
              </Button>
            </View>
          </Card>
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalText}>{modalContent.content}</Text>
            </ScrollView>
            <Button onPress={() => setModalVisible(false)}>Close</Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: isDarkMode ? '#000' : '#E0F7FA',
  },
  header: {
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
    color: isDarkMode ? '#fff' : '#333333',
    marginBottom: 10,
  },
  sectionCard: {
    width: '100%',
  },
  cardContent: {
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#333333',
  },
  languageOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#555' : '#EEEEEE',
  },
  languageText: {
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#333333',
  },
  selected: {
    fontWeight: 'bold',
    color: '#157b4bff',
  },
  cardFooter: {
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    backgroundColor: '#16759dff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: isDarkMode ? '#333' : '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: isDarkMode ? '#fff' : '#333',
    marginBottom: 10,
  },
  modalScroll: {
    maxHeight: 300,
  },
  modalText: {
    fontSize: 16,
    color: isDarkMode ? '#fff' : '#333',
    lineHeight: 24,
  },
});
