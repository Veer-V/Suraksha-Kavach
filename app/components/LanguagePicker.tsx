import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface LanguagePickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  style?: any;
}

const languages = [
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Arabic', value: 'ar' },
  { label: 'Chinese (Simplified)', value: 'zh' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Russian', value: 'ru' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Italian', value: 'it' },
  { label: 'Dutch', value: 'nl' },
  { label: 'Swedish', value: 'sv' },
  { label: 'Danish', value: 'da' },
  { label: 'Norwegian', value: 'no' },
  { label: 'Finnish', value: 'fi' },
  { label: 'Polish', value: 'pl' },
  { label: 'Czech', value: 'cs' },
  { label: 'Hungarian', value: 'hu' },
  { label: 'Romanian', value: 'ro' },
  { label: 'Bulgarian', value: 'bg' },
  { label: 'Greek', value: 'el' },
  { label: 'Turkish', value: 'tr' },
  { label: 'Hebrew', value: 'he' },
  { label: 'Thai', value: 'th' },
  { label: 'Vietnamese', value: 'vi' },
  { label: 'Indonesian', value: 'id' },
  { label: 'Malay', value: 'ms' },
  { label: 'Filipino', value: 'tl' },
  { label: 'Swahili', value: 'sw' },
  { label: 'Afrikaans', value: 'af' },
  { label: 'Amharic', value: 'am' },
  { label: 'Azerbaijani', value: 'az' },
  { label: 'Belarusian', value: 'be' },
  { label: 'Bengali', value: 'bn' },
  { label: 'Bosnian', value: 'bs' },
  { label: 'Catalan', value: 'ca' },
  { label: 'Cebuano', value: 'ceb' },
  { label: 'Welsh', value: 'cy' },
  { label: 'Estonian', value: 'et' },
  { label: 'Persian', value: 'fa' },
  { label: 'Fulah', value: 'ff' },
  { label: 'Irish', value: 'ga' },
  { label: 'Scottish Gaelic', value: 'gd' },
  { label: 'Galician', value: 'gl' },
  { label: 'Gujarati', value: 'gu' },
  { label: 'Hausa', value: 'ha' },
  { label: 'Croatian', value: 'hr' },
  { label: 'Haitian Creole', value: 'ht' },
  { label: 'Armenian', value: 'hy' },
  { label: 'Igbo', value: 'ig' },
  { label: 'Iloko', value: 'ilo' },
  { label: 'Icelandic', value: 'is' },
  { label: 'Javanese', value: 'jv' },
  { label: 'Georgian', value: 'ka' },
  { label: 'Kazakh', value: 'kk' },
  { label: 'Khmer', value: 'km' },
  { label: 'Kannada', value: 'kn' },
  { label: 'Luxembourgish', value: 'lb' },
  { label: 'Ganda', value: 'lg' },
  { label: 'Lingala', value: 'ln' },
  { label: 'Lao', value: 'lo' },
  { label: 'Lithuanian', value: 'lt' },
  { label: 'Latvian', value: 'lv' },
  { label: 'Malagasy', value: 'mg' },
  { label: 'Macedonian', value: 'mk' },
  { label: 'Malayalam', value: 'ml' },
  { label: 'Mongolian', value: 'mn' },
  { label: 'Marathi', value: 'mr' },
  { label: 'Burmese', value: 'my' },
  { label: 'Nepali', value: 'ne' },
  { label: 'Northern Sotho', value: 'ns' },
  { label: 'Occitan', value: 'oc' },
  { label: 'Oriya', value: 'or' },
  { label: 'Punjabi', value: 'pa' },
  { label: 'Pashto', value: 'ps' },
  { label: 'Quechua', value: 'qu' },
  { label: 'Sinhala', value: 'si' },
  { label: 'Slovak', value: 'sk' },
  { label: 'Slovenian', value: 'sl' },
  { label: 'Somali', value: 'so' },
  { label: 'Albanian', value: 'sq' },
  { label: 'Serbian', value: 'sr' },
  { label: 'Swati', value: 'ss' },
  { label: 'Sundanese', value: 'su' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Telugu', value: 'te' },
  { label: 'Tswana', value: 'tn' },
  { label: 'Ukrainian', value: 'uk' },
  { label: 'Urdu', value: 'ur' },
  { label: 'Uzbek', value: 'uz' },
  { label: 'Wolof', value: 'wo' },
  { label: 'Xhosa', value: 'xh' },
];

const LanguagePicker: React.FC<LanguagePickerProps> = ({ selectedValue, onValueChange, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        {languages.map((lang) => (
          <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
});

export default LanguagePicker;
