import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface DualCardLogoProps {
  size?: number; // default 80
}

export const DualCardLogo: React.FC<DualCardLogoProps> = ({ size = 100 }) => {
  const cardSize = size;
  const iconSize = size * 0.55;

  return (
    <View style={[styles.container, { width: cardSize * 1.3, height: cardSize * 1.3 }]}>
      {/* Background Periwinkle Card - rotated slightly */}
      <View
        style={[
          styles.backCard,
          {
            width: cardSize,
            height: cardSize,
            borderRadius: cardSize * 0.28,
            right: 0,
            bottom: cardSize * 0.05,
            transform: [{ rotate: '12deg' }],
          },
        ]}
      />

      {/* Foreground Coral Card */}
      <View
        style={[
          styles.frontCard,
          {
            width: cardSize,
            height: cardSize,
            borderRadius: cardSize * 0.28,
            left: 0,
            top: 0,
          },
        ]}
      >
        <MaterialCommunityIcons name="nfc" size={iconSize} color="#FFFFFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 12,
  },
  backCard: {
    position: 'absolute',
    backgroundColor: COLORS.periwinkle,
  },
  frontCard: {
    position: 'absolute',
    backgroundColor: COLORS.coral,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});
