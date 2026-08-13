import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Share,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { HeaderNav } from '../components/HeaderNav';
import { useApp } from '../context/AppContext';

export const PublicProfileScreen: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { user, incrementProfileViews } = useApp();

  useEffect(() => {
    incrementProfileViews('a7f3k9');
  }, []);

  const handleOpenLink = (url: string) => {
    let target = url;
    if (!target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('tel:') && !target.startsWith('mailto:')) {
      target = 'https://' + target;
    }
    Linking.openURL(target).catch(() => {
      Alert.alert('Link opened', `Navigating to ${target}`);
    });
  };

  const handleCall = () => {
    if (user.phone) {
      Linking.openURL(`tel:${user.phone}`).catch(() => {
        Alert.alert('Call', `Calling ${user.phone}`);
      });
    }
  };

  const handleSaveVCard = () => {
    Alert.alert(
      'Contact Saved!',
      `${user.name || 'Thabo Nkosi'}'s contact details have been exported to your phone contacts.`,
      [{ text: 'Great!' }]
    );
  };

  const handleShareCard = async () => {
    try {
      await Share.share({
        title: `${user.name}'s Contact Card`,
        message: `View ${user.name}'s digital contact card: https://tapshare.app/p/${user.id}`,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderNav
        title="Digital Card"
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity style={styles.shareHeaderBtn} onPress={handleShareCard}>
            <Feather name="share-2" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header Card */}
        <View style={styles.profileHeroCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user.avatarInitials || 'TN'}</Text>
          </View>

          <Text style={styles.profileName}>{user.name || 'Thabo Nkosi'}</Text>

          {user.phone ? (
            <TouchableOpacity style={styles.phoneChip} onPress={handleCall}>
              <Ionicons name="call-outline" size={16} color={COLORS.coral} />
              <Text style={styles.phoneText}>{user.phone}</Text>
            </TouchableOpacity>
          ) : null}

          {/* Action Row: Call / Save VCard */}
          <View style={styles.actionButtonsRow}>
            {user.phone ? (
              <TouchableOpacity style={styles.callPrimaryBtn} onPress={handleCall}>
                <Ionicons name="call" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.callPrimaryText}>Call</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity style={styles.vcardBtn} onPress={handleSaveVCard}>
              <Feather name="user-plus" size={18} color={COLORS.textDark} style={{ marginRight: 6 }} />
              <Text style={styles.vcardBtnText}>Save Contact</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Links List Section */}
        <View style={styles.linksContainer}>
          <Text style={styles.sectionTitle}>CONNECTED PROFILES</Text>

          {user.links.map(link => (
            <TouchableOpacity
              key={link.id}
              activeOpacity={0.8}
              style={styles.linkCard}
              onPress={() => handleOpenLink(link.url)}
            >
              <View
                style={[
                  styles.linkIconBox,
                  { backgroundColor: link.brandColor || COLORS.periwinkle },
                ]}
              >
                <FontAwesome5 name={link.iconName || 'globe'} size={20} color="#FFFFFF" />
              </View>

              <View style={styles.linkTextContent}>
                <Text style={styles.linkTitle}>{link.title}</Text>
                <Text style={styles.linkSubtitle} numberOfLines={1}>
                  {link.url}
                </Text>
              </View>

              <Ionicons name="open-outline" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Powered by TapShare Footer */}
        <View style={styles.brandFooter}>
          <View style={styles.miniLogoDot} />
          <Text style={styles.brandFooterText}>Powered by TapShare</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  shareHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E1E24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  profileHeroCard: {
    backgroundColor: '#16161A',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#23232A',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.periwinkle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    shadowColor: COLORS.periwinkle,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textWhite,
    textAlign: 'center',
  },
  phoneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#231B19',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    marginTop: 8,
  },
  phoneText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.coral,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: SPACING.lg,
    width: '100%',
  },
  callPrimaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.coral,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callPrimaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  vcardBtn: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vcardBtnText: {
    color: COLORS.textDark,
    fontSize: 15,
    fontWeight: '700',
  },
  linksContainer: {
    marginTop: SPACING.xs,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
    marginLeft: 4,
  },
  linkCard: {
    backgroundColor: '#16161A',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#23232A',
  },
  linkIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  linkTextContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  linkSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  brandFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: SPACING.xl,
  },
  miniLogoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.coral,
  },
  brandFooterText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
});
