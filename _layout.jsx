import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { CameraView, Camera } from "expo-camera";
import * as Linking from "expo-linking";

export default function RootLayout() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [statusText, setStatusText] = useState("Position barcode in frame");

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarcodeScanned = async ({ type, data }) => {
    setScanned(true);
    setStatusText(`Captured: ${type}`);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);

    try {
      if (data.startsWith("http://") || data.startsWith("https://")) {
        await Linking.openURL(data);
      } else {
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
          data,
        )}`;
        await Linking.openURL(googleSearchUrl);
      }
    } catch (err) {
      Alert.alert("Error", `Couldn't open the URL: ${err.message}`);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Target frame overlay */}
      <View style={styles.targetFrame}>
        <View style={styles.cornerTopLeft} />
        <View style={styles.cornerTopRight} />
        <View style={styles.cornerBottomLeft} />
        <View style={styles.cornerBottomRight} />
      </View>

      {/* Status text */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>

      {scanned && (
        <Button
          title={"Tap to Scan Again"}
          onPress={() => {
            setScanned(false);
            setStatusText("Position barcode in frame");
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  targetFrame: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  cornerTopLeft: {
    position: "absolute",
    top: "30%",
    left: "25%",
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "white",
  },
  cornerTopRight: {
    position: "absolute",
    top: "30%",
    right: "25%",
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "white",
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: "30%",
    left: "25%",
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: "white",
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: "30%",
    right: "25%",
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "white",
  },
  statusContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
  },
  statusText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
