import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { DualCardLogo } from '../components/DualCardLogo';
import { useApp } from '../context/AppContext';

export const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isLoggedIn, hasCompletedSetup } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        if (hasCompletedSetup) {
          navigation.replace('MainTabs');
        } else {
          navigation.replace('ProfileSetup');
        }
      } else {
        navigation.replace('GetStarted');
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [isLoggedIn, hasCompletedSetup]);

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <DualCardLogo size={110} />
        <Text style={styles.title}>TapShare</Text>

        <View style={styles.taglineRow}>
          <Text style={styles.taglineText}>Share</Text>
          <View style={[styles.dot, { backgroundColor: COLORS.coral }]} />
          <Text style={styles.taglineText}>Connect</Text>
          <View style={[styles.dot, { backgroundColor: COLORS.periwinkle }]} />
          <Text style={styles.taglineText}>Grow</Text>
          <View style={[styles.dot, { backgroundColor: COLORS.coral }]} />
        </View>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.coral} style={styles.spinner} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.textWhite,
    letterSpacing: -1,
    marginTop: SPACING.lg,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  taglineText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
  },
  footer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  spinner: {
    marginBottom: 8,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
});
