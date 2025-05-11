import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Platform,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

const DamageCostEstimator = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Sorry, we need camera roll permissions to make this work!"
        );
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setResult(null);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Sorry, we need camera permissions to make this work!"
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setResult(null);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const removeImage = () => {
    setImage(null);
    setResult(null);
    fadeAnim.setValue(0);
  };

  const estimateCost = async () => {
    if (!image) {
      Alert.alert("No Image", "Please upload an image first");
      return;
    }

    animateButtonPress();
    setLoading(true);

    const formData = new FormData();
    formData.append("file", {
      uri: image,
      name: "damage_image.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await axios.post(
        "http://192.168.234.70:4020/classify",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const apiData = response.data;

      // Format the API response
      const apiResult = {
        predictedClass: apiData.predicted_class || "Unknown Damage",
        confidence: apiData.confidence
          ? `${(apiData.confidence * 100).toFixed(1)}%`
          : "N/A",
        severity: apiData.cost_estimate?.severity || "Unknown",
        repair: apiData.cost_estimate?.repair || "N/A",
        replacement: apiData.cost_estimate?.replacement || "N/A",
        nearbyShops: [
          {
            name: "Colombo Auto Care",
            distance: "1.5 km",
            rating: 4.7,
            address: "123 Galle Road, Colombo 03",
          },
          {
            name: "City Car Repairs",
            distance: "2.3 km",
            rating: 4.5,
            address: "45 Union Place, Colombo 02",
          },
          {
            name: "Lanka Vehicle Services",
            distance: "3.1 km",
            rating: 4.3,
            address: "78 Havelock Road, Colombo 05",
          },
        ],
      };

      setResult(apiResult);
      showResultModal();
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "Failed to estimate damage cost. Please try again.");

      // Fallback to simulated result if API fails
      setResult({
        predictedClass: "Glass Shatter",
        confidence: "86.6%",
        severity: "High",
        repair: "Not repairable",
        replacement: "$398-$1993",
        nearbyShops: [
          {
            name: "Colombo Auto Care",
            distance: "1.5 km",
            rating: 4.7,
            address: "123 Galle Road, Colombo 03",
          },
          {
            name: "City Car Repairs",
            distance: "2.3 km",
            rating: 4.5,
            address: "45 Union Place, Colombo 02",
          },
          {
            name: "Lanka Vehicle Services",
            distance: "3.1 km",
            rating: 4.3,
            address: "78 Havelock Road, Colombo 05",
          },
        ],
      });
      showResultModal();
    } finally {
      setLoading(false);
    }
  };

  const showResultModal = () => {
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideResultModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setModalVisible(false));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={["#f5f8fa", "#e6f2ff"]} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Damage Cost Estimator</Text>
          <Text style={styles.subtitle}>
            Upload an image of your vehicle damage to get an estimate
          </Text>

          {/* Image Upload Area */}
          <View style={styles.uploadContainer}>
            {image ? (
              <View>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Image
                    source={{ uri: image }}
                    style={styles.imagePreview}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={removeImage}
                >
                  <MaterialIcons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <FontAwesome name="car" size={50} color="#001f3d" />
                <Text style={styles.uploadText}>No image selected</Text>
              </View>
            )}

            <View style={styles.uploadButtons}>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <MaterialIcons name="photo-library" size={24} color="#fff" />
                <Text style={styles.buttonText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                <MaterialIcons name="camera-alt" size={24} color="#fff" />
                <Text style={styles.buttonText}>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={estimateCost}
              disabled={loading || !image}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <MaterialIcons name="calculate" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Estimate Cost</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Results Preview */}
          {result && (
            <View style={styles.resultPreview}>
              <Text style={styles.resultTitle}>Quick Estimate</Text>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Damage Type:</Text>
                <Text style={styles.resultValue}>{result.predictedClass}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Confidence:</Text>
                <Text style={styles.resultValue}>{result.confidence}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Severity:</Text>
                <Text style={styles.resultValue}>{result.severity}</Text>
              </View>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={showResultModal}
              >
                <Text style={styles.detailsButtonText}>View Full Details</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Results Modal */}
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={hideResultModal}
        >
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
            <Animated.View
              style={[
                styles.modalContent,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={hideResultModal}
              >
                <MaterialIcons name="close" size={24} color="#001f3d" />
              </TouchableOpacity>

              <ScrollView contentContainerStyle={styles.modalScrollContent}>
                <Text style={styles.modalTitle}>Damage Assessment</Text>

                {image && (
                  <Image
                    source={{ uri: image }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                )}

                <View style={styles.damageInfo}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Damage Type:</Text>
                    <Text style={styles.infoValue}>
                      {result?.predictedClass}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Confidence:</Text>
                    <Text style={styles.infoValue}>{result?.confidence}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Severity:</Text>
                    <Text
                      style={[
                        styles.infoValue,
                        {
                          color:
                            result?.severity === "High"
                              ? "#e74c3c"
                              : result?.severity === "Medium"
                              ? "#f39c12"
                              : "#2ecc71",
                        },
                      ]}
                    >
                      {result?.severity}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Repair:</Text>
                    <Text style={styles.infoValue}>{result?.repair}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Replacement Cost:</Text>
                    <Text style={styles.infoValue}>{result?.replacement}</Text>
                  </View>
                </View>

                <Text style={styles.sectionTitle}>
                  Recommended Repair Shops in Colombo
                </Text>
                <View style={styles.shopList}>
                  {result?.nearbyShops.map((shop, index) => (
                    <View key={index} style={styles.shopItem}>
                      <View style={styles.shopInfo}>
                        <Text style={styles.shopName}>{shop.name}</Text>
                        <Text style={styles.shopAddress}>{shop.address}</Text>
                        <Text style={styles.shopDistance}>
                          {shop.distance} away • Rating: {shop.rating}
                        </Text>
                      </View>
                      <View style={styles.ratingContainer}>
                        <MaterialIcons name="star" size={16} color="#FFD700" />
                      </View>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.modalActionButton}
                  onPress={hideResultModal}
                >
                  <Text style={styles.modalActionText}>Got It</Text>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          </Animated.View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#001f3d",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 30,
  },
  uploadContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    position: "relative",
  },
  uploadPlaceholder: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    borderRadius: 10,
    marginBottom: 15,
  },
  uploadText: {
    color: "#7f8c8d",
    marginTop: 10,
    fontSize: 16,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#f0f4f8",
  },
  removeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  uploadButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#001f3d",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "48%",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#001f3d",
    borderRadius: 8,
    paddingVertical: 15,
    marginBottom: 20,
    shadowColor: "#001f3d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  resultPreview: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#001f3d",
    marginBottom: 15,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  resultValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#001f3d",
  },
  detailsButton: {
    marginTop: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "center",
  },
  detailsButtonText: {
    color: "#0066cc",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalScrollContent: {
    padding: 25,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#001f3d",
    marginBottom: 20,
    textAlign: "center",
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#f0f4f8",
  },
  damageInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#001f3d",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#001f3d",
    marginBottom: 15,
  },
  shopList: {
    marginBottom: 20,
  },
  shopItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#001f3d",
  },
  shopAddress: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 4,
  },
  shopDistance: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalActionButton: {
    backgroundColor: "#001f3d",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  modalActionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DamageCostEstimator;
