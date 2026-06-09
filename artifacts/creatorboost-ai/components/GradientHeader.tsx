import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

interface GradientHeaderProps {
  title?: string;
  subtitle?: string;
  showBranding?: boolean;
}

export function GradientHeader({
  title,
  subtitle,
  showBranding = false,
}: GradientHeaderProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <LinearGradient
      colors={["#0F1B3D", "#050B1A"]}
      style={[styles.header, { paddingTop: topPad + 16 }]}
    >
      {showBranding ? (
        <View style={styles.brandingContainer}>
          <View style={styles.logoRow}>
            <LinearGradient
              colors={[colors.primary, colors.accent]}
              style={styles.logoMark}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.logoText}>CB</Text>
            </LinearGradient>
            <View>
              <Text style={[styles.appName, { color: colors.foreground }]}>
                CreatorBoost{" "}
                <Text style={{ color: colors.primary }}>AI</Text>
              </Text>
              <Text style={[styles.byLine, { color: colors.mutedForeground }]}>
                by Piyush Yadav
              </Text>
            </View>
          </View>
          <Text style={[styles.tagline, { color: colors.accent }]}>
            Create Smarter. Grow Faster.
          </Text>
        </View>
      ) : (
        <View>
          {title && (
            <Text style={[styles.title, { color: colors.foreground }]}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  brandingContainer: {
    gap: 8,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  appName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  byLine: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 1,
  },
  tagline: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
});
