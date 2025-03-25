import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  // Mock data for energy savings
  const energyStats = {
    totalSaved: 1245, // kWh
    monthlyAverage: 87,
    carbonReduction: 345, // kg
    efficiencyRating: "B+",
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: user?.imageUrl }} style={styles.profileImage} />
          <View style={styles.verifiedBadge}>
            <MaterialIcons name="verified" size={20} color="#006666" />
          </View>
        </View>
        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.email}>
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      {/* Energy Stats Cards */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Your Energy Impact</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#e0f2f1" }]}>
              <FontAwesome name="bolt" size={20} color="#006666" />
            </View>
            <Text style={styles.statValue}>{energyStats.totalSaved} kWh</Text>
            <Text style={styles.statLabel}>Total Saved</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#e0f2f1" }]}>
              <Ionicons name="leaf-outline" size={20} color="#006666" />
            </View>
            <Text style={styles.statValue}>
              {energyStats.carbonReduction} kg
            </Text>
            <Text style={styles.statLabel}>CO₂ Reduced</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#e0f2f1" }]}>
              <MaterialIcons name="equalizer" size={20} color="#006666" />
            </View>
            <Text style={styles.statValue}>
              {energyStats.monthlyAverage} kWh
            </Text>
            <Text style={styles.statLabel}>Monthly Avg</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#e0f2f1" }]}>
              <MaterialIcons name="star" size={20} color="#006666" />
            </View>
            <Text style={styles.statValue}>{energyStats.efficiencyRating}</Text>
            <Text style={styles.statLabel}>Efficiency</Text>
          </View>
        </View>
      </View>

      {/* User Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Account Details</Text>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <MaterialIcons name="cake" size={20} color="#006666" />
          </View>
          <Text style={styles.label}>Birthday:</Text>
          <Text style={styles.value}>
            {user?.birthday
              ? new Date(user.birthday).toDateString()
              : "Not set"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <MaterialIcons name="event" size={20} color="#006666" />
          </View>
          <Text style={styles.label}>Joined on:</Text>
          <Text style={styles.value}>
            {new Date(user?.createdAt).toDateString()}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <MaterialIcons name="security" size={20} color="#006666" />
          </View>
          <Text style={styles.label}>Account Status:</Text>
          <Text style={[styles.value, { color: "#27ae60" }]}>Verified</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsCard}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <MaterialIcons name="settings" size={24} color="#006666" />
          </View>
          <Text style={styles.actionText}>App Settings</Text>
          <MaterialIcons name="chevron-right" size={24} color="#95a5a6" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <MaterialIcons name="help-outline" size={24} color="#006666" />
          </View>
          <Text style={styles.actionText}>Help & Support</Text>
          <MaterialIcons name="chevron-right" size={24} color="#95a5a6" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <MaterialIcons name="share" size={24} color="#006666" />
          </View>
          <Text style={styles.actionText}>Share App</Text>
          <MaterialIcons name="chevron-right" size={24} color="#95a5a6" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

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
    alignItems: "center",
    marginBottom: 25,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#006666",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 3,
    elevation: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#006666",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#006666",
    marginBottom: 15,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  detailIcon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: "#7f8c8d",
    marginRight: 10,
    flexGrow: 1,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    flexGrow: 2,
  },
  actionsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  actionIcon: {
    marginRight: 15,
  },
  actionText: {
    fontSize: 16,
    color: "#2c3e50",
    flexGrow: 1,
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
