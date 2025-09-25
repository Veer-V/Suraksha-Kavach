import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      settings: 'Settings',
      theme: 'Theme',
      darkMode: 'Dark Mode',
      language: 'Language',
      english: 'English',
      hindi: 'Hindi',
      spanish: 'Spanish',
      logout: 'Logout',
      logoutConfirm: 'Are you sure you want to logout?',
      cancel: 'Cancel',
      confirmLogout: 'Logout',
      failedToLoad: 'Failed to load settings',
      failedToLogout: 'Failed to logout',
      surakshaKavach: 'Suraksha Kavach',
      home: 'Home',
      services: 'Services',
      profile: 'Profile',
      welcomeText: 'Join thousands of travelers who stay protected with our AI-powered safety monitoring system.',
      createAccount: 'Create Account',
      signIn: 'Sign In',
      privacy: 'By continuing, you agree to our Privacy Policy and Terms of Service',
      welcomeBack: 'Welcome Back',
      signInSecurely: 'Sign in to your secure account',
      emailAddress: 'Email Address',
      password: 'Password',
      enterEmail: 'Enter your email',
      enterPassword: 'Enter your password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot Password?',
      backToWelcome: 'Back to Welcome',
      error: 'Error',
      pleaseEnter: 'Please enter your email and password',
      loginFailed: 'Login failed',
      // Add more translations as needed for other screens
    },
  },
  hi: {
    translation: {
      settings: 'सेटिंग्स',
      theme: 'थीम',
      darkMode: 'डार्क मोड',
      language: 'भाषा',
      english: 'अंग्रेजी',
      hindi: 'हिंदी',
      spanish: 'स्पेनिश',
      logout: 'लॉगआउट',
      logoutConfirm: 'क्या आप वाकई लॉगआउट करना चाहते हैं?',
      cancel: 'रद्द करें',
      confirmLogout: 'लॉगआउट',
      failedToLoad: 'सेटिंग्स लोड करने में विफल',
      failedToLogout: 'लॉगआउट करने में विफल',
      surakshaKavach: 'सुरक्षा कवच',
      home: 'होम',
      services: 'सेवाएं',
      profile: 'प्रोफ़ाइल',
      welcomeText: 'हजारों यात्रियों में शामिल हों जो हमारे AI-संचालित सुरक्षा निगरानी प्रणाली के साथ सुरक्षित रहते हैं।',
      createAccount: 'खाता बनाएं',
      signIn: 'साइन इन',
      privacy: 'जारी रखने के लिए, आप हमारी गोपनीयता नीति और सेवा की शर्तों से सहमत हैं',
      welcomeBack: 'वापसी पर स्वागत',
      signInSecurely: 'अपने सुरक्षित खाते में साइन इन करें',
      emailAddress: 'ईमेल पता',
      password: 'पासवर्ड',
      enterEmail: 'अपना ईमेल दर्ज करें',
      enterPassword: 'अपना पासवर्ड दर्ज करें',
      rememberMe: 'मुझे याद रखें',
      forgotPassword: 'पासवर्ड भूल गए?',
      backToWelcome: 'वेलकम पर वापस जाएं',
      error: 'त्रुटि',
      pleaseEnter: 'कृपया अपना ईमेल और पासवर्ड दर्ज करें',
      loginFailed: 'लॉगिन विफल',
      // Add more translations as needed
    },
  },
  es: {
    translation: {
      settings: 'Configuraciones',
      theme: 'Tema',
      darkMode: 'Modo Oscuro',
      language: 'Idioma',
      english: 'Inglés',
      hindi: 'Hindi',
      spanish: 'Español',
      logout: 'Cerrar Sesión',
      logoutConfirm: '¿Estás seguro de que quieres cerrar sesión?',
      cancel: 'Cancelar',
      confirmLogout: 'Cerrar Sesión',
      failedToLoad: 'Error al cargar configuraciones',
      failedToLogout: 'Error al cerrar sesión',
      surakshaKavach: 'Escudo de Seguridad',
      home: 'Inicio',
      services: 'Servicios',
      profile: 'Perfil',
      welcomeText: 'Únete a miles de viajeros que se mantienen protegidos con nuestro sistema de monitoreo de seguridad impulsado por IA.',
      createAccount: 'Crear Cuenta',
      signIn: 'Iniciar Sesión',
      privacy: 'Al continuar, aceptas nuestra Política de Privacidad y Términos de Servicio',
      welcomeBack: 'Bienvenido de Vuelta',
      signInSecurely: 'Inicia sesión en tu cuenta segura',
      emailAddress: 'Dirección de Correo Electrónico',
      password: 'Contraseña',
      enterEmail: 'Ingresa tu correo electrónico',
      enterPassword: 'Ingresa tu contraseña',
      rememberMe: 'Recuérdame',
      forgotPassword: '¿Olvidaste tu Contraseña?',
      backToWelcome: 'Volver a Bienvenida',
      error: 'Error',
      pleaseEnter: 'Por favor ingresa tu correo electrónico y contraseña',
      loginFailed: 'Inicio de sesión fallido',
      // Add more translations as needed
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

// Function to load saved language
export const loadLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi' || savedLanguage === 'es')) {
      i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.error('Failed to load language');
  }
};

// Call on app start
loadLanguage();
