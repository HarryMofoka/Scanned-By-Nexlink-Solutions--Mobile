import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { generateVCard } from '../utils/vcard';

export const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, liveScanCount, isLoadingScans, trackingUrl } = useApp();
  const insets = useSafeAreaInsets();
  const profileUrl = trackingUrl || generateVCard(user);
  const headerTopPadding = Math.max(insets.top, 16) + 16;

  return (
    <View style={styles.container}>
      {/* Responsive Wrapper */}
      <View style={styles.responsiveWrapper}>
        {/* Top Header */}
        <View style={[styles.headerRow, { paddingTop: headerTopPadding }]}>
        <View style={styles.userInfoRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.avatarCircle}
            onPress={() => navigation.navigate('SettingsTab')}
          >
            <Text style={styles.avatarText}>{user.avatarInitials || 'TN'}</Text>
          </TouchableOpacity>
          <View style={styles.userTextCol}>
            <Text style={styles.greetingText}>Hello there!</Text>
            <Text style={styles.nameText} numberOfLines={1}>
              {user.name || 'Thabo Nkosi'}
            </Text>
          </View>
        </View>

        {/* Bell Notification */}
        <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
          <Feather name="bell" size={22} color={COLORS.textWhite} />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Side-by-Side Cards Row */}
        <View style={styles.heroRow}>
          {/* Left Coral Card - QR Code */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.coralCard}
            onPress={() => navigation.navigate('QRCodeTab')}
          >
            <View style={styles.cardHeaderRow}>
              <Text style={styles.coralCardTitle}>Your QR code</Text>
              <View style={styles.qrCircleIcon}>
                <MaterialCommunityIcons name="qrcode" size={20} color={COLORS.textDark} />
              </View>
            </View>

            <View style={styles.qrWhiteBox}>
              <QRCode
                value={profileUrl}
                size={110}
                color="#000000"
                backgroundColor="#FFFFFF"
              />
            </View>
          </TouchableOpacity>

          {/* Right Periwinkle Card - NFC Quick Share */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.periwinkleCard}
            onPress={() => navigation.navigate('NFCTagSharing')}
          >
            <Text style={styles.periwinkleCardTitle}>Quick share.</Text>

            <View style={styles.nfcWaveArea}>
              <MaterialCommunityIcons name="nfc" size={72} color="#FFFFFF" />
            </View>

            <View style={styles.writeTagWhiteBtn}>
              <Text style={styles.writeTagText}>Write tag</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Data Card (Stats) */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.dataCard}
          onPress={() => navigation.navigate('StatsTab')}
        >
          <View style={styles.dataLeftCol}>
            <Text style={styles.dataViewsCount}>
              {!trackingUrl ? '—' : isLoadingScans ? '...' : liveScanCount}
            </Text>
            <Text style={styles.dataViewsLabel}>
              {!trackingUrl ? 'stats (offline)' : 'total scans'}
            </Text>
            <Text style={styles.dataWeeklyTrend}>
              {!trackingUrl ? 'Enable tracking in Settings' : 'Live CountAPI scans'}
            </Text>
          </View>

          <View style={styles.dataRightCol}>
            {/* Circular Progress Gauge */}
            <View style={styles.circleProgressContainer}>
              <View style={styles.circleTrack} />
              <View style={styles.circleArc} />
              <Text style={styles.circlePercentText}>78%</Text>
            </View>
          </View>
        </TouchableOpacity>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.periwinkle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userTextCol: {
    flex: 1,
  },
  greetingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textWhite,
    letterSpacing: -0.5,
  },
  bellBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#1E1E24',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.coral,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: 110,
  },
  heroRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  coralCard: {
    flex: 1,
    backgroundColor: COLORS.coral,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    height: 250,
    justifyContent: 'space-between',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coralCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  qrCircleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrWhiteBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
  },
  periwinkleCard: {
    flex: 1,
    backgroundColor: COLORS.periwinkle,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    height: 250,
    justifyContent: 'space-between',
  },
  periwinkleCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  nfcWaveArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  writeTagWhiteBtn: {
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  writeTagText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  dataCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  dataLeftCol: {
    justifyContent: 'center',
  },
  dataViewsCount: {
    fontSize: 52,
    fontWeight: '900',
    color: COLORS.textDark,
    lineHeight: 56,
    letterSpacing: -1,
  },
  dataViewsLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  dataWeeklyTrend: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  dataRightCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleProgressContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circleTrack: {
    ...StyleSheet.absoluteFill,
    borderRadius: 55,
    borderWidth: 10,
    borderColor: '#F3F4F6',
  },
  circleArc: {
    ...StyleSheet.absoluteFill,
    borderRadius: 55,
    borderWidth: 10,
    borderColor: COLORS.coral,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  circlePercentText: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textDark,
  },
});
