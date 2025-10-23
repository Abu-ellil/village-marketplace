import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors } from '../../theme/colors';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  noPadding?: boolean;
  className?: string;
}

export default function Card({ children, noPadding, className = '', ...props }: CardProps) {
  return (
    <View
      className={`bg-white rounded-2xl overflow-hidden ${className}`}
      style={[
        styles.shadow,
        !noPadding && { padding: 16 },
        props.style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: colors.neutral[900],
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});