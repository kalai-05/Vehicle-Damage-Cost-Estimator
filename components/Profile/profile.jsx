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

  // Mock data for damage estimation history
  const damageStats = {
    totalEstimates: 24,
    averageCost: 875, // $
    accuracyRating: "92%",
    favoriteVehicle: "Toyota Camry",
  };

  // Recent estimates mock data
  const recentEstimates = [
    {
      id: 1,
      vehicle: "Honda Civic",
      cost: "$1,245",
      date: "2023-05-15",
      part: "Front Bumper",
    },
    {
      id: 2,
      vehicle: "Ford F-150",
      cost: "$875",
      date: "2023-05-10",
      part: "Passenger Door",
    },
    {
      id: 3,
      vehicle: "Toyota Camry",
      cost: "$420",
      date: "2023-05-05",
      part: "Rear Light",
    },
  ];

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
            <MaterialIcons name="verified" size={20} color="#001f3d" />
          </View>
        </View>
        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.email}>
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      {/* Damage Stats Cards */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Your Damage Analytics</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#e6f2ff" }]}>
              <FontAwesome name="car" size={20} color="#001f3d" />
            </View>
            <Text style={styles.statValue}>{damageStats.totalEstimates}</Text>
            <Text style={styles.statLabel}>Total Estimates</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#e6f2ff" }]}>
              <Ionicons name="cash-outline" size={20} color="#001f3d" />
            </View>
            <Text style={styles.statValue}>${damageStats.averageCost}</Text>
            <Text style={styles.statLabel}>Avg. Repair Cost</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#e6f2ff" }]}>
              <MaterialIcons
                name="precision-manufacturing"
                size={20}
                color="#001f3d"
              />
            </View>
            <Text style={styles.statValue}>{damageStats.accuracyRating}</Text>
            <Text style={styles.statLabel}>Estimate Accuracy</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#e6f2ff" }]}>
              <MaterialIcons name="favorite" size={20} color="#001f3d" />
            </View>
            <Text style={styles.statValue}>{damageStats.favoriteVehicle}</Text>
            <Text style={styles.statLabel}>Most Scanned</Text>
          </View>
        </View>
      </View>

      {/* Recent Estimates */}
      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Recent Estimates</Text>

        {recentEstimates.map((estimate) => (
          <TouchableOpacity key={estimate.id} style={styles.estimateItem}>
            <View style={styles.estimateIcon}>
              <FontAwesome name="car" size={20} color="#001f3d" />
            </View>
            <View style={styles.estimateDetails}>
              <Text style={styles.estimateVehicle}>{estimate.vehicle}</Text>
              <Text style={styles.estimatePart}>{estimate.part}</Text>
              <Text style={styles.estimateDate}>{estimate.date}</Text>
            </View>
            <Text style={styles.estimateCost}>{estimate.cost}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsCard}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <MaterialIcons name="history" size={24} color="#001f3d" />
          </View>
          <Text style={styles.actionText}>Estimate History</Text>
          <MaterialIcons name="chevron-right" size={24} color="#95a5a6" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <MaterialIcons name="garage" size={24} color="#001f3d" />
          </View>
          <Text style={styles.actionText}>My Vehicles</Text>
          <MaterialIcons name="chevron-right" size={24} color="#95a5a6" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <MaterialIcons name="location-on" size={24} color="#001f3d" />
          </View>
          <Text style={styles.actionText}>Nearby Repair Shops</Text>
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
    backgroundColor: "#f5f8fa",
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
    borderColor: "#001f3d",
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
    color: "#001f3d",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#001f3d",
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
    color: "#001f3d",
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
  estimateItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  estimateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e6f2ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  estimateDetails: {
    flex: 1,
  },
  estimateVehicle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#001f3d",
  },
  estimatePart: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  estimateDate: {
    fontSize: 12,
    color: "#bdc3c7",
    marginTop: 2,
  },
  estimateCost: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e74c3c",
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
    backgroundColor: "#001f3d",
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
