import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useColors } from "@/hooks/useColors";

interface CategoryTabProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  activeColor: string;
  activeColor2: string;
}

export function CategoryTab({
  label,
  isActive,
  onPress,
  activeColor,
  activeColor2,
}: CategoryTabProps) {
  const colors = useColors();

  if (isActive) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <LinearGradient
          colors={[activeColor, activeColor2]}
          style={styles.activeTab}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.activeLabel}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.inactiveTab,
        { backgroundColor: colors.muted, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.inactiveLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeLabel: {
    color: "#fff",
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  inactiveTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  inactiveLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
});
