import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

interface HeaderNavProps {
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  rightTextAction?: { label: string; onPress: () => void };
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  title,
  onBack,
  showBack = true,
  rightAction,
  rightTextAction,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBack && onBack ? (
          <TouchableOpacity activeOpacity={0.7} style={styles.circleBtn} onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textWhite} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      <View style={styles.titleContainer}>
        {title ? <Text style={styles.titleText}>{title}</Text> : null}
      </View>

      <View style={styles.rightContainer}>
        {rightTextAction ? (
          <TouchableOpacity activeOpacity={0.7} onPress={rightTextAction.onPress}>
            <Text style={styles.rightText}>{rightTextAction.label}</Text>
          </TouchableOpacity>
        ) : rightAction ? (
          rightAction
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E1E24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textWhite,
    letterSpacing: -0.5,
  },
  rightText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.periwinkle,
  },
});
