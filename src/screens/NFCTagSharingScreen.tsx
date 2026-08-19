/**
 * NFCTagSharingScreen.tsx — Hardware NFC Tag Writer for TapShare.
 *
 * NOTE: Real hardware NFC tag reading/writing requires a Custom Expo Dev Client
 * or a native standalone/EAS build (`npx expo run:android` / `npx expo run:ios` / `eas build`).
 * It does NOT function inside standard Expo Go because standard Expo Go does not bundle
 * custom native modules like react-native-nfc-manager.
 *
 * When run in Expo Go or on a device without NFC hardware, this screen gracefully detects
 * that NFC is unsupported and presents a clear, actionable explanation rather than failing silently.
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { HeaderNav } from '../components/HeaderNav';
import { CustomButton } from '../components/CustomButton';
import { NFCWaveAnimation } from '../components/NFCWaveAnimation';
import { useApp } from '../context/AppContext';
import { generateVCard } from '../utils/vcard';

type NFCState = 'checking' | 'writing' | 'success' | 'error' | 'unsupported' | 'disabled';

export const NFCTagSharingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, trackingUrl } = useApp();
  // If tracking is enabled, NFC writes the deployed URL; otherwise embed full vCard locally
  const vcardPayload = trackingUrl || generateVCard(user);
  const targetSummary = trackingUrl ? trackingUrl : `${user.name || 'Contact'} (vCard)`;

  const [currentState, setCurrentState] = useState<NFCState>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    isMounted.current = true;
    startNfcWriteSession();

    return () => {
      isMounted.current = false;
      cancelNfcSession();
    };
  }, []);

  const cancelNfcSession = async () => {
    try {
      if (NfcManager && typeof NfcManager.cancelTechnologyRequest === 'function') {
        await NfcManager.cancelTechnologyRequest();
      }
    } catch (_) {
      // Ignore cancellation cleanup errors
    }
  };

  const startNfcWriteSession = async () => {
    try {
      setCurrentState('checking');
      setErrorMessage('');

      // Verify NfcManager is available (not running on web or unlinked environment)
      if (Platform.OS === 'web' || !NfcManager || typeof NfcManager.isSupported !== 'function') {
        if (isMounted.current) setCurrentState('unsupported');
        return;
      }

      await NfcManager.start();
      const isSupported = await NfcManager.isSupported();

      if (!isSupported) {
        if (isMounted.current) setCurrentState('unsupported');
        return;
      }

      const isEnabled = await NfcManager.isEnabled();
      if (!isEnabled) {
        if (isMounted.current) setCurrentState('disabled');
        return;
      }

      if (!isMounted.current) return;
      setCurrentState('writing');

      // Request NDEF Technology Session
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Encode NDEF record: URL if trackingUrl is set, otherwise Text record with vCard
      let bytes: number[] | null = null;
      if (vcardPayload.startsWith('http://') || vcardPayload.startsWith('https://')) {
        bytes = Ndef.encodeMessage([Ndef.uriRecord(vcardPayload)]);
      } else {
        bytes = Ndef.encodeMessage([Ndef.textRecord(vcardPayload)]);
      }

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        if (isMounted.current) {
          setCurrentState('success');
        }
      } else {
        throw new Error('Failed to encode NFC record.');
      }
    } catch (ex: any) {
      console.warn('NFC Write Error:', ex);
      if (isMounted.current) {
        // Don't treat user-cancellation as a hard failure
        const msg = ex?.message || String(ex);
        if (msg.includes('cancelled') || msg.includes('Canceled')) {
          return;
        }
        setErrorMessage(msg || 'Move closer and try again, or use a writable NDEF tag.');
        setCurrentState('error');
      }
    } finally {
      await cancelNfcSession();
    }
  };

  const handleOpenSettings = async () => {
    try {
      if (NfcManager && typeof NfcManager.goToNfcSetting === 'function') {
        await NfcManager.goToNfcSetting();
      }
    } catch (_) {
      // Fallback
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.responsiveWrapper}>
        <HeaderNav title="Write NFC tag" onBack={() => navigation.goBack()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* State: Checking Hardware */}
          {currentState === 'checking' && (
            <View style={styles.stateWrapper}>
              <NFCWaveAnimation active={false} />
              <Text style={styles.mainTitle}>Checking NFC...</Text>
              <Text style={styles.subTitle}>Initializing NFC subsystem</Text>
            </View>
          )}

          {/* State 1: Active Writing View */}
          {currentState === 'writing' && (
            <View style={styles.stateWrapper}>
              <NFCWaveAnimation active={true} />

              <Text style={styles.mainTitle}>Hold phone near tag.</Text>
              <Text style={styles.subTitle}>Keep it close until writing completes.</Text>

              {/* Target URL Pill Badge */}
              <View style={styles.urlPillBadge}>
                <View style={styles.qrSquareIconBox}>
                  <MaterialCommunityIcons name="qrcode" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.urlPillText} numberOfLines={1}>
                  Writing: {targetSummary}
                </Text>
              </View>

              {/* Cancel Button */}
              <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelOutlineText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* State 2: Tag Programmed Success View */}
          {currentState === 'success' && (
            <View style={styles.stateWrapper}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark" size={60} color="#FFFFFF" />
              </View>

              <Text style={styles.mainTitle}>Tag programmed!</Text>
              <Text style={styles.subTitle}>Anyone who taps this tag will see your contact card.</Text>

              <View style={styles.urlPillBadge}>
                <View style={styles.qrSquareIconBox}>
                  <MaterialCommunityIcons name="qrcode" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.urlPillText} numberOfLines={1}>
                  Written: {targetSummary}
                </Text>
              </View>

              <CustomButton
                title="Done"
                onPress={() => navigation.goBack()}
                variant="primary"
                style={{ marginTop: SPACING.md }}
              />
            </View>
          )}

          {/* State 3: Error View */}
          {currentState === 'error' && (
            <View style={styles.stateWrapper}>
              <View style={styles.errorIconCircle}>
                <Ionicons name="alert" size={50} color={COLORS.coral} />
              </View>

              <Text style={styles.mainTitle}>Couldn't write to tag</Text>
              <Text style={styles.subTitle}>
                {errorMessage || 'Move closer and try again, or ensure the tag is unlocked.'}
              </Text>

              <View style={styles.urlPillBadge}>
                <View style={styles.qrSquareIconBox}>
                  <MaterialCommunityIcons name="qrcode" size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.urlPillText} numberOfLines={1}>
                  Target: {targetSummary}
                </Text>
              </View>

              <CustomButton
                title="Try again"
                onPress={startNfcWriteSession}
                variant="primary"
                style={{ marginTop: SPACING.md }}
              />

              <TouchableOpacity style={styles.cancelTextBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelTextOnly}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* State 4: NFC Unsupported / Expo Go Environment */}
          {currentState === 'unsupported' && (
            <View style={styles.stateWrapper}>
              <View style={styles.warningIconCircle}>
                <Ionicons name="hardware-chip-outline" size={48} color={COLORS.periwinkle} />
              </View>

              <Text style={styles.mainTitle}>NFC not available</Text>
              <Text style={styles.subTitle}>
                This device doesn't have NFC hardware, or the app is running in standard Expo Go where custom native NFC modules are unavailable.
              </Text>

              <View style={styles.devClientNoticeCard}>
                <Ionicons name="information-circle-outline" size={20} color={COLORS.periwinkle} style={{ marginRight: 10 }} />
                <Text style={styles.devClientNoticeText}>
                  To use real NFC writing, create a Custom Expo Dev Client or EAS Build (`npx expo run:android` or `run:ios`).
                </Text>
              </View>

              <CustomButton
                title="Go back"
                onPress={() => navigation.goBack()}
                variant="primary"
                style={{ marginTop: SPACING.lg }}
              />
            </View>
          )}

          {/* State 5: NFC Disabled in Settings */}
          {currentState === 'disabled' && (
            <View style={styles.stateWrapper}>
              <View style={styles.warningIconCircle}>
                <MaterialCommunityIcons name="nfc" size={52} color={COLORS.warning} />
              </View>

              <Text style={styles.mainTitle}>NFC is turned off</Text>
              <Text style={styles.subTitle}>
                Please enable NFC in your device settings to write your contact card to a physical tag.
              </Text>

              <CustomButton
                title="Open Settings"
                onPress={handleOpenSettings}
                variant="primary"
                style={{ marginTop: SPACING.lg }}
              />

              <TouchableOpacity style={styles.cancelTextBtn} onPress={startNfcWriteSession}>
                <Text style={styles.cancelTextOnly}>Check again</Text>
              </TouchableOpacity>
            </View>
          )}
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
    paddingBottom: SPACING.xl,
    alignItems: 'center',
  },
  stateWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textWhite,
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  subTitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: SPACING.lg,
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  urlPillBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  qrSquareIconBox: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.coral,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  urlPillText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    flexShrink: 1,
  },
  cancelOutlineBtn: {
    width: '100%',
    height: 56,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.periwinkle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelOutlineText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.periwinkle,
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.coral,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.lg,
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  errorIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#261C1A',
    borderWidth: 2,
    borderColor: COLORS.coral,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.lg,
  },
  warningIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1E1E24',
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.lg,
  },
  devClientNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16161A',
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    width: '100%',
  },
  devClientNoticeText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  cancelTextBtn: {
    marginTop: SPACING.md,
    paddingVertical: 8,
  },
  cancelTextOnly: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.periwinkle,
  },
});
