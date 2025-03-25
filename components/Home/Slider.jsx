import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { ref, onValue, set } from "firebase/database";
import { db } from "../../Config/FirebaseConfig";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const Slider = () => {
  const [current, setCurrent] = useState(0);
  const [power, setPower] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [relayState, setRelayState] = useState(false);
  const buttonAnimation = new Animated.Value(0);

  useEffect(() => {
    const currentRef = ref(db, "/energyData/current");
    const powerRef = ref(db, "/energyData/power");
    const energyRef = ref(db, "/energyData/energy");
    const relayRef = ref(db, "/relay/state");

    onValue(currentRef, (snapshot) => setCurrent(snapshot.val() || 0));
    onValue(powerRef, (snapshot) => setPower(snapshot.val() || 0));
    onValue(energyRef, (snapshot) => setEnergy(snapshot.val() || 0));
    onValue(relayRef, (snapshot) => setRelayState(snapshot.val() || false));
  }, []);

  const toggleRelay = () => {
    const newRelayState = !relayState;
    set(ref(db, "/relay/state"), newRelayState);

    if (!newRelayState) {
      setCurrent(0);
      setPower(0);
      setEnergy(0);
    }

    Animated.sequence([
      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnimation, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const buttonScale = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Energy Monitoring</Text>
      </View>

      {/* Main Gauges */}
      <View style={styles.gaugeRow}>
        <View style={styles.gaugeCard}>
          <AnimatedCircularProgress
            size={width * 0.28}
            width={12}
            fill={(current / 30) * 100}
            tintColor="#006666"
            backgroundColor="#e0f2f1"
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View style={styles.gaugeTextContainer}>
                <Text style={styles.gaugeValue}>{current.toFixed(2)}</Text>
                <Text style={styles.gaugeUnit}>Amps</Text>
              </View>
            )}
          </AnimatedCircularProgress>
          <Text style={styles.gaugeLabel}>CURRENT</Text>
        </View>

        <View style={styles.gaugeCard}>
          <AnimatedCircularProgress
            size={width * 0.28}
            width={12}
            fill={(power / 5000) * 100}
            tintColor="#e74c3c"
            backgroundColor="#fde8e8"
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View style={styles.gaugeTextContainer}>
                <Text style={styles.gaugeValue}>{power.toFixed(2)}</Text>
                <Text style={styles.gaugeUnit}>Watts</Text>
              </View>
            )}
          </AnimatedCircularProgress>
          <Text style={styles.gaugeLabel}>POWER</Text>
        </View>

        <View style={styles.gaugeCard}>
          <AnimatedCircularProgress
            size={width * 0.28}
            width={12}
            fill={(energy / 100) * 100}
            tintColor="#27ae60"
            backgroundColor="#e8f8f0"
            rotation={0}
            lineCap="round"
          >
            {() => (
              <View style={styles.gaugeTextContainer}>
                <Text style={styles.gaugeValue}>{energy.toFixed(2)}</Text>
                <Text style={styles.gaugeUnit}>kWh</Text>
              </View>
            )}
          </AnimatedCircularProgress>
          <Text style={styles.gaugeLabel}>ENERGY</Text>
        </View>
      </View>

      {/* Usage Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <MaterialIcons name="flash-on" size={24} color="#006666" />
          <Text style={styles.summaryLabel}>Current Usage:</Text>
          <Text style={styles.summaryValue}>{power.toFixed(2)} W</Text>
        </View>
        <View style={styles.summaryRow}>
          <MaterialIcons name="timeline" size={24} color="#006666" />
          <Text style={styles.summaryLabel}>Today's Consumption:</Text>
          <Text style={styles.summaryValue}>{energy.toFixed(2)} kWh</Text>
        </View>
      </View>

      {/* Device Control */}
      <Animated.View
        style={[styles.controlCard, { transform: [{ scale: buttonScale }] }]}
      >
        <View style={styles.controlHeader}>
          <MaterialIcons name="lightbulb-outline" size={28} color="#006666" />
          <Text style={styles.controlTitle}>Light Control</Text>
        </View>

        <View style={styles.controlBody}>
          <Text
            style={[
              styles.controlStatus,
              { color: relayState ? "#27ae60" : "#e74c3c" },
            ]}
          >
            {relayState ? "ON" : "OFF"}
          </Text>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              { backgroundColor: relayState ? "#27ae60" : "#e0f2f1" },
            ]}
            onPress={toggleRelay}
          >
            <View
              style={[
                styles.toggleCircle,
                {
                  backgroundColor: "#fff",
                  alignSelf: relayState ? "flex-end" : "flex-start",
                },
              ]}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f4f8",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#006666",
    textAlign: "center",
  },
  gaugeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  gaugeCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    width: "32%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  gaugeTextContainer: {
    alignItems: "center",
  },
  gaugeValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  gaugeUnit: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  gaugeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#006666",
    marginTop: 10,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#7f8c8d",
    marginLeft: 10,
    flexGrow: 1,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
  },
  controlCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  controlHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  controlTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#006666",
    marginLeft: 10,
  },
  controlBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  controlStatus: {
    fontSize: 18,
    fontWeight: "bold",
  },
  toggleButton: {
    width: 60,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    width: "32%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  actionText: {
    fontSize: 14,
    color: "#006666",
    marginTop: 5,
    fontWeight: "500",
  },
});

export default Slider;
