import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { extractTextFromImage, translateText } from '../services/translationService';
import Button from './components/Button';
import Card from './components/Card';
import LanguagePicker from './components/LanguagePicker';
import { useTheme } from './contexts/ThemeContext';

export default function CameraTranslate() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [srcLang, setSrcLang] = useState('en');
  const [tgtLang, setTgtLang] = useState('hi');
  const [loading, setLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { isDarkMode } = useTheme();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.permissionContainer, { backgroundColor: isDarkMode ? '#000' : '#E0F7FA' }]}>
        <Text style={[styles.message, { color: isDarkMode ? '#FFF' : '#333' }]}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission}>Grant Permission</Button>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true });
        if (photo.base64) {
          setCapturedImage(photo.uri);
          processImage(photo.base64);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const processImage = async (base64: string) => {
    setLoading(true);
    try {
      // OCR
      const ocrText = await extractTextFromImage(base64);
      setExtractedText(ocrText);

      // Translate
      const { translated } = await translateText(ocrText, srcLang, tgtLang);
      setTranslatedText(translated);
      setShowTranslation(true);
    } catch (error) {
      Alert.alert('Error', 'Processing failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.flexContainer, { backgroundColor: isDarkMode ? '#000' : '#E0F7FA' }]}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Camera Translation</Text>
        <Text style={styles.headerSubtitle}>Capture image to extract and translate text</Text>
      </View>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Settings</Text>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>

            <View style={styles.cardContent}>
              <View style={styles.pickerRow}>
                <View style={styles.pickerContainer}>
                  <Text style={[styles.pickerLabel, { color: isDarkMode ? '#FFF' : '#333333' }]}>Source Language:</Text>
                  <LanguagePicker selectedValue={srcLang} onValueChange={setSrcLang} style={styles.picker} />
                </View>
                <View style={styles.pickerContainer}>
                  <Text style={[styles.pickerLabel, { color: isDarkMode ? '#FFF' : '#333333' }]}>Target Language:</Text>
                  <LanguagePicker selectedValue={tgtLang} onValueChange={setTgtLang} style={styles.picker} />
                </View>
              </View>
            </View>
          </Card>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Camera</Text>
          <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>

            <View style={styles.cardContent}>
              <CameraView style={styles.camera} ref={cameraRef}>
                <View style={styles.overlay} onStartShouldSetResponder={() => true} onMoveShouldSetResponder={() => true}>
                  <Text style={styles.overlayText}>Point camera at text to translate</Text>
                  <Button glow style={styles.captureButton} onPress={takePicture} disabled={loading}>
                    {loading ? 'Processing...' : 'Capture & Translate'}
                  </Button>
                </View>
              </CameraView>
            </View>
          </Card>
        </View>
        {capturedImage && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Captured Image</Text>
            <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>

              <View style={styles.cardContent}>
                <Image source={{ uri: capturedImage }} style={styles.imagePreview} />
              </View>
            </Card>
          </View>
        )}
        {extractedText ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Extracted Text</Text>
            <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>

              <View style={styles.cardContent}>
                <Text style={[styles.extractedText, { color: isDarkMode ? '#FFF' : '#333333' }]}>{extractedText}</Text>
              </View>
            </Card>
          </View>
        ) : null}
        {translatedText ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#333333' }]}>Translation</Text>
            <Card style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>

              <View style={styles.cardContent}>
                <Text style={[styles.translatedText, { color: isDarkMode ? '#FFF' : '#333333' }]}>{translatedText}</Text>
              </View>
            </Card>
          </View>
        ) : null}
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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  camera: {
    height: 300,
    borderRadius: 8,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  overlayText: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  captureButton: {
    width: '80%',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  extractedText: {
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
  backButton: {
    width: '100%',
  },
});
