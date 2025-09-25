import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import { useTheme } from '../contexts/ThemeContext';

export default function Dashboard() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const handleCall = (number: string) => {
    Alert.alert('Call', `Calling ${number}`);
    // In production, use Linking to call
  };

  return (
    <View style={[styles.flexContainer, { backgroundColor: isDarkMode ? '#000' : '#E0F7FA' }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Suraksha Kavach</Text>
        <Text style={styles.headerSubtitle}>Active Protection Enabled</Text>
      </View>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Current Location Safety Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Current Location Safety</Text>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>New Delhi, India</Text>
              <Text style={[styles.cardDesc, { color: isDarkMode ? '#CCC' : '#666666' }]}>Last updated: 2 minutes ago</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.riskIndicator}>
                <View style={styles.greenDot} />
                <Text style={[styles.riskText, { color: isDarkMode ? '#FFF' : '#333333' }]}>Low risk area</Text>
              </View>
              <Text style={[styles.riskDetails, { color: isDarkMode ? '#CCC' : '#666666' }]}>
                This area has low crime rates. Emergency response time: approximately 8 minutes.
              </Text>
            </View>
          </Card>
        </View>

        {/* Emergency Contacts Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Emergency Contacts</Text>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
            <View style={styles.cardContent}>
              <View style={styles.contactList}>
                <View style={styles.contactItem}>
                  <View>
                    <Text style={[styles.contactTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Local Police</Text>
                    <Text style={[styles.contactNumber, { color: isDarkMode ? '#CCC' : '#666666' }]}>100</Text>
                  </View>
                  <Button variant="outline" style={styles.callButton} onPress={() => handleCall('100')}>
                    Call
                  </Button>
                </View>
                <View style={styles.contactItem}>
                  <View>
                    <Text style={[styles.contactTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Ambulance</Text>
                    <Text style={[styles.contactNumber, { color: isDarkMode ? '#CCC' : '#666666' }]}>108</Text>
                  </View>
                  <Button variant="outline" style={styles.callButton} onPress={() => handleCall('108')}>
                    Call
                  </Button>
                </View>
                <View style={styles.contactItem}>
                  <View>
                    <Text style={[styles.contactTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Emergency Contact</Text>
                    <Text style={[styles.contactNumber, { color: isDarkMode ? '#CCC' : '#666666' }]}>Mom (+1 555-0123)</Text>
                  </View>
                  <Button variant="outline" style={styles.callButton} onPress={() => handleCall('+15550123')}>
                    Call
                  </Button>
                </View>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <Button variant="outline" style={styles.fullButton}>
                Add Emergency Contact
              </Button>
            </View>
          </Card>
        </View>

        {/* AI Translation Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>AI Translation</Text>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Real-time Translator</Text>
              <Text style={[styles.cardDesc, { color: isDarkMode ? '#CCC' : '#666666' }]}>Speak or type to translate</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.translationButtons}>
                <Button variant="outline" style={styles.translationButton} onPress={() => router.push('/voice-translate')}>
                  Speak
                </Button>
                <Button variant="outline" style={styles.translationButton} onPress={() => router.push('/text-translate')}>
                  Type
                </Button>
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  cardDesc: {
    fontSize: 14,
    color: '#666666',
  },
  cardContent: {
    marginBottom: 10,
  },
  riskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#28A745',
    marginRight: 10,
  },
  riskText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  riskDetails: {
    fontSize: 14,
    color: '#666666',
  },
  contactList: {
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  contactNumber: {
    fontSize: 14,
    color: '#666666',
  },
  callButton: {
    minWidth: 80,
  },
  cardFooter: {
    alignItems: 'center',
  },
  fullButton: {
    width: '100%',
  },
  translationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  translationButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  translationButtonText: {
    fontSize: 16,
  },
});
