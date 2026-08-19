/**
 * RootNavigator.tsx — Root stack navigator for TapShare.
 *
 * Checks first-run status on mount:
 *   - Fresh install (no profile in AsyncStorage): Boots into SplashScreen →
 *     GetStartedScreen → ProfileSetupScreen → QRCodeReadyScreen → MainTabs.
 *   - Existing install (profile found): Boots straight into MainTabs.
 */
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { SplashScreen } from '../screens/SplashScreen';
import { GetStartedScreen } from '../screens/GetStartedScreen';
import { ProfileSetupScreen } from '../screens/ProfileSetupScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { QRCodeReadyScreen } from '../screens/QRCodeReadyScreen';
import { QRCodeViewScreen } from '../screens/QRCodeViewScreen';
import { NFCTagSharingScreen } from '../screens/NFCTagSharingScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/theme';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  const { isInitialized, hasCompletedSetup } = useApp();

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.coral} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={hasCompletedSetup ? 'MainTabs' : 'Splash'}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0D0D0E' },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="QRCodeReady" component={QRCodeReadyScreen} />
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="QRCodeView" component={QRCodeViewScreen} />
        <Stack.Screen name="NFCTagSharing" component={NFCTagSharingScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Stats" component={StatsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
