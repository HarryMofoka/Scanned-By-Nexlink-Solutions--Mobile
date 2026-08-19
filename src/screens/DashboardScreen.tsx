import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
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

  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  const notifications = [
    {
      id: '1',
      title: 'Digital Contact Card Ready',
      message: 'Your offline vCard is generated and ready to share via QR Code or NFC.',
      time: 'Just now',
      icon: 'qrcode',
      color: COLORS.coral,
    },
    {
      id: '2',
      title: 'NFC Hardware Writer Ready',
      message: 'You can program any standard NDEF-compatible NFC tag directly.',
      time: '1h ago',
      icon: 'nfc',
      color: COLORS.periwinkle,
    },
    {
      id: '3',
      title: 'Local & Private',
      message: 'Your contact info stays stored on your device — no external accounts required.',
      time: 'Today',
      icon: 'shield-checkmark-outline',
      color: '#10B981',
    },
  ];

  const handleOpenNotifications = () => {
    setShowNotifications(true);
    setHasUnreadNotifications(false);
  };

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
          <TouchableOpacity
            style={styles.bellBtn}
            activeOpacity={0.7}
            onPress={handleOpenNotifications}
          >
            <Feather name="bell" size={22} color={COLORS.textWhite} />
            {hasUnreadNotifications && <View style={styles.bellDot} />}
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
                <Feather name="maximize-2" size={18} color="rgba(255,255,255,0.85)" />
              </View>

              <View style={styles.qrWhiteBox}>
                <QRCode
                  value={profileUrl}
                  size={128}
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
              <Text style={styles.dataWeeklyTrend} numberOfLines={1}>
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

      {/* Notifications Modal */}
      <Modal
        visible={showNotifications}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNotifications(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowNotifications(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.notifModalCard}>
                <View style={styles.notifHeader}>
                  <View style={styles.notifHeaderTitleRow}>
                    <Feather name="bell" size={20} color={COLORS.coral} />
                    <Text style={styles.notifTitle}>Notifications</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.notifCloseBtn}
                    onPress={() => setShowNotifications(false)}
                  >
                    <Ionicons name="close" size={20} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.notifList} showsVerticalScrollIndicator={false}>
                  {notifications.map(item => (
                    <View key={item.id} style={styles.notifItem}>
                      <View style={[styles.notifIconCircle, { backgroundColor: item.color + '22' }]}>
                        {item.icon === 'qrcode' || item.icon === 'nfc' ? (
                          <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
                        ) : (
                          <Ionicons name={item.icon as any} size={20} color={item.color} />
                        )}
                      </View>
                      <View style={styles.notifTextCol}>
                        <View style={styles.notifItemHeader}>
                          <Text style={styles.notifItemTitle}>{item.title}</Text>
                          <Text style={styles.notifTime}>{item.time}</Text>
                        </View>
                        <Text style={styles.notifMessage}>{item.message}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.dismissNotifBtn}
                  onPress={() => setShowNotifications(false)}
                >
                  <Text style={styles.dismissNotifText}>Done</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E1E24',
    borderWidth: 1.5,
    borderColor: '#2D2D36',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  userTextCol: {
    flex: 1,
  },
  greetingText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  nameText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textWhite,
    letterSpacing: -0.3,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E1E24',
    borderWidth: 1,
    borderColor: '#2D2D36',
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
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  coralCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  qrWhiteBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  periwinkleCard: {
    flex: 1,
    backgroundColor: COLORS.periwinkle,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    height: 250,
    justifyContent: 'space-between',
    shadowColor: COLORS.periwinkle,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
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
    flex: 1,
    paddingRight: SPACING.md,
    justifyContent: 'center',
  },
  dataViewsCount: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.textDark,
    lineHeight: 52,
    letterSpacing: -1,
  },
  dataViewsLabel: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 6,
  },
  dataWeeklyTrend: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  dataRightCol: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
  circleProgressContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circleTrack: {
    ...StyleSheet.absoluteFill,
    borderRadius: 45,
    borderWidth: 8,
    borderColor: '#F3F4F6',
  },
  circleArc: {
    ...StyleSheet.absoluteFill,
    borderRadius: 45,
    borderWidth: 8,
    borderColor: COLORS.coral,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '-45deg' }],
  },
  circlePercentText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  notifModalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#16161A',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: '#262630',
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#262630',
  },
  notifHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notifTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  notifCloseBtn: {
    padding: 4,
  },
  notifList: {
    maxHeight: 320,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F26',
  },
  notifIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  notifTextCol: {
    flex: 1,
  },
  notifItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  notifItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  notifTime: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  notifMessage: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  dismissNotifBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.periwinkle,
    height: 48,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissNotifText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
