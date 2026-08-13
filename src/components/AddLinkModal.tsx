import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { SocialLink } from '../types';

interface AddLinkModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (link: Omit<SocialLink, 'id'>) => void;
}

const PLATFORMS: Array<{
  type: SocialLink['type'];
  title: string;
  iconName: string;
  color: string;
  placeholder: string;
}> = [
  {
    type: 'linkedin',
    title: 'LinkedIn',
    iconName: 'linkedin',
    color: '#0077B5',
    placeholder: 'linkedin.com/in/yourname',
  },
  {
    type: 'instagram',
    title: 'Instagram',
    iconName: 'instagram',
    color: '#E4405F',
    placeholder: 'instagram.com/@yourname',
  },
  {
    type: 'x',
    title: 'X (Twitter)',
    iconName: 'twitter',
    color: '#1DA1F2',
    placeholder: 'x.com/yourname',
  },
  {
    type: 'whatsapp',
    title: 'WhatsApp',
    iconName: 'whatsapp',
    color: '#25D366',
    placeholder: '+1234567890',
  },
  {
    type: 'email',
    title: 'Email',
    iconName: 'envelope',
    color: '#EA4335',
    placeholder: 'your.name@example.com',
  },
  {
    type: 'website',
    title: 'Website',
    iconName: 'globe',
    color: '#7C83FD',
    placeholder: 'https://yourwebsite.com',
  },
  {
    type: 'github',
    title: 'GitHub',
    iconName: 'github',
    color: '#333333',
    placeholder: 'github.com/yourname',
  },
  {
    type: 'youtube',
    title: 'YouTube',
    iconName: 'youtube',
    color: '#FF0000',
    placeholder: 'youtube.com/@channel',
  },
];

export const AddLinkModal: React.FC<AddLinkModalProps> = ({ visible, onClose, onAdd }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
  const [urlInput, setUrlInput] = useState('');

  const handleSave = () => {
    if (!urlInput.trim()) return;
    onAdd({
      type: selectedPlatform.type,
      title: selectedPlatform.title,
      url: urlInput.trim(),
      iconName: selectedPlatform.iconName,
      brandColor: selectedPlatform.color,
    });
    setUrlInput('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity activeOpacity={1} style={styles.backdrop} onPress={onClose} />
        <View style={styles.content}>
          <View style={styles.handleBar} />
          <Text style={styles.modalTitle}>Add a link</Text>
          <Text style={styles.modalSubtitle}>Choose a platform and enter your URL or handle</Text>

          {/* Platform selector horizontal grid */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.platformScroll}
          >
            {PLATFORMS.map(p => {
              const isSelected = selectedPlatform.type === p.type;
              return (
                <TouchableOpacity
                  key={p.type}
                  activeOpacity={0.8}
                  style={[
                    styles.platformCard,
                    isSelected && { borderColor: COLORS.coral, backgroundColor: '#231B19' },
                  ]}
                  onPress={() => {
                    setSelectedPlatform(p);
                    if (!urlInput) setUrlInput(p.placeholder);
                  }}
                >
                  <View style={[styles.iconBg, { backgroundColor: p.color }]}>
                    <FontAwesome5 name={p.iconName} size={18} color="#FFFFFF" />
                  </View>
                  <Text
                    style={[
                      styles.platformText,
                      isSelected && { color: COLORS.coral, fontWeight: '700' },
                    ]}
                  >
                    {p.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Input field */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{selectedPlatform.title} Link / Handle</Text>
            <TextInput
              style={styles.textInput}
              value={urlInput}
              onChangeText={setUrlInput}
              placeholder={selectedPlatform.placeholder}
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Actions */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addBtn} onPress={handleSave}>
              <Text style={styles.addText}>Add Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  content: {
    backgroundColor: '#16161A',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 36 : SPACING.lg,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.borderDark,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  platformScroll: {
    paddingVertical: SPACING.xs,
    gap: 12,
  },
  platformCard: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: '#1F1F24',
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  iconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformText: {
    fontSize: 14,
    color: COLORS.textWhite,
  },
  inputContainer: {
    marginVertical: SPACING.md,
  },
  inputLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#101014',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.textWhite,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: SPACING.xs,
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#23232A',
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  addBtn: {
    flex: 1,
    height: 50,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.coral,
  },
  addText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
