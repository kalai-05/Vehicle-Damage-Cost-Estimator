import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";

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
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <View>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 100,
        }}
      >
        <Image
          source={require("../assets/images/login.png")}
          style={{
            width: 220,
            height: 450,
            padding: 4,
            alignItems: "center",
            borderColor: "#000",
            borderRadius: 20,
            borderWidth: 6,
          }}
        />
      </View>
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          marginTop: -50,
        }}
      >
        <Text
          style={{
            fontFamily: "poppins",
            fontSize: 25,
            textAlign: "center",
          }}
        >
          {" "}
          Your Ultimate{" "}
          <Text
            style={{
              color: "#7F57F1",
            }}
          >
            Community Business Directory{" "}
          </Text>
          App
        </Text>
        <Text
          style={{
            fontFamily: "poppins",
            fontSize: 15,
            textAlign: "center",
            padding: 10,
            color: "#8f8f8f",
          }}
        >
          Find Your Favorite Business Near You And Post Your Own Business To
          Your Community
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#7F57F1",
            padding: 16,
            borderRadius: 99,
            margin: 20,
          }}
          onPress={onPress}
        >
          <Text
            style={{
              fontFamily: "poppins",
              fontSize: 25,
              textAlign: "center",
              color: "#ffffff",
            }}
          >
            Let's Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
