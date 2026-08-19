/**
 * theme.ts — Design system tokens for TapShare.
 *
 * Centralised design constants consumed by all screens and components.
 * Uses a dark-mode-first palette with coral and periwinkle accent colours.
 *
 * Exports:
 *   - COLORS: Brand palette, text colours, UI states (error, success, warning)
 *   - SPACING: Consistent spacing scale (xs=4 through xxl=48)
 *   - RADIUS: Border radius tokens (sm=8 through full=9999)
 *   - SHADOWS: Elevation and glow presets for cards and accent elements
 */

/** Brand colour palette and semantic UI colours. */
export const COLORS = {
  background: '#0D0D0E',
  cardDark: '#16161A',
  cardDarkSecondary: '#1A1A1E',
  cardWhite: '#FFFFFF',
  coral: '#FF5B37',
  coralDark: '#E04523',
  coralLight: '#FF7659',
  periwinkle: '#7C83FD',
  periwinkleDark: '#6366F1',
  periwinkleLight: '#A5B4FC',
  periwinkleBg: '#EEF2FF',
  textWhite: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  textDark: '#111827',
  textDarkSecondary: '#4B5563',
  inputBg: '#16161A',
  inputBorder: '#2B2B30',
  inputFocusBorder: '#7C83FD',
  borderDark: '#27272A',
  borderLight: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  tabBarBg: '#16161A',
  tabBarBorder: '#23232A',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  glowCoral: {
    shadowColor: '#FF5B37',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  glowPeriwinkle: {
    shadowColor: '#7C83FD',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
};
