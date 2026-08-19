import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { HeaderNav } from '../components/HeaderNav';
import { CustomButton } from '../components/CustomButton';
import { useApp } from '../context/AppContext';

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, deleteCard, trackingUrl, setTrackingUrl } = useApp();
  const [urlInput, setUrlInput] = useState(trackingUrl);

  useEffect(() => {
    setUrlInput(trackingUrl);
  }, [trackingUrl]);

  const handleResetCard = () => {
    Alert.alert(
      'Reset my card?',
      'This will permanently delete your saved profile from this device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Card',
          style: 'destructive',
          onPress: async () => {
            await deleteCard();
            navigation.reset({
              index: 0,
              routes: [{ name: 'GetStarted' }],
            });
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

        {/* SCAN TRACKING (OPTIONAL) Section */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionHeaderTitle}>SCAN TRACKING (OPTIONAL)</Text>

          <View style={styles.sectionWhiteCard}>
            <View style={{ paddingVertical: 16, paddingHorizontal: 4 }}>
              <Text style={styles.settingRowLabel}>Your deployed endpoint URL</Text>
              <Text style={styles.trackingExplainer}>
                Enable tracking by deploying your own copy of the backend and
                pasting its URL here. Leave blank to keep everything local and
                private — you just won't see a scan count.
              </Text>
              <TextInput
                style={styles.trackingInput}
                value={urlInput}
                onChangeText={setUrlInput}
                placeholder="https://your-app.vercel.app/api/card"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                returnKeyType="done"
                onSubmitEditing={() => setTrackingUrl(urlInput)}
                onBlur={() => setTrackingUrl(urlInput)}
              />
              {trackingUrl ? (
                <TouchableOpacity
                  style={styles.clearUrlBtn}
                  onPress={() => { setUrlInput(''); setTrackingUrl(''); }}
                >
                  <Ionicons name="close-circle" size={16} color={COLORS.coral} />
                  <Text style={styles.clearUrlText}>Remove endpoint</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <CustomButton
            title="Reset my card"
            onPress={handleResetCard}
            variant="secondary"
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
  trackingExplainer: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 12,
  },
  trackingInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textDark,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  clearUrlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  clearUrlText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.coral,
  },
});
