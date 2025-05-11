import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Image,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const navigation = useNavigation();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const bannerInterval = useRef(null);

  // Banner data
  const banners = [
    {
      id: 1,
      title: "Instant Damage Assessment",
      description: "Get accurate estimates in seconds",
      image: require("../../assets/images/banner1.png"),
    },
    {
      id: 2,
      title: "Find Affordable Parts",
      description: "Compare prices from local suppliers",
      image: require("../../assets/images/banner2.png"),
    },
    {
      id: 3,
      title: "Certified Repair Shops",
      description: "Connect with trusted professionals",
      image: require("../../assets/images/banner3.png"),
    },
  ];

  // Recent estimates data
  const recentEstimates = [
    {
      id: 1,
      vehicle: "Toyota Camry 2020",
      damageType: "Front Collision",
      date: "Today, 10:30 AM",
      estimate: "$1,250 - $1,800",
    },
    {
      id: 2,
      vehicle: "Honda Civic 2018",
      damageType: "Side Scratch",
      date: "Yesterday, 4:15 PM",
      estimate: "$450 - $600",
    },
  ];

  useEffect(() => {
    // Auto-scroll banners
    bannerInterval.current = setInterval(() => {
      setCurrentBannerIndex((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(bannerInterval.current);
  }, []);

  const renderBannerItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: "clamp",
    });

    return (
      <Animated.View style={[styles.bannerItem, { transform: [{ scale }] }]}>
        <Image source={item.image} style={styles.bannerImage} />
        <View style={styles.bannerOverlay} />
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle}>{item.title}</Text>
          <Text style={styles.bannerDescription}>{item.description}</Text>
        </View>
      </Animated.View>
    );
  };

  const renderEstimateItem = ({ item }) => (
    <TouchableOpacity style={styles.estimateItem}>
      <View style={styles.estimateContent}>
        <Text style={styles.estimateVehicle}>{item.vehicle}</Text>
        <Text style={styles.estimateDamage}>{item.damageType}</Text>
        <View style={styles.estimateMeta}>
          <Text style={styles.estimateDate}>{item.date}</Text>
          <Text style={styles.estimateAmount}>{item.estimate}</Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#001f3d" />
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Animatable.View animation="fadeIn" duration={800} style={styles.header}>
        <Text style={styles.greeting}>Vehicle Damage Estimator</Text>
        <Text style={styles.subtitle}>Accurate repair cost assessments</Text>
      </Animatable.View>

      {/* Auto-sliding Banner */}
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        style={styles.bannerContainer}
      >
        <Animated.FlatList
          data={banners}
          renderItem={renderBannerItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentBannerIndex(newIndex);
            clearInterval(bannerInterval.current);
            bannerInterval.current = setInterval(() => {
              setCurrentBannerIndex((prev) =>
                prev === banners.length - 1 ? 0 : prev + 1
              );
            }, 5000);
          }}
          getItemLayout={(data, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
        <View style={styles.pagination}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentBannerIndex === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </Animatable.View>

      {/* Main Action Button */}
      <Animatable.View
        animation="fadeInUp"
        duration={800}
        delay={200}
        style={styles.mainActionContainer}
      >
        <TouchableOpacity
          style={styles.mainActionButton}
          onPress={() => navigation.navigate("cost")}
        >
          <View style={styles.mainActionIcon}>
            <FontAwesome name="camera" size={28} color="#fff" />
          </View>
          <Text style={styles.mainActionText}>New Damage Assessment</Text>
          <Text style={styles.mainActionSubtext}>
            Take photos to estimate repair costs
          </Text>
        </TouchableOpacity>
      </Animatable.View>

      {/* Recent Estimates */}
      <Animatable.View
        animation="fadeInUp"
        duration={800}
        delay={400}
        style={styles.section}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Estimates</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {recentEstimates.length > 0 ? (
          recentEstimates.map((item) => (
            <View key={item.id}>{renderEstimateItem({ item })}</View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="history" size={40} color="#001f3d" />
            <Text style={styles.emptyStateText}>No recent estimates</Text>
            <Text style={styles.emptyStateSubtext}>
              Start by creating a new damage assessment
            </Text>
          </View>
        )}
      </Animatable.View>

      {/* Quick Tips Section */}
      <Animatable.View
        animation="fadeInUp"
        duration={800}
        delay={600}
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>Quick Tips</Text>
        <View style={styles.tipsContainer}>
          <View style={styles.tipCard}>
            <View style={[styles.tipIcon, { backgroundColor: "#e6f7ff" }]}>
              <MaterialIcons name="photo-camera" size={24} color="#001f3d" />
            </View>
            <Text style={styles.tipText}>
              Take clear photos from multiple angles for best results
            </Text>
          </View>

          <View style={styles.tipCard}>
            <View style={[styles.tipIcon, { backgroundColor: "#e6f7ff" }]}>
              <MaterialIcons
                name="lightbulb-outline"
                size={24}
                color="#001f3d"
              />
            </View>
            <Text style={styles.tipText}>
              Compare estimates from different repair shops
            </Text>
          </View>
        </View>
      </Animatable.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f8fa",
    paddingBottom: 30,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#001f3d",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  bannerContainer: {
    height: 200,
    marginBottom: 20,
  },
  bannerItem: {
    width: width - 40,
    height: 180,
    borderRadius: 15,
    marginHorizontal: 20,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20, 21, 21, 0.3)",
  },
  bannerTextContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  bannerDescription: {
    fontSize: 16,
    color: "#fff",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(20, 21, 21, 0.3)",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: "#001f3d",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#001f3d",
  },
  seeAll: {
    color: "#001f3d",
    fontSize: 14,
  },
  mainActionContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  mainActionButton: {
    backgroundColor: "#001f3d",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    elevation: 3,
  },
  mainActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  mainActionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
    textAlign: "center",
  },
  mainActionSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  estimateItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },
  estimateContent: {
    flex: 1,
  },
  estimateVehicle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#001f3d",
    marginBottom: 3,
  },
  estimateDamage: {
    fontSize: 14,
    color: "#001f3d",
    marginBottom: 8,
  },
  estimateMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  estimateDate: {
    fontSize: 13,
    color: "#7f8c8d",
  },
  estimateAmount: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#001f3d",
  },
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 10,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#bdc3c7",
    textAlign: "center",
  },
  tipsContainer: {
    marginTop: 10,
  },
  tipCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    color: "#001f3d",
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#001f3d",
  },
});

export default HomeScreen;
