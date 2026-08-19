import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../constants/theme';
import { DualCardLogo } from '../components/DualCardLogo';
import { useApp } from '../context/AppContext';

export const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isInitialized, hasCompletedSetup } = useApp();

  useEffect(() => {
    if (!isInitialized) return;

    const timer = setTimeout(() => {
      if (hasCompletedSetup) {
        navigation.replace('MainTabs');
      } else {
        navigation.replace('GetStarted');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [isInitialized, hasCompletedSetup]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.responsiveWrapper}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  responsiveWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
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
