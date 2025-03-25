import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "../Config/FirebaseConfig";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { MaterialIcons } from "@expo/vector-icons";

// Sri Lanka Electricity Board tariff rates (as of 2023)
const calculateCost = (units) => {
  let cost = 0;

  if (units <= 30) {
    cost = units * 8.0;
  } else if (units <= 60) {
    cost = 30 * 8.0 + (units - 30) * 10.0;
  } else if (units <= 90) {
    cost = 30 * 8.0 + 30 * 10.0 + (units - 60) * 16.0;
  } else if (units <= 120) {
    cost = 30 * 8.0 + 30 * 10.0 + 30 * 16.0 + (units - 90) * 50.0;
  } else if (units <= 180) {
    cost = 30 * 8.0 + 30 * 10.0 + 30 * 16.0 + 30 * 50.0 + (units - 120) * 75.0;
  } else {
    cost =
      30 * 8.0 +
      30 * 10.0 +
      30 * 16.0 +
      30 * 50.0 +
      60 * 75.0 +
      (units - 180) * 100.0;
  }

  // Add fixed charges
  if (units <= 30) cost += 120;
  else if (units <= 60) cost += 240;
  else if (units <= 90) cost += 480;
  else if (units <= 120) cost += 720;
  else if (units <= 180) cost += 1200;
  else cost += 2400;

  return cost;
};

const CostPrediction = () => {
  const [energy, setEnergy] = useState(0);
  const [currentPower, setCurrentPower] = useState(0);
  const [consumptionRate, setConsumptionRate] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeTab, setActiveTab] = useState("current"); // 'current' or 'projected'

  useEffect(() => {
    const energyRef = ref(db, "/energyData/energy");
    const powerRef = ref(db, "/energyData/power");
    const timestampRef = ref(db, "/energyData/timestamp");

    onValue(energyRef, (snapshot) => setEnergy(snapshot.val() || 0));
    onValue(powerRef, (snapshot) => {
      const powerInWatts = snapshot.val() || 0;
      setCurrentPower(powerInWatts);
      setConsumptionRate(powerInWatts / 1000);
    });
    onValue(timestampRef, (snapshot) =>
      setLastUpdated(new Date(snapshot.val()))
    );
  }, []);

  // Cost calculations
  const costPerMonth = calculateCost(energy);
  const costPerDay = costPerMonth / 30;
  const costPerHour = costPerDay / 24;
  const projectedDailyUsage = consumptionRate * 24;
  const projectedMonthlyUsage = consumptionRate * 24 * 30;
  const projectedMonthlyCost = calculateCost(projectedMonthlyUsage);

  const calculateTimeToThreshold = (threshold) => {
    if (consumptionRate <= 0) return "N/A";
    const remainingUnits = threshold - energy;
    if (remainingUnits <= 0) return "Threshold reached";
    const hours = remainingUnits / consumptionRate;
    return hours < 24
      ? `${hours.toFixed(1)} hours`
      : `${(hours / 24).toFixed(1)} days`;
  };

  const getTariffTier = () => {
    if (energy <= 30) return { name: "Tier 1", color: "#27ae60" };
    if (energy <= 60) return { name: "Tier 2", color: "#2ecc71" };
    if (energy <= 90) return { name: "Tier 3", color: "#f39c12" };
    if (energy <= 120) return { name: "Tier 4", color: "#e67e22" };
    if (energy <= 180) return { name: "Tier 5", color: "#d35400" };
    return { name: "Tier 6", color: "#e74c3c" };
  };

  const tariffTier = getTariffTier();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Cost Prediction</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "current" && styles.activeTab]}
          onPress={() => setActiveTab("current")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "current" && styles.activeTabText,
            ]}
          >
            Current Usage
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "projected" && styles.activeTab]}
          onPress={() => setActiveTab("projected")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "projected" && styles.activeTabText,
            ]}
          >
            Projections
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gaugeContainer}>
        <AnimatedCircularProgress
          size={Dimensions.get("window").width * 0.6}
          width={20}
          fill={(energy / 500) * 100}
          tintColor={tariffTier.color}
          backgroundColor="#e0f2f1"
          rotation={0}
          lineCap="round"
        >
          {() => (
            <View style={styles.gaugeTextContainer}>
              <Text style={styles.energyValueText}>
                {energy.toFixed(2)} kWh
              </Text>
              <Text style={styles.powerText}>{currentPower.toFixed(2)} W</Text>
              <Text style={[styles.tariffText, { color: tariffTier.color }]}>
                {tariffTier.name}
              </Text>
            </View>
          )}
        </AnimatedCircularProgress>
        <Text style={styles.rateText}>
          {consumptionRate.toFixed(4)} kWh/hour
        </Text>
      </View>

      {activeTab === "current" ? (
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="attach-money" size={24} color="#006666" />
              <Text style={styles.cardTitle}>Current Billing</Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Hourly Cost:</Text>
              <Text style={styles.metricValue}>
                {costPerHour.toFixed(2)} LKR
              </Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Daily Cost:</Text>
              <Text style={styles.metricValue}>
                {costPerDay.toFixed(2)} LKR
              </Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Monthly Cost:</Text>
              <Text style={styles.metricValue}>
                {costPerMonth.toFixed(2)} LKR
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="warning" size={24} color="#e74c3c" />
              <Text style={styles.cardTitle}>Tariff Thresholds</Text>
            </View>

            <View style={styles.thresholdContainer}>
              <View style={styles.thresholdRow}>
                <Text style={styles.thresholdLabel}>60 units:</Text>
                <Text style={styles.thresholdValue}>
                  {calculateTimeToThreshold(60)}
                </Text>
              </View>
              <View style={styles.thresholdRow}>
                <Text style={styles.thresholdLabel}>90 units:</Text>
                <Text style={styles.thresholdValue}>
                  {calculateTimeToThreshold(90)}
                </Text>
              </View>
              <View style={styles.thresholdRow}>
                <Text style={styles.thresholdLabel}>120 units:</Text>
                <Text style={styles.thresholdValue}>
                  {calculateTimeToThreshold(120)}
                </Text>
              </View>
              <View style={styles.thresholdRow}>
                <Text style={styles.thresholdLabel}>180 units:</Text>
                <Text style={styles.thresholdValue}>
                  {calculateTimeToThreshold(180)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="trending-up" size={24} color="#006666" />
              <Text style={styles.cardTitle}>Projected Usage</Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Daily Usage:</Text>
              <Text style={styles.metricValue}>
                {projectedDailyUsage.toFixed(2)} kWh
              </Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Monthly Usage:</Text>
              <Text style={styles.metricValue}>
                {projectedMonthlyUsage.toFixed(2)} kWh
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="money-off" size={24} color="#e74c3c" />
              <Text style={styles.cardTitle}>Projected Costs</Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Daily Cost:</Text>
              <Text style={styles.metricValue}>
                {calculateCost(projectedDailyUsage).toFixed(2)} LKR
              </Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Monthly Cost:</Text>
              <Text style={styles.metricValue}>
                {projectedMonthlyCost.toFixed(2)} LKR
              </Text>
            </View>
          </View>
        </View>
      )}

      {lastUpdated && (
        <Text style={styles.updateText}>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </Text>
      )}
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
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#e0f2f1",
    borderRadius: 10,
    padding: 5,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexGrow: 1,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#006666",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#006666",
  },
  activeTabText: {
    color: "#fff",
  },
  gaugeContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 25,
    width: "100%",
  },
  gaugeTextContainer: {
    alignItems: "center",
  },
  energyValueText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  powerText: {
    fontSize: 18,
    color: "#7f8c8d",
  },
  tariffText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  rateText: {
    fontSize: 16,
    color: "#006666",
    fontWeight: "bold",
    marginTop: 10,
  },
  cardContainer: {
    width: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0f2f1",
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#006666",
    marginLeft: 10,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
  },
  thresholdContainer: {
    marginTop: 5,
  },
  thresholdRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  thresholdLabel: {
    fontSize: 15,
    color: "#7f8c8d",
  },
  thresholdValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#e74c3c",
  },
  updateText: {
    fontSize: 12,
    color: "#95a5a6",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
});

export default CostPrediction;
