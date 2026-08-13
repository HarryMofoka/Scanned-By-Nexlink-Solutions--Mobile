import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider style={{ backgroundColor: '#0D0D0E' }}>
      <AppProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
