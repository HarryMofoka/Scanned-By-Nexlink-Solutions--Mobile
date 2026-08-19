import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { HeaderNav } from '../components/HeaderNav';
import { CustomButton } from '../components/CustomButton';
import { NFCWaveAnimation } from '../components/NFCWaveAnimation';
import { useApp } from '../context/AppContext';
import { generateVCard } from '../utils/vcard';

export const NFCTagSharingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, trackingUrl } = useApp();
  // If tracking is enabled, NFC writes the deployed URL; otherwise embed full vCard locally
  const vcardPayload = trackingUrl || generateVCard(user);
  const targetSummary = trackingUrl ? trackingUrl : `${user.name || 'Contact'} (vCard)`;

  const [currentState, setCurrentState] = useState<'writing' | 'success' | 'error'>('writing');

  const handleSimulateTap = () => {
    if (currentState === 'writing') {
      setCurrentState('success');
    } else {
      setCurrentState('writing');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.responsiveWrapper}>
        <HeaderNav title="Write NFC tag" onBack={() => navigation.goBack()} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* State 1: Active Writing View */}
        {currentState === 'writing' && (
          <View style={styles.stateWrapper}>
            <NFCWaveAnimation active={true} />

            <Text style={styles.mainTitle}>Hold your phone near the tag.</Text>
            <Text style={styles.subTitle}>Keep it close until you feel a vibration.</Text>

            {/* Target URL Pill Badge */}
            <View style={styles.urlPillBadge}>
              <View style={styles.qrSquareIconBox}>
                <MaterialCommunityIcons name="qrcode" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.urlPillText}>Writing: {targetSummary}</Text>
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
            <Text style={styles.subTitle}>Anyone who taps this tag will see your card.</Text>

            <View style={styles.urlPillBadge}>
              <View style={styles.qrSquareIconBox}>
                <MaterialCommunityIcons name="qrcode" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.urlPillText}>Writing: {targetSummary}</Text>
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
              Move closer and try again, or use a new tag.
            </Text>

            <View style={styles.urlPillBadge}>
              <View style={styles.qrSquareIconBox}>
                <MaterialCommunityIcons name="qrcode" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.urlPillText}>Writing: {targetSummary}</Text>
            </View>

            <CustomButton
              title="Try again"
              onPress={() => setCurrentState('writing')}
              variant="primary"
              style={{ marginTop: SPACING.md }}
            />

            <TouchableOpacity style={styles.cancelTextBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelTextOnly}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Interactive Simulator Bar */}
        <View style={styles.simulatorSection}>
          <View style={styles.dividerLineRow}>
            <View style={styles.line} />
            <Text style={styles.dividerLabel}>Simulate tag interaction</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.simButtonsRow}>
            <TouchableOpacity
              style={[
                styles.simChip,
                currentState === 'writing' && { backgroundColor: COLORS.periwinkle },
              ]}
              onPress={() => setCurrentState('writing')}
            >
              <Text style={styles.simChipText}>Writing</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.simChip,
                currentState === 'success' && { backgroundColor: COLORS.coral },
              ]}
              onPress={() => setCurrentState('success')}
            >
              <Text style={styles.simChipText}>Programmed ✓</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.simChip,
                currentState === 'error' && { backgroundColor: COLORS.error },
              ]}
              onPress={() => setCurrentState('error')}
            >
              <Text style={styles.simChipText}>Error ✗</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Showcase Other States grid from screenshot */}
        <View style={styles.otherStatesGrid}>
          <Text style={styles.otherStatesTitle}>Other states</Text>
          <View style={styles.gridRow}>
            {/* Card 1: Success preview */}
            <View style={styles.miniStateCard}>
              <View style={[styles.miniIconCircle, { backgroundColor: COLORS.coral }]}>
                <Ionicons name="checkmark" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.miniCardTitle}>Tag programmed!</Text>
              <Text style={styles.miniCardSub}>Anyone who taps this tag will see your card.</Text>
              <View style={styles.miniPill}>
                <View style={styles.miniQrIcon}>
                  <MaterialCommunityIcons name="qrcode" size={10} color="#FFFFFF" />
                </View>
                <Text style={styles.miniPillText} numberOfLines={1}>
                  Writing: {targetSummary}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.miniBtnPrimary}
                onPress={() => setCurrentState('success')}
              >
                <Text style={styles.miniBtnText}>Done</Text>
              </TouchableOpacity>
            </View>

            {/* Card 2: Error preview */}
            <View style={styles.miniStateCard}>
              <View style={[styles.miniIconCircle, { backgroundColor: '#231B19' }]}>
                <Ionicons name="alert" size={24} color={COLORS.coral} />
              </View>
              <Text style={styles.miniCardTitle}>Couldn't write to tag</Text>
              <Text style={styles.miniCardSub}>Move closer and try again, or use a new tag.</Text>
              <View style={styles.miniPill}>
                <View style={styles.miniQrIcon}>
                  <MaterialCommunityIcons name="qrcode" size={10} color="#FFFFFF" />
                </View>
                <Text style={styles.miniPillText} numberOfLines={1}>
                  Writing: {targetSummary}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.miniBtnPrimary}
                onPress={() => setCurrentState('error')}
              >
                <Text style={styles.miniBtnText}>Try again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textWhite,
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  subTitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: SPACING.lg,
  },
  urlPillBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
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
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
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
  cancelTextBtn: {
    marginTop: SPACING.md,
    paddingVertical: 8,
  },
  cancelTextOnly: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.periwinkle,
  },
  simulatorSection: {
    width: '100%',
    marginVertical: SPACING.xl,
  },
  dividerLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#27272A',
  },
  dividerLabel: {
    marginHorizontal: 12,
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  simButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  simChip: {
    backgroundColor: '#1E1E24',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
  },
  simChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  otherStatesGrid: {
    width: '100%',
  },
  otherStatesTitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  miniStateCard: {
    flex: 1,
    backgroundColor: '#16161A',
    borderRadius: RADIUS.lg,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#23232A',
  },
  miniIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  miniCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textWhite,
    textAlign: 'center',
  },
  miniCardSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 8,
    height: 32,
  },
  miniPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    maxWidth: '100%',
  },
  miniQrIcon: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: COLORS.coral,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  miniPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  miniBtnPrimary: {
    backgroundColor: COLORS.coral,
    width: '100%',
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
