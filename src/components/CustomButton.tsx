import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'white' | 'outlinePeriwinkle' | 'disabled';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const getContainerStyle = () => {
    if (disabled || variant === 'disabled') {
      return styles.disabledContainer;
    }
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'white':
        return styles.whiteContainer;
      case 'outlinePeriwinkle':
        return styles.outlinePeriwinkleContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = () => {
    if (disabled || variant === 'disabled') {
      return styles.disabledText;
    }
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'white':
        return styles.whiteText;
      case 'outlinePeriwinkle':
        return styles.outlinePeriwinkleText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading || variant === 'disabled'}
      style={[styles.baseButton, getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'secondary' || variant === 'outlinePeriwinkle'
              ? COLORS.coral
              : variant === 'white'
              ? COLORS.textDark
              : '#FFFFFF'
          }
        />
      ) : (
        <>
          {icon}
          <Text style={[styles.baseText, getTextStyle(), icon ? { marginLeft: 8 } : null, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    height: 56,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    marginVertical: SPACING.xs,
    width: '100%',
  },
  baseText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  primaryContainer: {
    backgroundColor: COLORS.coral,
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.coral,
  },
  secondaryText: {
    color: COLORS.coral,
  },
  whiteContainer: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  whiteText: {
    color: COLORS.textDark,
  },
  outlinePeriwinkleContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.periwinkle,
  },
  outlinePeriwinkleText: {
    color: COLORS.periwinkle,
  },
  disabledContainer: {
    backgroundColor: '#3A1E1A',
    opacity: 0.6,
  },
  disabledText: {
    color: '#8A5D57',
  },
});
