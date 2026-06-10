import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { RewardedAdModal } from "@/components/RewardedAdModal";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export function UsageBanner() {
  const colors = useColors();
  const { plan, dailyUsage, effectiveLimit, canWatchRewardedAd } = useApp();
  const [showAdModal, setShowAdModal] = useState(false);

  const isUnlimited = plan === "pro" || effectiveLimit === Infinity;
  const remaining = isUnlimited ? Infinity : effectiveLimit - dailyUsage;
  const pct = isUnlimited ? 1 : Math.min(dailyUsage / effectiveLimit, 1);
  const limitReached = !isUnlimited && remaining <= 0;

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
    <>
      <View
        style={[
          styles.bannerFree,
          {
            backgroundColor: colors.card,
            borderColor: limitReached ? colors.destructive : colors.border,
          },
        ]}
      >
        <View style={styles.bannerRow}>
          <Text style={[styles.usageLabel, { color: colors.mutedForeground }]}>
            Daily Usage
          </Text>
          <Text style={[styles.usageCount, { color: colors.foreground }]}>
            {dailyUsage}/{effectiveLimit === Infinity ? "∞" : effectiveLimit}
          </Text>
        </View>

        <View style={[styles.progressBg, { backgroundColor: colors.muted }]}>
          <LinearGradient
            colors={
              limitReached
                ? ["#FF4D6D", "#FF4D6D"]
                : remaining <= 3
                  ? ["#F59E0B", "#D97706"]
                  : ["#8B5CF6", "#00D4FF"]
            }
            style={[styles.progressFill, { width: `${pct * 100}%` as any }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>

        {limitReached ? (
          <View style={styles.limitActions}>
            {canWatchRewardedAd && (
              <TouchableOpacity
                style={[styles.adBtn, { backgroundColor: "#1A1500", borderColor: "#F59E0B" }]}
                onPress={() => setShowAdModal(true)}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons name="play-circle" size={15} color="#F59E0B" />
                <Text style={[styles.adBtnText, { color: "#F59E0B" }]}>
                  Watch Ad +5
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.upgradeBtn, { backgroundColor: colors.muted, borderColor: colors.primary }]}
              onPress={() => router.push("/plans")}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="crown-outline" size={15} color={colors.primary} />
              <Text style={[styles.upgradeBtnText, { color: colors.primary }]}>
                Upgrade
              </Text>
            </TouchableOpacity>
          </View>
        ) : remaining <= 3 && remaining > 0 ? (
          <Text style={[styles.warningText, { color: "#F59E0B" }]}>
            {remaining} generation{remaining !== 1 ? "s" : ""} remaining today
          </Text>
        ) : null}
      </View>

      <RewardedAdModal
        visible={showAdModal}
        onClose={() => setShowAdModal(false)}
      />
    </>
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
  limitActions: {
    flexDirection: "row",
    gap: 10,
  },
  adBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  adBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  upgradeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  upgradeBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  warningText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
});
