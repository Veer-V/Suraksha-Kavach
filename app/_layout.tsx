import { Stack } from 'expo-router';
import { AdminProvider } from './contexts/AdminContext';
import { ThemeProvider } from './contexts/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Tab screens */}
          <Stack.Screen name="(tabs)" />

          {/* Other screens that should NOT be in the tab bar */}
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="admin-dashboard" />
          <Stack.Screen name="camera-translate" />
          <Stack.Screen name="location-search" />
          <Stack.Screen name="text-translate" />
          <Stack.Screen name="voice-translate" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="permissions" />
          <Stack.Screen name="emergency-contacts" />
        </Stack>
      </AdminProvider>
    </ThemeProvider>
  );
}
