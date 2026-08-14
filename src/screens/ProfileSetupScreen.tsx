import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { HeaderNav } from '../components/HeaderNav';
import { CustomButton } from '../components/CustomButton';
import { AddLinkModal } from '../components/AddLinkModal';
import { useApp } from '../context/AppContext';
import { SocialLink } from '../types';

export const ProfileSetupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, updateProfile, addLink, removeLink, setHasCompletedSetup } = useApp();

  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCreateCard = async () => {
    if (!name.trim()) return;
    await updateProfile({ name: name.trim(), phone: phone.trim() });
    setHasCompletedSetup(true);
    navigation.replace('QRCodeReady');
  };

  const handleAddLink = async (link: Omit<SocialLink, 'id'>) => {
    await addLink(link);
  };

  const isFormValid = name.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.responsiveWrapper}>
        <HeaderNav onBack={() => navigation.goBack()} />

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '70%' }]} />
        </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.headerArea}>
          <Text style={styles.titleText}>Set up your card.</Text>
          <Text style={styles.subtitleText}>Add at least one way for people to reach you.</Text>
        </View>

        {/* Inputs */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor={COLORS.textMuted}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Your phone number"
            placeholderTextColor={COLORS.textMuted}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* LINKS Section */}
        <View style={styles.linksSection}>
          <Text style={styles.sectionHeaderTitle}>LINKS</Text>

          {/* Render Added Links */}
          {user.links.map(link => (
            <View key={link.id} style={styles.linkItemCard}>
              <View style={[styles.linkIconCircle, { backgroundColor: link.brandColor || COLORS.periwinkle }]}>
                <FontAwesome5 name={link.iconName || 'globe'} size={18} color="#FFFFFF" />
              </View>
              <View style={styles.linkTextContent}>
                <Text style={styles.linkTitle}>{link.title}</Text>
                <Text style={styles.linkUrl} numberOfLines={1}>
                  {link.url}
                </Text>
              </View>
              <TouchableOpacity onPress={() => removeLink(link.id)} style={styles.deleteLinkBtn}>
                <Ionicons name="close" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          ))}

          {/* Add Link Dashed Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.addDashedBtn}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={22} color={COLORS.textWhite} />
            <Text style={styles.addDashedText}>
              {user.links.length === 0 ? 'Add your first link' : 'Add another link'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer Submit */}
      <View style={styles.footer}>
        <CustomButton
          title="Create my card"
          onPress={handleCreateCard}
          variant={isFormValid ? 'primary' : 'disabled'}
          disabled={!isFormValid}
        />
      </View>

      </View>
      {/* Modal */}
      <AddLinkModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddLink}
      />
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
  progressTrack: {
    height: 4,
    backgroundColor: '#27272A',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 2,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.coral,
    borderRadius: 2,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  headerArea: {
    marginBottom: SPACING.lg,
  },
  titleText: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.textWhite,
    letterSpacing: -0.8,
  },
  subtitleText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  formGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#16161A',
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    borderRadius: RADIUS.md,
    height: 56,
    paddingHorizontal: SPACING.md,
    fontSize: 16,
    color: COLORS.textWhite,
  },
  linksSection: {
    marginTop: SPACING.xs,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
  },
  linkItemCard: {
    backgroundColor: '#16161A',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  linkIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
  linkUrl: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  deleteLinkBtn: {
    padding: 6,
  },
  addDashedBtn: {
    height: 58,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: '#374151',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  addDashedText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textWhite,
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.background,
  },
});
