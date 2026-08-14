import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { HeaderNav } from '../components/HeaderNav';
import { CustomButton } from '../components/CustomButton';
import { useApp } from '../context/AppContext';

export const LoginScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const isSignUpInitial = route.params?.isSignUp ?? false;
  const [isSignUp, setIsSignUp] = useState(isSignUpInitial);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, signup } = useApp();

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isSignUp) {
        await signup(email || 'thabo@email.com', 'Thabo Nkosi');
        navigation.replace('ProfileSetup');
      } else {
        await login(email || 'thabo@email.com');
        navigation.replace('MainTabs');
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    setLoading(true);
    setTimeout(async () => {
      await login(`user.${provider}@tapshare.app`);
      setLoading(false);
      navigation.replace('MainTabs');
    }, 600);
  };

  return (
    <View style={styles.container}>
      <View style={styles.responsiveWrapper}>
        <HeaderNav onBack={() => navigation.goBack()} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.headerArea}>
            <Text style={styles.titleText}>{isSignUp ? 'Create account.' : 'Welcome back.'}</Text>
            <Text style={styles.subtitleText}>
              {isSignUp ? 'Sign up to build your digital profile card.' : 'Log in to manage your card.'}
            </Text>
          </View>

          {/* Social Logins */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.googleButton}
              onPress={() => handleSocialAuth('google')}
            >
              <View style={styles.googleIconContainer}>
                <FontAwesome name="google" size={20} color="#4285F4" />
              </View>
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.appleButton}
              onPress={() => handleSocialAuth('apple')}
            >
              <Ionicons name="logo-apple" size={22} color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={styles.appleButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1, borderBottomRightRadius: 0, borderTopRightRadius: 0 }]}
                  placeholder="Password"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {!isSignUp && (
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Submit Button */}
          <View style={styles.submitContainer}>
            <CustomButton
              title={isSignUp ? 'Sign up' : 'Log in'}
              onPress={handleAuth}
              loading={loading}
              variant="primary"
            />

            <TouchableOpacity
              style={styles.toggleAuthBtn}
              onPress={() => setIsSignUp(!isSignUp)}
            >
              <Text style={styles.toggleAuthText}>
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
                <Text style={{ color: COLORS.periwinkle, fontWeight: '700' }}>
                  {isSignUp ? 'Log in' : 'Sign up'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </View>
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
  socialButtonsContainer: {
    gap: 12,
    marginBottom: SPACING.lg,
  },
  googleButton: {
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconContainer: {
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  appleButton: {
    height: 56,
    borderRadius: RADIUS.lg,
    backgroundColor: '#1E1E24',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2D2D35',
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.inputBorder,
  },
  dividerText: {
    marginHorizontal: 16,
    color: COLORS.textMuted,
    fontSize: 14,
  },
  formContainer: {
    gap: 16,
    marginVertical: SPACING.sm,
  },
  inputGroup: {},
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
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16161A',
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    borderRadius: RADIUS.md,
  },
  eyeBtn: {
    paddingHorizontal: SPACING.md,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotText: {
    color: COLORS.periwinkle,
    fontSize: 14,
    fontWeight: '600',
  },
  submitContainer: {
    marginTop: SPACING.xl,
  },
  toggleAuthBtn: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  toggleAuthText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
