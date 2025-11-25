import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  location: { lat: number; lng: number; city: string; type?: string };
  active: boolean;
  lastSeen: string;
}

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'update';
}

interface AdminContextType {
  users: User[];
  notifications: Notification[];
  sendAlert: (message: string, type?: 'alert' | 'update') => Promise<void>;
  getUserCount: () => number;
  getActiveUsers: () => number;
  getLocationTypes: () => { type: string; count: number }[];
  loadUsers: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadUsers();
    loadNotifications();
  }, []);

  const loadUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem('adminUsers');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        // Mock initial users
        const mockUsers: User[] = [
          {
            id: '1',
            email: 'user1@example.com',
            location: { lat: 28.6139, lng: 77.2090, city: 'New Delhi', type: 'Urban' },
            active: true,
            lastSeen: new Date().toISOString(),
          },
          {
            id: '2',
            email: 'user2@example.com',
            location: { lat: 18.5204, lng: 73.8567, city: 'Pune', type: 'Suburban' },
            active: true,
            lastSeen: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          },
          {
            id: '3',
            email: 'user3@example.com',
            location: { lat: 19.0760, lng: 72.8777, city: 'Mumbai', type: 'Urban' },
            active: false,
            lastSeen: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
          {
            id: '4',
            email: 'user4@example.com',
            location: { lat: 12.9716, lng: 77.5946, city: 'Bangalore', type: 'Tech Hub' },
            active: true,
            lastSeen: new Date().toISOString(),
          },
        ];
        setUsers(mockUsers);
        await AsyncStorage.setItem('adminUsers', JSON.stringify(mockUsers));
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      // Fallback to mock
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'user1@example.com',
          location: { lat: 28.6139, lng: 77.2090, city: 'New Delhi', type: 'Urban' },
          active: true,
          lastSeen: new Date().toISOString(),
        },
      ];
      setUsers(mockUsers);
    }
  };

  const loadNotifications = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem('adminNotifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const sendAlert = async (message: string, type: 'alert' | 'update' = 'alert') => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Admin Alert',
      message,
      timestamp: new Date().toISOString(),
      isRead: false,
      type,
    };
    const updatedNotifications = [...notifications, newNotification];
    setNotifications(updatedNotifications);
    try {
      await AsyncStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
      // Simulate broadcasting to users by also storing in global notifications for user side
      const globalNotifs = await AsyncStorage.getItem('globalNotifications') || '[]';
      const parsed = JSON.parse(globalNotifs);
      await AsyncStorage.setItem('globalNotifications', JSON.stringify([...parsed, newNotification]));
    } catch (error) {
      console.error('Failed to save alert:', error);
    }
  };

  const getUserCount = () => users.length;

  const getActiveUsers = () => users.filter(user => user.active).length;

  const getLocationTypes = () => {
    const types = users.reduce((acc, user) => {
      const type = user.location.type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(types).map(([type, count]) => ({ type, count }));
  };

  const value: AdminContextType = {
    users,
    notifications,
    sendAlert,
    getUserCount,
    getActiveUsers,
    getLocationTypes,
    loadUsers,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
