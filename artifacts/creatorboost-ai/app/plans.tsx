import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp, type Plan } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  gradient: [string, string];
  planKey: Plan;
  isActive: boolean;
  onSelect: () => void;
  badge?: string;
}

function PlanCard({
  name,
  price,
  period,
  features,
  gradient,
  planKey,
  isActive,
  onSelect,
  badge,
}: PlanCardProps) {
  const colors = useColors();

  return (
    <View style={styles.planWrapper}>
      {badge && (
        <LinearGradient
          colors={gradient}
          style={styles.badge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.badgeText}>{badge}</Text>
        </LinearGradient>
      )}
      <TouchableOpacity
        onPress={onSelect}
        activeOpacity={0.9}
        style={[
          styles.planCard,
          {
            backgroundColor: colors.card,
            borderColor: isActive ? gradient[0] : colors.border,
            borderWidth: isActive ? 2 : 1,
          },
        ]}
      >
        <LinearGradient
          colors={gradient}
          style={styles.planGradientHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.planName}>{name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.planPrice}>{price}</Text>
            <Text style={styles.planPeriod}>/{period}</Text>
          </View>
        </LinearGradient>
        <View style={styles.featuresContainer}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color={gradient[0]} />
              <Text style={[styles.featureText, { color: colors.foreground }]}>{f}</Text>
            </View>
          ))}
        </View>
        {isActive ? (
          <View style={[styles.selectBtn, { backgroundColor: gradient[0] }]}>
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={styles.selectBtnText}>Active Plan</Text>
          </View>
        ) : (
          <LinearGradient
            colors={gradient}
            style={styles.selectBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.selectBtnText}>Choose Plan</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>
    </View>
  );
}

const PLANS = [
  {
    key: "free" as Plan,
    name: "Free",
    price: "₹0",
    period: "forever",
    gradient: ["#4B5563", "#374151"] as [string, string],
    features: [
      "5 AI generations per day",
      "All YouTube tools",
      "All Instagram tools",
      "Copy & share output",
      "Ad-supported",
    ],
  },
  {
    key: "premium" as Plan,
    name: "Premium",
    price: "₹99",
    period: "month",
    gradient: ["#E1306C", "#833AB4"] as [string, string],
    badge: "POPULAR",
    features: [
      "30 AI generations per day",
      "All YouTube & Instagram tools",
      "Ad-free experience",
      "Save history & favorites",
      "Priority generation speed",
    ],
  },
  {
    key: "pro" as Plan,
    name: "Creator Pro",
    price: "₹299",
    period: "month",
    gradient: ["#8B5CF6", "#00D4FF"] as [string, string],
    badge: "BEST VALUE",
    features: [
      "Unlimited AI generations",
      "All tools including Advanced",
      "Competitor Analysis tool",
      "Content Calendar Generator",
      "100% Ad-free",
      "Priority support",
    ],
  },
];

export default function PlansScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { plan, setPlan } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleSelect = async (key: Plan) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setPlan(key);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={["#0F1B3D", "#050B1A"]}
        style={[styles.header, { paddingTop: topPad }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Choose Your Plan
        </Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          Unlock more generations and advanced tools
        </Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 60 }]}
        showsVerticalScrollIndicator={false}
      >
        {PLANS.map((p) => (
          <PlanCard
            key={p.key}
            name={p.name}
            price={p.price}
            period={p.period}
            features={p.features}
            gradient={p.gradient}
            planKey={p.key}
            isActive={plan === p.key}
            onSelect={() => handleSelect(p.key)}
            badge={p.badge}
          />
        ))}
        <Text style={[styles.note, { color: colors.mutedForeground }]}>
          * In production, subscriptions are managed via Google Play Billing. 
          Tap any plan to activate it for demo purposes.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backBtn: { marginBottom: 12, alignSelf: "flex-start" },
  headerTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  headerSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
  content: { padding: 16, gap: 16 },
  planWrapper: { position: "relative" },
  badge: {
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: -12,
    zIndex: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  planCard: {
    borderRadius: 20,
    overflow: "hidden",
  },
  planGradientHeader: {
    padding: 20,
    paddingTop: 28,
  },
  planName: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
    marginTop: 4,
  },
  planPrice: {
    color: "#fff",
    fontSize: 32,
    fontFamily: "Inter_700Bold",
  },
  planPeriod: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginBottom: 5,
  },
  featuresContainer: { padding: 20, gap: 10 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  featureText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  selectBtn: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  selectBtnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  note: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 18,
  },
});
