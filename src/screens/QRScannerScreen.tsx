import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { HeaderNav } from '../components/HeaderNav';
import { useApp } from '../context/AppContext';

export const QRScannerScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const { incrementProfileViews } = useApp();

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);

    incrementProfileViews('a7f3k9');
    navigation.navigate('PublicProfile', { profileId: 'a7f3k9' });
  };

  const handleSimulateScan = () => {
    setScanned(true);
    incrementProfileViews('a7f3k9');
    navigation.navigate('PublicProfile', { profileId: 'a7f3k9' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.responsiveWrapper}>
        <HeaderNav title="Scan QR Code" onBack={() => navigation.goBack()} />

      {!permission?.granted ? (
        <View style={styles.permissionContainer}>
          <MaterialCommunityIcons name="qrcode-scan" size={72} color={COLORS.coral} />
          <Text style={styles.permTitle}>Camera access required</Text>
          <Text style={styles.permSub}>
            TapShare needs permission to use your camera to scan TapShare profile QR codes.
          </Text>

          <TouchableOpacity style={styles.grantBtn} onPress={requestPermission}>
            <Text style={styles.grantBtnText}>Grant permission</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.simScanBtn} onPress={handleSimulateScan}>
            <Text style={styles.simScanText}>Or simulate scan (Test Demo)</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cameraWrapper}>
          <CameraView
            style={StyleSheet.absoluteFill}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          >
            {/* Overlay */}
            <View style={styles.overlayCenter}>
              <View style={styles.scanTargetBox}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>

              <Text style={styles.scanHintText}>
                Point your camera at a TapShare QR code
              </Text>
            </View>
          </CameraView>

          {/* Test Simulation Button */}
          <View style={styles.floatingSimContainer}>
            <TouchableOpacity style={styles.simScanBtn} onPress={handleSimulateScan}>
              <Ionicons name="sparkles" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.simScanText}>Simulate Scan TapShare Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  permTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textWhite,
    marginTop: SPACING.md,
  },
  permSub: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: SPACING.xl,
  },
  grantBtn: {
    backgroundColor: COLORS.coral,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 16,
    borderRadius: RADIUS.lg,
    width: '100%',
    alignItems: 'center',
  },
  grantBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  simScanBtn: {
    backgroundColor: COLORS.periwinkle,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
    shadowColor: COLORS.periwinkle,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  simScanText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cameraWrapper: {
    flex: 1,
    position: 'relative',
  },
  overlayCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  scanTargetBox: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: COLORS.coral,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  scanHintText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginTop: SPACING.xl,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  floatingSimContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
});
