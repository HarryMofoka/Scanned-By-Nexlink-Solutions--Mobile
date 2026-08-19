import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../constants/theme';

import { DashboardScreen } from '../screens/DashboardScreen';
import { QRCodeViewScreen } from '../screens/QRCodeViewScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 20);

  // Hide the floating navigation pill entirely on the Settings screen
  const currentRoute = state.routes[state.index];
  if (currentRoute?.name === 'SettingsTab') {
    return null;
  }

  return (
    <View style={[styles.tabBarContainer, { bottom: bottomPadding }]}>
      <View style={styles.tabBarPill}>
        {state.routes.map((route: any, index: number) => {
          // Do not render a button for Settings in the bottom pill if we want 3 main tabs or keep it accessible
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
                size={26}
                color={isFocused ? COLORS.coral : COLORS.textMuted}
              />
            );
          } else if (route.name === 'QRCodeTab') {
            icon = (
              <MaterialCommunityIcons
                name="qrcode"
                size={28}
                color={isFocused ? COLORS.coral : COLORS.textMuted}
              />
            );
          } else if (route.name === 'StatsTab') {
            icon = (
              <Ionicons
                name="bar-chart-sharp"
                size={26}
                color={isFocused ? COLORS.coral : COLORS.textMuted}
              />
            );
          } else if (route.name === 'SettingsTab') {
            icon = (
              <Feather
                name="settings"
                size={26}
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
              <View style={[styles.tabIconWrapper, isFocused && styles.tabIconWrapperFocused]}>
                {icon}
              </View>
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
      <Tab.Screen name="QRCodeTab" component={QRCodeViewScreen} />
      <Tab.Screen name="StatsTab" component={StatsScreen} />
      <Tab.Screen name="SettingsTab" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 1000,
  },
  tabBarPill: {
    flexDirection: 'row',
    height: 74,
    backgroundColor: '#18181D',
    borderRadius: RADIUS.full,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 390,
    borderWidth: 1.5,
    borderColor: '#2A2A36',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrapperFocused: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
  },
});
