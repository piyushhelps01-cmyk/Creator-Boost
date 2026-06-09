import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export function UsageBanner() {
  const colors = useColors();
  const { plan, dailyUsage } = useApp();

  const limit = plan === "free" ? 5 : plan === "premium" ? 30 : Infinity;
  const remaining = plan === "pro" ? Infinity : limit - dailyUsage;
  const pct = plan === "pro" ? 1 : Math.min(dailyUsage / limit, 1);

  if (plan === "pro") {
    return (
      <LinearGradient
        colors={["#8B5CF6", "#00D4FF"]}
        style={styles.banner}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.bannerText}>Creator Pro — Unlimited Generations</Text>
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.bannerFree, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.bannerRow}>
        <Text style={[styles.usageLabel, { color: colors.mutedForeground }]}>
          Daily Usage
        </Text>
        <Text style={[styles.usageCount, { color: colors.foreground }]}>
          {dailyUsage}/{limit === Infinity ? "∞" : limit}
        </Text>
      </View>
      <View style={[styles.progressBg, { backgroundColor: colors.muted }]}>
        <LinearGradient
          colors={remaining <= 1 ? ["#FF4D6D", "#FF4D6D"] : ["#8B5CF6", "#00D4FF"]}
          style={[styles.progressFill, { width: `${pct * 100}%` as any }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
      {remaining <= 0 && (
        <TouchableOpacity onPress={() => router.push("/plans")}>
          <Text style={[styles.upgradeText, { color: colors.primary }]}>
            Limit reached — Upgrade to continue
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  bannerText: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  bannerFree: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  bannerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  usageLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  usageCount: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  progressBg: {
    height: 5,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  upgradeText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
});
