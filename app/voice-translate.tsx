import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { transcribeAudio, translateText } from '../services/translationService';
import Button from './components/Button';
import Card from './components/Card';
import LanguagePicker from './components/LanguagePicker';
import { useTheme } from './contexts/ThemeContext';

export default function VoiceTranslate() {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcribedText, setTranscribedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [srcLang, setSrcLang] = useState('en');
  const [tgtLang, setTgtLang] = useState('hi');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const router = useRouter();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    Audio.requestPermissionsAsync();
  }, []);

  const startRecording = async () => {
    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);

    if (uri) {
      processAudio(uri);
    }
  };

  const processAudio = async (uri: string) => {
    setLoading(true);
    try {
      // Convert to base64
      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Transcribe
      const transcription = await transcribeAudio(base64);
      setTranscribedText(transcription);

      // Translate
      const { translated } = await translateText(transcription, srcLang, tgtLang);
      setTranslatedText(translated);

      // Speak
      Speech.speak(translated, { language: tgtLang });
    } catch (error) {
      Alert.alert('Error', 'Processing failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const speakAgain = () => {
    if (translatedText) {
      Speech.speak(translatedText, { language: tgtLang });
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <View style={[styles.flexContainer, { backgroundColor: isDarkMode ? '#000' : '#E0F7FA' }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voice Translation</Text>
        <Text style={styles.headerSubtitle}>Speak to translate in real-time</Text>
      </View>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Tab Buttons */}
        <View style={styles.tabContainer}>
          <Button
            glow={activeTab === 'input'}
            variant="outline"
            style={styles.tabButton}
            onPress={() => handleTabChange('input')}
          >
            Input
          </Button>
          <Button
            glow={activeTab === 'output'}
            variant="outline"
            style={styles.tabButton}
            onPress={() => handleTabChange('output')}
          >
            Output
          </Button>
        </View>

        {/* Input Tab */}
        {activeTab === 'input' && (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Settings</Text>
              <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
                <View style={styles.cardContent}>
                  <View style={styles.pickerRow}>
                    <View style={styles.pickerContainer}>
                      <Text style={[styles.pickerLabel, { color: isDarkMode ? '#FFF' : '#333333' }]}>Speak in:</Text>
                      <LanguagePicker selectedValue={srcLang} onValueChange={setSrcLang} style={styles.picker} />
                    </View>
                    <View style={styles.pickerContainer}>
                      <Text style={[styles.pickerLabel, { color: isDarkMode ? '#FFF' : '#333333' }]}>Translate to:</Text>
                      <LanguagePicker selectedValue={tgtLang} onValueChange={setTgtLang} style={styles.picker} />
                    </View>
                  </View>
                </View>
              </Card>
            </View>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Recording</Text>
              <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
                <View style={styles.cardContent}>
                  <Text style={[styles.instruction, { color: isDarkMode ? '#CCC' : '#666666' }]}>
                    Press and hold to speak, release to translate.
                  </Text>
                  <Button
                    glow
                    style={[styles.recordButton, isRecording && styles.recordingButton]}
                    onPress={isRecording ? stopRecording : startRecording}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button>
                </View>
              </Card>
            </View>
            {transcribedText ? (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Transcription</Text>
                <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
                  <View style={styles.cardContent}>
                    <Text style={[styles.transcribedText, { color: isDarkMode ? '#FFF' : '#333333' }]}>{transcribedText}</Text>
                  </View>
                </Card>
              </View>
            ) : null}
          </>
        )}

        {/* Output Tab */}
        {activeTab === 'output' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Listen to Translation</Text>
            {translatedText ? (
              <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
                <View style={styles.cardContent}>
                  <Text style={[styles.translatedText, { color: isDarkMode ? '#FFF' : '#333333' }]}>{translatedText}</Text>
                  <Button variant="outline" style={styles.speakButton} onPress={speakAgain}>
                    Listen Again
                  </Button>
                </View>
              </Card>
            ) : (
              <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
                <View style={styles.cardContent}>
                  <Text style={[styles.noOutputText, { color: isDarkMode ? '#CCC' : '#666' }]}>
                    No translation available. Switch to Input tab and record some speech.
                  </Text>
                </View>
              </Card>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Button variant="outline" style={styles.backButton} onPress={() => router.push('/(tabs)/translation')}>
            Back to Translation
          </Button>
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333333',
  },
  picker: {
    height: 50,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color: '#666666',
  },
  recordButton: {
    width: '100%',
    backgroundColor: '#28A745',
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
  },
  transcribedText: {
    fontSize: 16,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    color: '#333333',
  },
  translatedText: {
    fontSize: 16,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    color: '#333333',
  },
  speakButton: {
    width: '100%',
  },
  backButton: {
    width: '100%',
  },
  noOutputText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});
