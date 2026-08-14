import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { HeaderNav } from '../components/HeaderNav';
import { useApp } from '../context/AppContext';

export const StatsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { liveScanCount, isLoadingScans } = useApp();
  const [activeFilter, setActiveFilter] = useState<'views' | 'taps' | 'nfc'>('views');

  return (
    <View style={styles.container}>
      <View style={styles.responsiveWrapper}>
        <HeaderNav
          title="Statistics"
          onBack={() => navigation.goBack()}
          rightAction={
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.topHeaderBtn}>
                <Feather name="bell" size={18} color="#FFFFFF" />
                <View style={styles.bellDot} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.topHeaderBtn}
                onPress={() => navigation.navigate('Settings')}
              >
                <Feather name="settings" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          }
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Card: Prominent Total Scans Display */}
          <View style={styles.coralHeroCard}>
            <View style={styles.chartHeaderRow}>
              <Text style={styles.cardViewsTitle}>Total Card Scans</Text>
              <View style={styles.liveBadgePill}>
                <View style={styles.liveDot} />
                <Text style={styles.liveBadgeText}>Live CountAPI</Text>
              </View>
            </View>

            {/* 
              NOTE ON TIME-SERIES CHARTS:
              CountAPI only returns a single running total, not a time-series breakdown.
              A daily/weekly bar chart can be re-introduced here if timestamped storage (e.g. Supabase, Postgres)
              is introduced in a future pass.
            */}
            <View style={styles.prominentTotalContainer}>
              <Text style={styles.prominentTotalNumber}>
                {isLoadingScans ? '...' : liveScanCount}
              </Text>
              <Text style={styles.prominentTotalLabel}>
                {liveScanCount === 0 ? 'No scans recorded yet' : 'Total scans logged'}
              </Text>
            </View>
          </View>

        {/* Metric Filter Pills */}
        <View style={styles.filterPillsRow}>
          <TouchableOpacity
            style={[
              styles.filterPill,
              activeFilter === 'views' && styles.filterPillWhiteActive,
            ]}
            onPress={() => setActiveFilter('views')}
          >
            <Text
              style={[
                styles.filterPillText,
                activeFilter === 'views' && { color: COLORS.textDark, fontWeight: '800' },
              ]}
            >
              Views
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              { backgroundColor: COLORS.periwinkle },
              activeFilter === 'taps' && styles.filterPillActiveGlow,
            ]}
            onPress={() => setActiveFilter('taps')}
          >
            <Text style={styles.filterPillText}>Taps</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              { backgroundColor: COLORS.coral },
              activeFilter === 'nfc' && styles.filterPillActiveGlow,
            ]}
            onPress={() => setActiveFilter('nfc')}
          >
            <Text style={styles.filterPillText}>NFC</Text>
          </TouchableOpacity>
        </View>

        {/* 3 Metric White Cards */}
        <View style={styles.metricsGrid}>
          {/* Card 1 */}
          <View style={styles.metricCard}>
            <Text style={styles.metricBigNumber}>
              {isLoadingScans ? '...' : liveScanCount}
            </Text>
            <Text style={styles.metricLabel}>Total Scans</Text>
          </View>

          {/* Card 2 */}
          <View style={styles.metricCard}>
            <Text style={styles.metricBigNumber}>100%</Text>
            <Text style={styles.metricLabel}>Scan Uptime</Text>
          </View>

          {/* Card 3 */}
          <View style={styles.metricCard}>
            <Text style={styles.metricBigNumber}>vCard</Text>
            <Text style={styles.metricLabel}>Contact Format</Text>
          </View>
        </View>
      </ScrollView>
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
  topHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E1E24',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.coral,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: 110,
  },
  coralHeroCard: {
    backgroundColor: COLORS.coral,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  cardViewsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  liveBadgePill: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  liveBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  prominentTotalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  prominentTotalNumber: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -2,
  },
  prominentTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  chartContainer: {
    marginTop: SPACING.md,
    height: 200,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  gridLineContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  gridLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    width: 24,
  },
  dottedLine: {
    flex: 1,
    height: 1,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingLeft: 24,
    height: '100%',
  },
  barCol: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    position: 'relative',
  },
  tooltipPill: {
    position: 'absolute',
    top: -36,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  tooltipText: {
    fontSize: 10,
    color: COLORS.textDark,
  },
  barValueText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  barFill: {
    width: 24,
    borderRadius: RADIUS.sm,
  },
  barDayLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 8,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SPACING.lg,
  },
  filterPill: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E24',
  },
  filterPillWhiteActive: {
    backgroundColor: '#FFFFFF',
  },
  filterPillActiveGlow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  filterPillText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.lg,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  metricBigNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textDark,
    letterSpacing: -1,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});
