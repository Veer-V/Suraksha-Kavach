import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import { useTheme } from '../contexts/ThemeContext';

export default function Translation() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  return (
    <View style={[styles.flexContainer, { backgroundColor: isDarkMode ? '#000' : '#E0F7FA' }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Translation Services</Text>
        <Text style={styles.headerSubtitle}>AI-Powered Multilingual Support</Text>
      </View>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Choose Translation Mode</Text>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
            <View style={styles.cardContent}>
              <View style={styles.translationOptions}>
                <View style={styles.option}>
                  <Text style={[styles.optionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Text Translation</Text>
                  <Text style={[styles.optionDesc, { color: isDarkMode ? '#CCC' : '#666666' }]}>Type text to translate between languages</Text>
                  <Button glow style={styles.optionButton} onPress={() => router.push('/text-translate')}>
                    Start Text Translation
                  </Button>
                </View>
                <View style={styles.option}>
                  <Text style={[styles.optionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Voice Translation</Text>
                  <Text style={[styles.optionDesc, { color: isDarkMode ? '#CCC' : '#666666' }]}>Speak to translate in real-time</Text>
                  <Button glow style={styles.optionButton} onPress={() => router.push('/voice-translate')}>
                    Start Voice Translation
                  </Button>
                </View>
                <View style={styles.option}>
                  <Text style={[styles.optionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Camera Translation</Text>
                  <Text style={[styles.optionDesc, { color: isDarkMode ? '#CCC' : '#666666' }]}>Capture image to extract and translate text</Text>
                  <Button glow style={styles.optionButton} onPress={() => router.push('/camera-translate')}>
                    Start Camera Translation
                  </Button>
                </View>
              </View>
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
  translationOptions: {
    marginBottom: 10,
  },
  option: {
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  optionDesc: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  optionButton: {
    width: '100%',
  },
});
