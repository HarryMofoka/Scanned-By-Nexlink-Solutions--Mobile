import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { HeaderNav } from '../components/HeaderNav';
import { CustomButton } from '../components/CustomButton';
import { useApp } from '../context/AppContext';

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout } = useApp();

  const handleLogout = async () => {
    Alert.alert('Log out', 'Are you sure you want to log out of TapShare?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.replace('GetStarted');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'Permanently delete your account and all profile data? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('GetStarted');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.responsiveWrapper}>
        <HeaderNav title="Settings" onBack={() => navigation.goBack()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.userWhiteCard}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user.avatarInitials || 'TN'}</Text>
          </View>

          <View style={styles.userInfoCol}>
            <Text style={styles.userName}>{user.name || 'Thabo Nkosi'}</Text>
            <Text style={styles.userEmail}>{user.email || 'thabo@email.com'}</Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color={COLORS.textDarkSecondary} />
        </TouchableOpacity>

        {/* ACCOUNT Section */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionHeaderTitle}>ACCOUNT</Text>

          <View style={styles.sectionWhiteCard}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => Alert.alert('Change Password', 'Enter your existing password to reset.')}
            >
              <Text style={styles.settingRowLabel}>Change password</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textDarkSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => Alert.alert('Email Preferences', 'Email notification settings updated.')}
            >
              <Text style={styles.settingRowLabel}>Email preferences</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textDarkSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ABOUT Section */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionHeaderTitle}>ABOUT</Text>

          <View style={styles.sectionWhiteCard}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => Alert.alert('Privacy Policy', 'TapShare Privacy Policy v1.0. Anonymous stats only.')}
            >
              <Text style={styles.settingRowLabel}>Privacy policy</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textDarkSecondary} />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => Alert.alert('Terms of Service', 'TapShare Terms of Service v1.0.')}
            >
              <Text style={styles.settingRowLabel}>Terms of service</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textDarkSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <CustomButton title="Log out" onPress={handleLogout} variant="primary" />

          <CustomButton
            title="Delete account"
            onPress={handleDeleteAccount}
            variant="secondary"
            style={{ marginTop: SPACING.xs }}
          />
        </View>

        {/* Footer */}
        <Text style={styles.footerVersion}>TapShare v1.0.0</Text>
      </ScrollView>
      </View>
    </View>
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
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: 110,
  },
  userWhiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.periwinkle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userInfoCol: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionWrapper: {
    marginBottom: SPACING.lg,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
    marginLeft: 4,
  },
  sectionWhiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 4,
  },
  settingRowLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  actionsContainer: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  footerVersion: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});
