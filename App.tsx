/**
 * App.tsx — Root entry point for TapShare.
 *
 * Provider hierarchy (outermost → innermost):
 *   ErrorBoundary → SafeAreaProvider → AppProvider → StatusBar + RootNavigator
 *
 * - ErrorBoundary: Catches unhandled React errors and shows a retry screen.
 * - SafeAreaProvider: Supplies safe-area insets for notch/home-bar-aware layouts.
 * - AppProvider: Global state (user profile, live scan count, NFC state).
 * - RootNavigator: Stack navigator containing all screens and the bottom tab bar.
 */
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider style={{ backgroundColor: '#0D0D0E' }}>
        <AppProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </AppProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
