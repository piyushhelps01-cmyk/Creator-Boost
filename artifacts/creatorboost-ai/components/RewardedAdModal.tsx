import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface RewardedAdModalProps {
  visible: boolean;
  onClose: () => void;
  /** Called after reward is granted so caller can retry generation */
  onRewarded?: () => void;
}

type Phase = "offer" | "watching" | "rewarded";

const AD_DURATION = 5; // seconds

export function RewardedAdModal({
  visible,
  onClose,
  onRewarded,
}: RewardedAdModalProps) {
  const colors = useColors();
  const { grantRewardedBonus, canWatchRewardedAd, rewardedWatchCount } = useApp();

  const [phase, setPhase] = useState<Phase>("offer");
  const [countdown, setCountdown] = useState(AD_DURATION);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset state whenever modal opens
  useEffect(() => {
    if (visible) {
      setPhase("offer");
      setCountdown(AD_DURATION);
      progressAnim.setValue(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [visible]);

  const startAd = () => {
    setPhase("watching");
    setCountdown(AD_DURATION);
    progressAnim.setValue(0);

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: AD_DURATION * 1000,
      useNativeDriver: false,
    }).start();

    let remaining = AD_DURATION;
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        grantRewardedBonus();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setPhase("rewarded");
      }
    }, 1000);
  };

  const handleClose = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (phase === "rewarded" && onRewarded) onRewarded();
    onClose();
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const adsRemaining = 3 - rewardedWatchCount - (phase === "rewarded" ? 1 : 0);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={phase === "watching" ? undefined : handleClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={phase === "watching" ? undefined : handleClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View
            style={[
              styles.sheet,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {/* ── OFFER PHASE ── */}
            {phase === "offer" && (
              <>
                <View style={styles.iconRow}>
                  <LinearGradient
                    colors={["#F59E0B", "#D97706"]}
                    style={styles.iconCircle}
                  >
                    <MaterialCommunityIcons
                      name="play-circle-outline"
                      size={32}
                      color="#fff"
                    />
                  </LinearGradient>
                </View>

                <Text style={[styles.title, { color: colors.foreground }]}>
                  Watch Ad for +5 Generations
                </Text>
                <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                  You've used all 15 free generations today. Watch a short ad
                  to unlock 5 more — instantly.
                </Text>

                <View
                  style={[styles.infoBox, { backgroundColor: colors.muted, borderColor: colors.border }]}
                >
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={16}
                    color={colors.accent}
                  />
                  <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
                    {canWatchRewardedAd
                      ? `You can watch up to ${adsRemaining + (phase === "rewarded" ? 0 : 0)} more ad${adsRemaining !== 1 ? "s" : ""} today`
                      : "You've used all ad rewards for today"}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={startAd}
                  activeOpacity={0.9}
                  disabled={!canWatchRewardedAd}
                >
                  <LinearGradient
                    colors={canWatchRewardedAd ? ["#F59E0B", "#D97706"] : ["#333", "#333"]}
                    style={styles.watchBtn}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <MaterialCommunityIcons name="play" size={20} color="#fff" />
                    <Text style={styles.watchBtnText}>Watch Ad (5 seconds)</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.upgradeBtn, { borderColor: colors.primary }]}
                  onPress={() => { onClose(); router.push("/plans"); }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trophy-outline" size={16} color={colors.primary} />
                  <Text style={[styles.upgradeBtnText, { color: colors.primary }]}>
                    Upgrade for Unlimited Access
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleClose} style={styles.dismissBtn}>
                  <Text style={[styles.dismissText, { color: colors.mutedForeground }]}>
                    Maybe later
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* ── WATCHING PHASE ── */}
            {phase === "watching" && (
              <>
                <View style={styles.adPlaceholder}>
                  <LinearGradient
                    colors={["#0F1B3D", "#1A2B5C"]}
                    style={styles.adScreen}
                  >
                    <MaterialCommunityIcons
                      name="advertisement"
                      size={48}
                      color={colors.mutedForeground}
                    />
                    <Text style={[styles.adLabel, { color: colors.mutedForeground }]}>
                      Ad Playing...
                    </Text>
                    <Text style={[styles.adHint, { color: colors.mutedForeground }]}>
                      (In production, a real AdMob rewarded ad appears here)
                    </Text>
                  </LinearGradient>
                </View>

                <View style={styles.countdownRow}>
                  <Text style={[styles.countdownLabel, { color: colors.mutedForeground }]}>
                    Ad ends in
                  </Text>
                  <Text style={[styles.countdownNumber, { color: colors.foreground }]}>
                    {countdown}s
                  </Text>
                </View>

                <View style={[styles.progressBg, { backgroundColor: colors.muted }]}>
                  <Animated.View style={[styles.progressFill, { width: progressWidth as any }]}>
                    <LinearGradient
                      colors={["#F59E0B", "#D97706"]}
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </Animated.View>
                </View>

                <Text style={[styles.watchingHint, { color: colors.mutedForeground }]}>
                  Please wait — closing early won't grant the reward
                </Text>
              </>
            )}

            {/* ── REWARDED PHASE ── */}
            {phase === "rewarded" && (
              <>
                <View style={styles.iconRow}>
                  <LinearGradient
                    colors={["#10B981", "#059669"]}
                    style={styles.iconCircle}
                  >
                    <Ionicons name="checkmark" size={36} color="#fff" />
                  </LinearGradient>
                </View>

                <Text style={[styles.title, { color: colors.foreground }]}>
                  +5 Generations Unlocked!
                </Text>
                <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                  Great job! You've earned 5 extra AI generations for today.
                  {adsRemaining > 0
                    ? ` You can watch ${adsRemaining} more ad${adsRemaining !== 1 ? "s" : ""} today.`
                    : " You've used all available ad rewards for today."}
                </Text>

                <TouchableOpacity onPress={handleClose} activeOpacity={0.9}>
                  <LinearGradient
                    colors={["#10B981", "#059669"]}
                    style={styles.watchBtn}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                    <Text style={styles.watchBtnText}>Continue Generating</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 24,
    gap: 16,
    alignItems: "center",
  },
  iconRow: {
    alignItems: "center",
    marginTop: 8,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: "stretch",
  },
  infoText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  watchBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignSelf: "stretch",
  },
  watchBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  upgradeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1,
    alignSelf: "stretch",
  },
  upgradeBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  dismissBtn: {
    paddingVertical: 6,
    marginBottom: 8,
  },
  dismissText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  // Watching phase
  adPlaceholder: {
    alignSelf: "stretch",
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
  },
  adScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  adLabel: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  adHint: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  countdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },
  countdownLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  countdownNumber: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  progressBg: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    alignSelf: "stretch",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  watchingHint: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginBottom: 8,
  },
});
