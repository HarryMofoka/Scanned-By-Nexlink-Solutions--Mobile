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
import { QRScannerScreen } from '../screens/QRScannerScreen';
import { PublicProfileScreen } from '../screens/PublicProfileScreen';

const Stack = createStackNavigator();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
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
        <Stack.Screen name="QRScanner" component={QRScannerScreen} />
        <Stack.Screen name="PublicProfile" component={PublicProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
