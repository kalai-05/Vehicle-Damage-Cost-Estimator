import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "../../Config/FirebaseConfig";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import { MaterialIcons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const ExploreTab = () => {
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [activeTab, setActiveTab] = useState("daily");
  const [chartType, setChartType] = useState("bar"); // 'bar', 'line', or 'pie'
  const [timeRange, setTimeRange] = useState("7d"); // '7d', '14d', '30d'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const dailyRef = ref(db, "/usageData/daily");
    const weeklyRef = ref(db, "/usageData/weekly");
    const monthlyRef = ref(db, "/usageData/monthly");

    onValue(dailyRef, (snapshot) => {
      const data = snapshot.val() || {};
      setDailyData(processDailyData(data));
    });

    onValue(weeklyRef, (snapshot) => {
      const data = snapshot.val() || {};
      setWeeklyData(processWeeklyData(data));
    });

    onValue(monthlyRef, (snapshot) => {
      const data = snapshot.val() || {};
      setMonthlyData(processMonthlyData(data));
    });
  };

  const processDailyData = (data) => {
    return Object.entries(data)
      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
      .slice(-30) // Get last 30 days
      .map(([date, values]) => ({
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        energy: values.energy || 0,
      }));
  };

  const processWeeklyData = (data) => {
    return Object.entries(data)
      .sort(
        ([weekA], [weekB]) =>
          parseInt(weekA.split("-")[1]) - parseInt(weekB.split("-")[1])
      )
      .slice(-12) // Get last 12 weeks
      .map(([week, values]) => ({
        week: `Week ${week.split("-")[1]}`,
        energy: values.totalEnergy || 0,
      }));
  };

  const processMonthlyData = (data) => {
    return Object.entries(data)
      .sort(([monthA], [monthB]) => new Date(monthA) - new Date(monthB))
      .slice(-12) // Get last 12 months
      .map(([month, values]) => ({
        month: new Date(month).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        }),
        energy: values.totalEnergy || 0,
      }));
  };

  const getFilteredData = () => {
    let data = [];
    let labels = [];

    if (activeTab === "daily") {
      data = dailyData;
      const daysToShow = timeRange === "7d" ? 7 : timeRange === "14d" ? 14 : 30;
      data = data.slice(-daysToShow);
      labels = data.map((d) => d.date);
    } else if (activeTab === "weekly") {
      data = weeklyData;
      labels = data.map((d) => d.week);
    } else {
      data = monthlyData;
      labels = data.map((d) => d.month);
    }

    return { data, labels };
  };

  const renderChart = () => {
    const { data, labels } = getFilteredData();
    const chartData = {
      labels,
      datasets: [
        {
          data: data.map((d) => d.energy),
        },
      ],
    };

    const chartConfig = {
      backgroundColor: "#ffffff",
      backgroundGradientFrom: "#ffffff",
      backgroundGradientTo: "#ffffff",
      decimalPlaces: 2,
      color: (opacity = 1) => `rgba(0, 102, 102, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      propsForLabels: {
        fontSize: 10,
      },
      propsForDots: {
        r: "4",
        strokeWidth: "2",
        stroke: "#006666",
      },
      fillShadowGradient: "#006666",
      fillShadowGradientOpacity: 0.2,
    };

    switch (chartType) {
      case "line":
        return (
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={300}
            yAxisLabel="kWh "
            yAxisSuffix=""
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withHorizontalLabels={true}
            withVerticalLabels={true}
            segments={5}
          />
        );
      case "pie":
        return (
          <PieChart
            data={data.map((item, index) => ({
              name:
                activeTab === "daily"
                  ? item.date
                  : activeTab === "weekly"
                  ? item.week
                  : item.month,
              energy: item.energy,
              color: `rgba(0, ${102 + index * 20}, ${102 + index * 10}, 1)`,
              legendFontColor: "#7F7F7F",
              legendFontSize: 12,
            }))}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="energy"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chart}
          />
        );
      default: // bar
        return (
          <BarChart
            data={chartData}
            width={screenWidth - 40}
            height={300}
            yAxisLabel="kWh "
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
            showBarTops={false}
            withHorizontalLabels={true}
            withVerticalLabels={true}
          />
        );
    }
  };

  const renderSummaryCards = () => {
    const { data } = getFilteredData();
    if (data.length === 0) return null;

    const total = data.reduce((sum, item) => sum + item.energy, 0);
    const average = total / data.length;
    const highest = Math.max(...data.map((item) => item.energy));
    const lowest = Math.min(...data.map((item) => item.energy));

    return (
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <MaterialIcons name="show-chart" size={24} color="#006666" />
          <Text style={styles.summaryValue}>{total.toFixed(2)} kWh</Text>
          <Text style={styles.summaryLabel}>Total Usage</Text>
        </View>
        <View style={styles.summaryCard}>
          <MaterialIcons name="equalizer" size={24} color="#006666" />
          <Text style={styles.summaryValue}>{average.toFixed(2)} kWh</Text>
          <Text style={styles.summaryLabel}>Average</Text>
        </View>
        <View style={styles.summaryCard}>
          <MaterialIcons name="arrow-upward" size={24} color="#e74c3c" />
          <Text style={styles.summaryValue}>{highest.toFixed(2)} kWh</Text>
          <Text style={styles.summaryLabel}>Peak</Text>
        </View>
        <View style={styles.summaryCard}>
          <MaterialIcons name="arrow-downward" size={24} color="#27ae60" />
          <Text style={styles.summaryValue}>{lowest.toFixed(2)} kWh</Text>
          <Text style={styles.summaryLabel}>Lowest</Text>
        </View>
      </View>
    );
  };

  const renderTimeRangeSelector = () => {
    if (activeTab !== "daily") return null;

    return (
      <View style={styles.timeRangeContainer}>
        <TouchableOpacity
          style={[
            styles.timeRangeButton,
            timeRange === "7d" && styles.activeTimeRange,
          ]}
          onPress={() => setTimeRange("7d")}
        >
          <Text style={styles.timeRangeText}>7 Days</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.timeRangeButton,
            timeRange === "14d" && styles.activeTimeRange,
          ]}
          onPress={() => setTimeRange("14d")}
        >
          <Text style={styles.timeRangeText}>14 Days</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.timeRangeButton,
            timeRange === "30d" && styles.activeTimeRange,
          ]}
          onPress={() => setTimeRange("30d")}
        >
          <Text style={styles.timeRangeText}>30 Days</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Energy Usage Analytics</Text>
        <View style={styles.chartTypeContainer}>
          <TouchableOpacity
            style={[
              styles.chartTypeButton,
              chartType === "bar" && styles.activeChartType,
            ]}
            onPress={() => setChartType("bar")}
          >
            <MaterialIcons
              name="bar-chart"
              size={20}
              color={chartType === "bar" ? "#fff" : "#006666"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.chartTypeButton,
              chartType === "line" && styles.activeChartType,
            ]}
            onPress={() => setChartType("line")}
          >
            <MaterialIcons
              name="show-chart"
              size={20}
              color={chartType === "line" ? "#fff" : "#006666"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.chartTypeButton,
              chartType === "pie" && styles.activeChartType,
            ]}
            onPress={() => setChartType("pie")}
          >
            <MaterialIcons
              name="pie-chart"
              size={20}
              color={chartType === "pie" ? "#fff" : "#006666"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "daily" && styles.activeTab]}
          onPress={() => setActiveTab("daily")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "daily" && styles.activeTabText,
            ]}
          >
            Daily
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "weekly" && styles.activeTab]}
          onPress={() => setActiveTab("weekly")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "weekly" && styles.activeTabText,
            ]}
          >
            Weekly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "monthly" && styles.activeTab]}
          onPress={() => setActiveTab("monthly")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "monthly" && styles.activeTabText,
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>
      </View>

      {renderTimeRangeSelector()}
      {renderSummaryCards()}
      {renderChart()}

      <View style={styles.insightsContainer}>
        <Text style={styles.insightsTitle}>Usage Insights</Text>
        {activeTab === "daily" && (
          <Text style={styles.insightText}>
            Your energy usage typically peaks around {getPeakTime()} on
            weekdays.
          </Text>
        )}
        {activeTab === "weekly" && (
          <Text style={styles.insightText}>
            Week {getHighestWeek().week} had the highest consumption this month
            at {getHighestWeek().energy} kWh.
          </Text>
        )}
        {activeTab === "monthly" && (
          <Text style={styles.insightText}>
            {getHighestMonth().month} was your highest consumption month at{" "}
            {getHighestMonth().energy} kWh.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

// Helper functions for insights
const getPeakTime = () => "6:00 PM - 9:00 PM";
const getHighestWeek = () => ({ week: "3", energy: "45.2" });
const getHighestMonth = () => ({ month: "July 2023", energy: "185.6" });

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#006666",
  },
  chartTypeContainer: {
    flexDirection: "row",
    backgroundColor: "#e0f2f1",
    borderRadius: 20,
    padding: 2,
  },
  chartTypeButton: {
    padding: 8,
    borderRadius: 16,
    marginHorizontal: 2,
  },
  activeChartType: {
    backgroundColor: "#006666",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#e0f2f1",
    borderRadius: 10,
    padding: 5,
    marginBottom: 15,
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
  timeRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  timeRangeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#e0f2f1",
    flexGrow: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  activeTimeRange: {
    backgroundColor: "#006666",
  },
  timeRangeText: {
    color: "#006666",
    fontSize: 14,
  },
  activeTimeRangeText: {
    color: "#fff",
  },
  chart: {
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  summaryCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#006666",
    marginVertical: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  insightsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#006666",
    marginBottom: 10,
  },
  insightText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});

export default ExploreTab;
