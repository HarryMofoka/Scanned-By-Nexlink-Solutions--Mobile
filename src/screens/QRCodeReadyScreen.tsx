import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { CustomButton } from '../components/CustomButton';
import { useApp } from '../context/AppContext';

export const QRCodeReadyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useApp();
  const profileUrl = `https://tapshare.app/p/${user.id || 'a7f3k9'}`;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.responsiveWrapper}>
        {/* Decorative Confetti Background Dots */}
        <View style={styles.confettiLayer} pointerEvents="none">
        <View style={[styles.confettiBit, { top: 40, left: 50, backgroundColor: COLORS.coral, transform: [{ rotate: '20deg' }] }]} />
        <View style={[styles.confettiBit, { top: 70, right: 60, backgroundColor: COLORS.periwinkle, transform: [{ rotate: '-15deg' }] }]} />
        <View style={[styles.confettiBit, { top: 120, left: 80, backgroundColor: COLORS.periwinkle }]} />
        <View style={[styles.confettiBit, { top: 90, right: 40, backgroundColor: COLORS.coral }]} />
        <View style={[styles.confettiBit, { top: 180, left: 30, backgroundColor: COLORS.coral }]} />
        <View style={[styles.confettiBit, { top: 160, right: 80, backgroundColor: COLORS.periwinkle }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Circle */}
        <View style={styles.successIconWrapper}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={64} color="#FFFFFF" />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.titleText}>Your card is ready!</Text>
        <Text style={styles.subtitleText}>Share it with a scan, a tap, or a link.</Text>

        {/* White Card Preview */}
        <View style={styles.cardPreviewContainer}>
          {/* Avatar */}
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user.avatarInitials || 'TN'}</Text>
          </View>

          {/* User Name */}
          <Text style={styles.cardUserName}>{user.name || 'Thabo Nkosi'}</Text>

          {/* QR Code */}
          <View style={styles.qrWrapper}>
            <QRCode
              value={profileUrl}
              size={180}
              color="#000000"
              backgroundColor="#FFFFFF"
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <CustomButton
          title="View my card"
          onPress={() => navigation.replace('MainTabs')}
          variant="primary"
        />
      </View>
      </View>
    </SafeAreaView>
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
  confettiLayer: {
    ...StyleSheet.absoluteFill,
  },
  confettiBit: {
    position: 'absolute',
    width: 14,
    height: 8,
    borderRadius: 3,
    opacity: 0.8,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl * 1.5,
    paddingBottom: SPACING.lg,
    alignItems: 'center',
  },
  successIconWrapper: {
    marginBottom: SPACING.lg,
  },
  successCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.coral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  titleText: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.textWhite,
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  subtitleText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: SPACING.xl,
  },
  cardPreviewContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.periwinkle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardUserName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  qrWrapper: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.background,
  },
});
