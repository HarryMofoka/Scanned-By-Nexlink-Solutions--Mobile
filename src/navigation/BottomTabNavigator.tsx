import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../constants/theme';

import { DashboardScreen } from '../screens/DashboardScreen';
import { QRScannerScreen } from '../screens/QRScannerScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBarPill}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let icon = null;
          if (route.name === 'DashboardTab') {
            icon = (
              <Ionicons
                name="home"
                size={22}
                color={isFocused ? COLORS.coral : COLORS.textMuted}
              />
            );
          } else if (route.name === 'ScannerTab') {
            icon = (
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={22}
                color={isFocused ? COLORS.coral : COLORS.textMuted}
              />
            );
          } else if (route.name === 'StatsTab') {
            icon = (
              <Ionicons
                name="bar-chart-sharp"
                size={22}
                color={isFocused ? COLORS.coral : COLORS.textMuted}
              />
            );
          } else if (route.name === 'SettingsTab') {
            icon = (
              <Feather
                name="settings"
                size={22}
                color={isFocused ? COLORS.coral : COLORS.textMuted}
              />
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              onPress={onPress}
              style={styles.tabItem}
            >
              {icon}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="DashboardTab" component={DashboardScreen} />
      <Tab.Screen name="ScannerTab" component={QRScannerScreen} />
      <Tab.Screen name="StatsTab" component={StatsScreen} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tabBarPill: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#16161A',
    borderRadius: RADIUS.full,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: '#23232A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});
