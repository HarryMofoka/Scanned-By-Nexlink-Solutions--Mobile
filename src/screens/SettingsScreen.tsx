import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { HeaderNav } from '../components/HeaderNav';
import { CustomButton } from '../components/CustomButton';
import { useApp } from '../context/AppContext';

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, deleteCard, trackingUrl, setTrackingUrl } = useApp();
  const [urlInput, setUrlInput] = useState(trackingUrl);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

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
              <Text style={styles.userName}>{user.name || 'Set your name'}</Text>
              <Text style={styles.userEmail}>{user.email || user.phone || 'Tap to edit profile'}</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={COLORS.textDarkSecondary} />
          </TouchableOpacity>

          {/* ABOUT Section */}
          <View style={styles.sectionWrapper}>
            <Text style={styles.sectionHeaderTitle}>LEGAL & ABOUT</Text>

            <View style={styles.sectionWhiteCard}>
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => setShowPrivacyModal(true)}
              >
                <View style={styles.rowLeftGroup}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.textDark} />
                  <Text style={styles.settingRowLabel}>Privacy policy</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textDarkSecondary} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => setShowTermsModal(true)}
              >
                <View style={styles.rowLeftGroup}>
                  <Ionicons name="document-text-outline" size={20} color={COLORS.textDark} />
                  <Text style={styles.settingRowLabel}>Terms of service</Text>
                </View>
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
          <Text style={styles.footerVersion}>TapShare v1.0.0 • Local-First Contact Sharing</Text>
        </ScrollView>
      </View>

      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacyModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.legalModalContainer}>
          <View style={styles.legalModalHeader}>
            <Text style={styles.legalModalHeaderTitle}>Privacy Policy</Text>
            <TouchableOpacity
              style={styles.legalCloseBtn}
              onPress={() => setShowPrivacyModal(false)}
            >
              <Ionicons name="close" size={24} color={COLORS.textWhite} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.legalModalScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.legalLastUpdated}>Last updated: August 2026</Text>

            <Text style={styles.legalSectionTitle}>1. Local-First Architecture</Text>
            <Text style={styles.legalParagraph}>
              TapShare is designed as a local-first application. Your profile information (name, phone number, email, and social links) is stored exclusively on your device using encrypted local storage (AsyncStorage). We do not operate central user databases or user accounts.
            </Text>

            <Text style={styles.legalSectionTitle}>2. Offline Contact Sharing</Text>
            <Text style={styles.legalParagraph}>
              When you generate a QR code or write to an NFC tag, your contact details are encoded directly as standard vCard 3.0 data. This transmission occurs entirely offline between your device and the recipient's phone camera or NFC reader.
            </Text>

            <Text style={styles.legalSectionTitle}>3. Optional Serverless Tracking</Text>
            <Text style={styles.legalParagraph}>
              If you deploy your own optional backend endpoint (`api/card.js`) and configure it in Settings, visits to your card URL are logged as an anonymous numerical increment via CountAPI. No personal identifiers, IP addresses, or location data are stored or processed.
            </Text>

            <Text style={styles.legalSectionTitle}>4. No Ads & No Data Selling</Text>
            <Text style={styles.legalParagraph}>
              TapShare contains zero third-party advertising SDKs, trackers, or commercial data brokers. Your contact data remains solely yours.
            </Text>

            <Text style={styles.legalSectionTitle}>5. Contact & Support</Text>
            <Text style={styles.legalParagraph}>
              For questions regarding TapShare's open-source architecture or privacy practices, visit our GitHub repository at github.com/HarryMofoka/Scanned-By-Nexlink-Solutions--Mobile.
            </Text>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.legalModalContainer}>
          <View style={styles.legalModalHeader}>
            <Text style={styles.legalModalHeaderTitle}>Terms of Service</Text>
            <TouchableOpacity
              style={styles.legalCloseBtn}
              onPress={() => setShowTermsModal(false)}
            >
              <Ionicons name="close" size={24} color={COLORS.textWhite} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.legalModalScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.legalLastUpdated}>Last updated: August 2026</Text>

            <Text style={styles.legalSectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.legalParagraph}>
              By using TapShare, you agree to these Terms of Service. TapShare is an open-source tool provided for creating and sharing digital business cards via standard QR codes and physical NFC tags.
            </Text>

            <Text style={styles.legalSectionTitle}>2. User Responsibilities</Text>
            <Text style={styles.legalParagraph}>
              You are solely responsible for ensuring that all contact details, phone numbers, and URLs you embed into QR codes or NFC tags are accurate, lawful, and authorized for sharing.
            </Text>

            <Text style={styles.legalSectionTitle}>3. Hardware & NFC Tag Compatibility</Text>
            <Text style={styles.legalParagraph}>
              NFC writing functionality requires compatible NDEF-formatted NFC tags and device hardware. TapShare is not liable for data corruption or hardware limitations of third-party tags.
            </Text>

            <Text style={styles.legalSectionTitle}>4. Open Source License</Text>
            <Text style={styles.legalParagraph}>
              TapShare is provided under the MIT License on an "AS IS" basis, without warranties of any kind, either express or implied.
            </Text>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
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
    paddingBottom: 40,
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
    shadowRadius: 12,
    elevation: 3,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.coral,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: 22,
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
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  sectionWrapper: {
    marginBottom: SPACING.lg,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.2,
    marginBottom: SPACING.xs,
    marginLeft: 4,
  },
  sectionWhiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  rowLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingRowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  actionsContainer: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
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
  legalModalContainer: {
    flex: 1,
    backgroundColor: '#0D0D0E',
    paddingTop: SPACING.lg,
  },
  legalModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F26',
  },
  legalModalHeaderTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  legalCloseBtn: {
    padding: 6,
  },
  legalModalScroll: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  legalLastUpdated: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  legalSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.coral,
    marginTop: SPACING.md,
    marginBottom: 6,
  },
  legalParagraph: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
