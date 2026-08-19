/**
 * RootNavigator.tsx — Root stack navigator for TapShare.
 *
 * Contains all screens in a single stack. The initial route is 'MainTabs'
 * (the bottom tab navigator with Dashboard, QR Code, Stats, and Settings),
 * since this is a single-user app that doesn't require login.
 *
 * Onboarding screens (Splash, GetStarted, Login, ProfileSetup) are still
 * registered but not the initial route — they can be navigated to if
 * multi-user onboarding is added in the future.
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { SplashScreen } from '../screens/SplashScreen';
import { GetStartedScreen } from '../screens/GetStartedScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ProfileSetupScreen } from '../screens/ProfileSetupScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { QRCodeReadyScreen } from '../screens/QRCodeReadyScreen';
import { QRCodeViewScreen } from '../screens/QRCodeViewScreen';
import { NFCTagSharingScreen } from '../screens/NFCTagSharingScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { StatsScreen } from '../screens/StatsScreen';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0D0D0E' },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="QRCodeReady" component={QRCodeReadyScreen} />
        <Stack.Screen name="QRCodeView" component={QRCodeViewScreen} />
        <Stack.Screen name="NFCTagSharing" component={NFCTagSharingScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Stats" component={StatsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
