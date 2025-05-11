import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <LinearGradient colors={["#001f3d", "#003366"]} style={styles.container}>
      {/* Animated Logo */}
      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.loginImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Content */}
      <Animated.View
        style={[
          styles.contentContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.titleText}>
          Your{" "}
          <Text style={styles.highlightText}>
            Vehicle Damage Cost Estimator
          </Text>
        </Text>
        <Text style={styles.subtitleText}>
          Get instant repair estimates, find affordable parts, and connect with
          trusted repair shops
        </Text>

        {/* Login Button with animation */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={onPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#0066cc", "#001f3d"]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <MaterialIcons name="login" size={24} color="white" />
              <Text style={styles.buttonText}>Continue with Google</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Additional options */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>By continuing, you agree to our</Text>
          <View style={styles.linksContainer}>
            <TouchableOpacity>
              <Text style={styles.linkText}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}> and </Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    flex: 1,
  },
  loginImage: {
    width: width * 0.8,
    height: height * 0.3,
    maxWidth: 400,
    maxHeight: 300,
    tintColor: "white", // Makes logo white to stand out against dark background
  },
  contentContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 30,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -20,
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  titleText: {
    fontSize: width > 400 ? 28 : 24,
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 15,
    color: "white",
    fontWeight: "600",
  },
  highlightText: {
    color: "#4ECDC4", // Teal accent color
    fontWeight: "bold",
  },
  subtitleText: {
    fontSize: width > 400 ? 16 : 14,
    textAlign: "center",
    paddingHorizontal: 20,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 30,
    lineHeight: 22,
  },
  loginButton: {
    width: width * 0.8,
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientButton: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: width > 400 ? 18 : 16,
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "600",
    marginLeft: 10,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
  },
  linksContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  linkText: {
    color: "#4ECDC4",
    fontSize: 12,
    textDecorationLine: "underline",
  },
});
