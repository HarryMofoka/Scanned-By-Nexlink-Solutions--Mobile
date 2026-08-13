import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Sharing from 'expo-sharing';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { HeaderNav } from '../components/HeaderNav';
import { CustomButton } from '../components/CustomButton';
import { useApp } from '../context/AppContext';

export const QRCodeViewScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useApp();
  const profileUrl = `https://tapshare.app/p/${user.id || 'a7f3k9'}`;
  const displayUrl = `tapshare.app/p/${user.id || 'a7f3k9'}`;

  const qrRef = useRef<any>(null);

  const primaryLink = user.links.length > 0 ? user.links[0].url : 'tapshare.app';

  const handleShare = async () => {
    try {
      await Share.share({
        title: `${user.name}'s TapShare Card`,
        message: `Connect with ${user.name} on TapShare: ${profileUrl}`,
        url: profileUrl,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSaveQR = () => {
    if (qrRef.current) {
      qrRef.current.toDataURL((data: string) => {
        Alert.alert('Saved!', 'QR Code downloaded to your gallery.', [{ text: 'OK' }]);
      });
    }
  };

  return (
    <View style={styles.container}>
      <HeaderNav
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity style={styles.topRightShareBtn} onPress={handleShare}>
            <Feather name="share" size={20} color={COLORS.textWhite} />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main White Card */}
        <View style={styles.mainWhiteCard}>
          {/* Avatar */}
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user.avatarInitials || 'TN'}</Text>
          </View>

          {/* Name */}
          <Text style={styles.cardUserName}>{user.name || 'Thabo Nkosi'}</Text>

          {/* Handle / Subtitle */}
          <Text style={styles.cardUserHandle} numberOfLines={1}>
            {primaryLink}
          </Text>

          {/* QR Code SVG */}
          <View style={styles.qrContainer}>
            <QRCode
              value={profileUrl}
              size={210}
              color="#000000"
              backgroundColor="#FFFFFF"
              getRef={c => (qrRef.current = c)}
            />
          </View>

          {/* Display Link */}
          <Text style={styles.displayUrlText}>{displayUrl}</Text>
        </View>

        {/* Bottom Actions Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.saveWhiteBtn} onPress={handleSaveQR}>
            <Feather name="download" size={20} color={COLORS.textDark} style={{ marginRight: 8 }} />
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareCoralBtn} onPress={handleShare}>
            <Feather name="share-2" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.shareBtnText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* NFC Tap Shortcut */}
        <TouchableOpacity
          style={styles.nfcShortcutBtn}
          onPress={() => navigation.navigate('NFCTagSharing')}
        >
          <MaterialCommunityIcons name="nfc" size={22} color={COLORS.periwinkle} />
          <Text style={styles.nfcShortcutText}>Or tap to share via NFC</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topRightShareBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E1E24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
    alignItems: 'center',
  },
  mainWhiteCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: SPACING.lg,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.periwinkle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardUserName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  cardUserHandle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  qrContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
  displayUrlText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 14,
    width: '100%',
    marginBottom: SPACING.lg,
  },
  saveWhiteBtn: {
    flex: 1,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  saveBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  shareCoralBtn: {
    flex: 1,
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.coral,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shareBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  nfcShortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  nfcShortcutText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.periwinkle,
  },
});
