import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { checkServerConnectivity } from '../app/lib/api';

interface ServerStatusIndicatorProps {
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
}

const ServerStatusIndicator: React.FC<ServerStatusIndicatorProps> = ({ 
  size = 'medium',
  onPress
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null); // null = unknown, true = connected, false = disconnected
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkServerStatus = async () => {
    try {
      const isConnected = await checkServerConnectivity();
      setIsConnected(isConnected);
    } catch (error) {
      console.error('Server connection check failed:', error);
      setIsConnected(false);
    } finally {
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    // Check server status immediately on mount
    checkServerStatus();

    // Set up periodic checks every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Determine styles based on size prop
  const sizeStyles = {
    small: {
      indicatorSize: 8,
      fontSize: 10,
    },
    medium: {
      indicatorSize: 12,
      fontSize: 12,
    },
    large: {
      indicatorSize: 16,
      fontSize: 14,
    },
  }[size];

  const { indicatorSize, fontSize } = sizeStyles;

  // Determine colors and text based on connection status
  let backgroundColor, borderColor, textColor, statusText;
  
  if (isConnected === null) {
    backgroundColor = '#e5e7eb'; // gray-200
    borderColor = '#d1d5db'; // gray-300
    textColor = '#6b7280'; // gray-500
    statusText = 'Checking...';
  } else if (isConnected) {
    backgroundColor = '#dcfce7'; // green-100
    borderColor = '#86efac'; // green-300
    textColor = '#16a34a'; // green-60
    statusText = 'Connected';
  } else {
    backgroundColor = '#fee2e2'; // red-100
    borderColor = '#fca5a5'; // red-300
    textColor = '#dc2626'; // red-600
    statusText = 'Disconnected';
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 6,
      borderRadius: 12,
    },
    indicator: {
      width: indicatorSize,
      height: indicatorSize,
      borderRadius: indicatorSize / 2,
      backgroundColor,
      borderColor,
      borderWidth: 1,
      marginRight: 6,
    },
    text: {
      fontSize,
      color: textColor,
      fontWeight: '500',
    },
  });

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // If no onPress provided, just refresh the status
      checkServerStatus();
    }
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container 
      style={[styles.container, { backgroundColor: '#f9fafb', borderColor: '#e5e7eb', borderWidth: 1 }]}
      onPress={handlePress}
    >
      <View style={styles.indicator} />
      <Text style={styles.text}>{statusText}</Text>
      {lastChecked && (
        <Text style={[styles.text, { fontSize: fontSize * 0.8, opacity: 0.7, marginLeft: 4 }]}>
          ({Math.round((Date.now() - lastChecked.getTime()) / 1000)}s)
        </Text>
      )}
    </Container>
  );
};

export default ServerStatusIndicator;