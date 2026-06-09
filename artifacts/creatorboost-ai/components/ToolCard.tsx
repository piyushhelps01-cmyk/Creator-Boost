import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import type { Tool } from "@/lib/tools";

interface ToolCardProps {
  tool: Tool;
  onPress: () => void;
  isPremiumLocked?: boolean;
}

const CATEGORY_COLORS: Record<string, [string, string]> = {
  youtube: ["#FF0000", "#CC0000"],
  instagram: ["#E1306C", "#833AB4"],
  advanced: ["#F59E0B", "#D97706"],
};

export function ToolCard({ tool, onPress, isPremiumLocked }: ToolCardProps) {
  const colors = useColors();
  const catColors = CATEGORY_COLORS[tool.category];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={styles.inner}>
        <LinearGradient
          colors={catColors}
          style={styles.iconBox}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialCommunityIcons
            name={tool.icon as any}
            size={20}
            color="#fff"
          />
        </LinearGradient>
        <View style={styles.textArea}>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
            {tool.name}
          </Text>
          <Text style={[styles.desc, { color: colors.mutedForeground }]} numberOfLines={2}>
            {tool.description}
          </Text>
        </View>
        {isPremiumLocked && (
          <View style={[styles.proBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.proText}>PRO</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    overflow: "hidden",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textArea: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  desc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  proBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  proText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Inter_700Bold",
  },
});
