import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { DualCardLogo } from '../components/DualCardLogo';
import { CustomButton } from '../components/CustomButton';

export const GetStartedScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Logo */}
        <View style={styles.logoWrapper}>
          <DualCardLogo size={70} />
        </View>

        {/* Heading */}
        <View style={styles.headerTextContainer}>
          <Text style={styles.mainHeading}>Your details.</Text>
          <Text style={styles.mainHeading}>
            <Text style={{ color: COLORS.coral }}>Shared </Text>
            <Text style={{ color: COLORS.periwinkle }}>instantly.</Text>
          </Text>
          <Text style={styles.subHeading}>
            Create your digital card, share it anywhere, and grow your connections.
          </Text>
        </View>

        {/* 3 Feature Cards */}
        <View style={styles.cardsContainer}>
          {/* Card 1 */}
          <View style={styles.featureCard}>
            <View style={[styles.iconBox, { backgroundColor: COLORS.coral }]}>
              <MaterialCommunityIcons name="qrcode-scan" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.cardTextContent}>
              <Text style={styles.cardTitle}>Share in seconds</Text>
              <Text style={styles.cardSubtitle}>
                Scan, tap, or share your card instantly with anyone.
              </Text>
            </View>
          </View>

          {/* Card 2 */}
          <View style={styles.featureCard}>
            <View style={[styles.iconBox, { backgroundColor: COLORS.periwinkle }]}>
              <Ionicons name="trending-up-sharp" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.cardTextContent}>
              <Text style={styles.cardTitle}>Track your impact</Text>
              <Text style={styles.cardSubtitle}>
                See views, taps, and engagement in real time.
              </Text>
            </View>
          </View>

          {/* Card 3 */}
          <View style={styles.featureCard}>
            <View style={[styles.iconBox, { backgroundColor: COLORS.coral }]}>
              <FontAwesome5 name="user-friends" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.cardTextContent}>
              <Text style={styles.cardTitle}>Build stronger connections</Text>
              <Text style={styles.cardSubtitle}>
                Keep your network growing every day.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons & Pagination */}
      <View style={styles.footerContainer}>
        <CustomButton
          title="Get started"
          onPress={() => navigation.navigate('Login', { isSignUp: true })}
          variant="primary"
        />

        <CustomButton
          title="Log in"
          onPress={() => navigation.navigate('Login', { isSignUp: false })}
          variant="secondary"
        />

        <View style={styles.paginationRow}>
          <View style={[styles.pageDot, { backgroundColor: COLORS.coral, width: 10 }]} />
          <View style={styles.pageDot} />
          <View style={styles.pageDot} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  headerTextContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  mainHeading: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.textWhite,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  subHeading: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 22,
    maxWidth: '90%',
  },
  cardsContainer: {
    gap: 14,
    marginBottom: SPACING.lg,
  },
  featureCard: {
    backgroundColor: '#16161A',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#212128',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textWhite,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  footerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: SPACING.md,
  },
  pageDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#374151',
  },
});
