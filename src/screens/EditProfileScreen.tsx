import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { HeaderNav } from '../components/HeaderNav';
import { AddLinkModal } from '../components/AddLinkModal';
import { useApp } from '../context/AppContext';
import { SocialLink } from '../types';

export const EditProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, updateProfile, addLink, removeLink, deleteCard } = useApp();

  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [email, setEmail] = useState(user.email || '');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name.');
      return;
    }
    setIsSaving(true);
    await updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
    });
    setShowToast(true);

    setTimeout(() => {
      navigation.goBack();
    }, 1200);
  };

  const handleDeleteCard = () => {
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
        <HeaderNav
          title="Edit profile"
          onBack={() => navigation.goBack()}
          rightTextAction={{ label: isSaving ? 'Saved ✓' : 'Save', onPress: handleSave }}
        />

        {/* Toast confirmation banner */}
        {showToast && (
          <View style={styles.toastContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.toastText}>Profile changes saved!</Text>
          </View>
        )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Name Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        {/* Phone Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone (optional)</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Your phone number"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="phone-pad"
          />
        </View>

        {/* Email Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email (optional)</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="your.email@example.com"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* LINKS Section */}
        <View style={styles.linksSection}>
          <Text style={styles.sectionHeaderTitle}>LINKS</Text>

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

              <TouchableOpacity
                onPress={() => removeLink(link.id)}
                style={styles.deleteLinkBtn}
              >
                <Ionicons name="close" size={20} color={COLORS.textWhite} />
              </TouchableOpacity>
            </View>
          ))}

          {/* Add link dashed button */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.addDashedBtn}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={22} color={COLORS.textWhite} />
            <Text style={styles.addDashedText}>Add another link</Text>
          </TouchableOpacity>
        </View>

        {/* Delete Card Button */}
        <TouchableOpacity style={styles.deleteCardBtn} onPress={handleDeleteCard}>
          <Text style={styles.deleteCardText}>Delete my card</Text>
        </TouchableOpacity>
      </ScrollView>
      </View>

      {/* Add Link Modal */}
      <AddLinkModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={async l => {
          await addLink(l);
        }}
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
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
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
    marginBottom: SPACING.xl,
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
  deleteCardBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    marginTop: SPACING.lg,
  },
  deleteCardText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.coral,
  },
  toastContainer: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    backgroundColor: '#1E1E24',
    borderColor: '#2D2D36',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  toastText: {
    color: COLORS.textWhite,
    fontSize: 15,
    fontWeight: '700',
  },
});
