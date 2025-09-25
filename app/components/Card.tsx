import React from 'react';
import { StyleSheet, View } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: any;
}

const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    elevation: 3,
    marginVertical: 10,
  },
});

export default Card;
