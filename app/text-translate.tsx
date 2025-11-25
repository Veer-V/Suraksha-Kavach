import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { translateText } from '../services/translationService';
import Button from './components/Button';
import Card from './components/Card';
import Input from './components/Input';
import LanguagePicker from './components/LanguagePicker';
import { useTheme } from './contexts/ThemeContext';

export default function TextTranslate() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [srcLang, setSrcLang] = useState('en');
  const [tgtLang, setTgtLang] = useState('hi');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter text to translate');
      return;
    }
    setLoading(true);
    try {
      console.log('Starting translation:', { text: inputText, srcLang, tgtLang });
      const result = await translateText(inputText, srcLang, tgtLang);
      console.log('Translation result:', result);
      setTranslatedText(result.translated);
    } catch (error) {
      console.error('Translation error:', error);
      Alert.alert('Error', 'Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const speakTranslated = () => {
    if (translatedText) {
      Speech.speak(translatedText, { language: tgtLang });
    }
  };

  const handleSwap = () => {
    const tempLang = srcLang;
    setSrcLang(tgtLang);
    setTgtLang(tempLang);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <View style={[styles.flexContainer, { backgroundColor: isDarkMode ? '#000' : '#E0F7FA' }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Text Translation</Text>
        <Text style={styles.headerSubtitle}>Translate text between languages</Text>
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
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Enter Text</Text>
            <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
              <View style={styles.cardContent}>
                <View style={styles.pickerRow}>
                  <View style={styles.pickerContainer}>
                    <Text style={[styles.pickerLabel, { color: isDarkMode ? '#FFF' : '#333333' }]}>From:</Text>
                    <LanguagePicker selectedValue={srcLang} onValueChange={setSrcLang} style={styles.picker} />
                  </View>
                  <Button variant="outline" style={styles.swapButton} onPress={handleSwap}>
                    ↔
                  </Button>
                  <View style={styles.pickerContainer}>
                    <Text style={[styles.pickerLabel, { color: isDarkMode ? '#FFF' : '#333333' }]}>To:</Text>
                    <LanguagePicker selectedValue={tgtLang} onValueChange={setTgtLang} style={styles.picker} />
                  </View>
                </View>
                <Input
                  placeholder="Enter text to translate"
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  style={styles.input}
                />
                <Button glow style={styles.translateButton} onPress={handleTranslate} disabled={loading}>
                  {loading ? 'Translating...' : 'Translate'}
                </Button>
              </View>
            </Card>
          </View>
        )}

        {/* Output Tab */}
        {activeTab === 'output' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Translation</Text>
            {translatedText ? (
              <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
                <View style={styles.cardContent}>
                  <Text style={[styles.translatedText, { color: isDarkMode ? '#FFF' : '#333333' }]}>{translatedText}</Text>
                  <Button variant="outline" style={styles.speakButton} onPress={speakTranslated}>
                    Speak Translation
                  </Button>
                </View>
              </Card>
            ) : (
              <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
                <View style={styles.cardContent}>
                  <Text style={[styles.noOutputText, { color: isDarkMode ? '#CCC' : '#666' }]}>
                    No translation available. Switch to Input tab and enter text to translate.
                  </Text>
                </View>
              </Card>
            )}
          </View>
        )}

       
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
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  input: {
    height: 100,
    textAlignVertical: 'top',
  },
  translateButton: {
    width: '100%',
    marginTop: 10,
  },
  speakButton: {
    width: '100%',
  },
  backButton: {
    width: '100%',
  },
  swapButton: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outputContainer: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'flex-start',
    padding: 10,
  },
  outputText: {
    flex: 1,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
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
  translatedText: {
    fontSize: 16,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    color: '#333333',
  },
  noOutputText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});
