import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';

const TABS = [
  { name: 'services', icon: 'build-circle', labelKey: 'services' },
  { name: 'dashboard', icon: 'home-filled', labelKey: 'home' },
  { name: 'notifications', icon: 'notifications-none', labelKey: 'notifications' },
  { name: 'settings', icon: 'settings', labelKey: 'settings' },
  //{ name: 'profile', icon: 'person', labelKey: 'profile' },
];

export default function TabLayout() {
  const { t } = useTranslation();

  return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#2eacec',
          tabBarInactiveTintColor: '#888',
        }}
      >
        {TABS.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name={tab.icon as any} size={size} color={color} />
              ),
              tabBarLabel: ({ focused }) => (
                <Text
                  style={{
                    color: focused ? '#2eacec' : '#888',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}
                >
                  {t(tab.labelKey)}
                </Text>
              ),
            }}
          />
        ))}
      </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 10,
    paddingTop: 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 10, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
