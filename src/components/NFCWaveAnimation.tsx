import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export const NFCWaveAnimation: React.FC<{ active?: boolean }> = ({ active = true }) => {
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (active) {
      const createPulseAnimation = (anim: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, {
              toValue: 1,
              duration: 2000,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const anim1 = createPulseAnimation(pulse1, 0);
      const anim2 = createPulseAnimation(pulse2, 1000);

      anim1.start();
      anim2.start();

      return () => {
        anim1.stop();
        anim2.stop();
      };
    }
  }, [active]);

  const getWaveStyle = (anim: Animated.Value) => ({
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.8],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.6, 0.3, 0],
    }),
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.waveCircle, getWaveStyle(pulse1)]} />
      <Animated.View style={[styles.waveCircle, getWaveStyle(pulse2)]} />
      <View style={styles.mainCircle}>
        <MaterialCommunityIcons name="cellphone-nfc" size={80} color="#FFFFFF" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  waveCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: COLORS.periwinkle,
  },
  mainCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.periwinkle,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.periwinkle,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
});
