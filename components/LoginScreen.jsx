import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import React from "react";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";

const { width, height } = Dimensions.get("window");

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
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
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/images/login.png")}
          style={styles.loginImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>
          Your{" "}
          <Text style={styles.highlightText}>
            Smart Home Electricity Management{" "}
          </Text>
          Companion
        </Text>
        <Text style={styles.subtitleText}>
          Track, Analyze, and Control Your Home's Electricity—Save Energy, Save
          Money!
        </Text>
        <TouchableOpacity style={styles.loginButton} onPress={onPress}>
          <Text style={styles.buttonText}>Let's Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    flex: 1,
  },
  loginImage: {
    width: width * 0.8, // 80% of screen width
    height: height * 0.3, // 30% of screen height
    maxWidth: 400, // Maximum size for tablets
    maxHeight: 300, // Maximum size for tablets
  },
  contentContainer: {
    backgroundColor: "#ffffff",
    padding: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    flex: 1,
  },
  titleText: {
    fontFamily: "poppins",
    fontSize: width > 400 ? 28 : 24, // Larger on tablets
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 15,
    color: "#333333",
  },
  highlightText: {
    color: "#006666",
    fontWeight: "bold",
  },
  subtitleText: {
    fontFamily: "poppins",
    fontSize: width > 400 ? 16 : 14,
    textAlign: "center",
    paddingHorizontal: 20,
    color: "#8f8f8f",
    marginBottom: 30,
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: "#006666",
    padding: 16,
    borderRadius: 99,
    marginHorizontal: 20,
    shadowColor: "#006666",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontFamily: "poppins",
    fontSize: width > 400 ? 22 : 20,
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "600",
  },
});
