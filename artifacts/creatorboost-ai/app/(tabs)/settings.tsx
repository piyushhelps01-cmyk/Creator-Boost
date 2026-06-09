import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ApiKeyModal } from "@/components/ApiKeyModal";
import { GradientHeader } from "@/components/GradientHeader";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

function SettingRow({ icon, label, value, onPress, danger }: SettingRowProps) {
  const colors = useColors();
  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.rowLeft}>
        {icon}
        <Text
          style={[styles.rowLabel, { color: danger ? colors.destructive : colors.foreground }]}
        >
          {label}
        </Text>
      </View>
      {value && (
        <Text style={[styles.rowValue, { color: colors.mutedForeground }]}>{value}</Text>
      )}
      {onPress && (
        <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
      )}
    </TouchableOpacity>
  );
}

function SectionHeader({ title }: { title: string }) {
  const colors = useColors();
  return (
    <Text style={[styles.sectionHeader, { color: colors.mutedForeground }]}>
      {title}
    </Text>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const { plan, geminiApiKey, clearHistory } = useApp();
  const [showApiModal, setShowApiModal] = useState(false);

  const planLabels: Record<string, string> = {
    free: "Free Plan",
    premium: "Premium ₹99/mo",
    pro: "Creator Pro ₹299/mo",
  };

  const handleClearHistory = () => {
    Alert.alert("Clear All History", "This will permanently delete all saved history and favorites.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: clearHistory },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <GradientHeader title="Settings" />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Plan Card */}
        <TouchableOpacity
          onPress={() => router.push("/plans")}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={
              plan === "pro"
                ? ["#8B5CF6", "#00D4FF"]
                : plan === "premium"
                  ? ["#E1306C", "#833AB4"]
                  : ["#1A2B5C", "#0F1B3D"]
            }
            style={styles.planCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.planCardInner}>
              <View>
                <Text style={styles.planCardLabel}>Current Plan</Text>
                <Text style={styles.planCardName}>{planLabels[plan]}</Text>
              </View>
              <View style={styles.upgradeBtn}>
                <Text style={styles.upgradeBtnText}>
                  {plan === "pro" ? "Manage" : "Upgrade"}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* AI Configuration */}
        <SectionHeader title="AI CONFIGURATION" />
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon={<MaterialCommunityIcons name="key-outline" size={20} color={colors.primary} />}
            label="Gemini API Key"
            value={geminiApiKey ? "••••••••" + geminiApiKey.slice(-4) : "Not set"}
            onPress={() => setShowApiModal(true)}
          />
        </View>

        {/* Account */}
        <SectionHeader title="ACCOUNT" />
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon={<Ionicons name="trophy-outline" size={20} color={colors.primary} />}
            label="Manage Subscription"
            onPress={() => router.push("/plans")}
          />
          <SettingRow
            icon={<MaterialCommunityIcons name="delete-outline" size={20} color={colors.mutedForeground} />}
            label="Clear History"
            onPress={handleClearHistory}
          />
        </View>

        {/* Support */}
        <SectionHeader title="SUPPORT" />
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon={<Ionicons name="mail-outline" size={20} color={colors.primary} />}
            label="Contact Support"
            onPress={() =>
              Linking.openURL("mailto:support@creatorboostai.com?subject=Support Request")
            }
          />
          <SettingRow
            icon={<Ionicons name="document-text-outline" size={20} color={colors.primary} />}
            label="Privacy Policy"
            onPress={() => Linking.openURL("https://creatorboostai.com/privacy")}
          />
          <SettingRow
            icon={<Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />}
            label="Terms & Conditions"
            onPress={() => Linking.openURL("https://creatorboostai.com/terms")}
          />
        </View>

        {/* About */}
        <SectionHeader title="ABOUT" />
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon={<MaterialCommunityIcons name="information-outline" size={20} color={colors.primary} />}
            label="Version"
            value="1.0.0"
          />
        </View>

        <Text style={[styles.footer, { color: colors.mutedForeground }]}>
          © Piyush Yadav — CreatorBoost AI
        </Text>
      </ScrollView>

      <ApiKeyModal
        visible={showApiModal}
        onClose={() => setShowApiModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 4 },
  planCard: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
  },
  planCardInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  planCardLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  planCardName: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginTop: 2,
  },
  upgradeBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeBtnText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  rowLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  rowValue: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginRight: 6,
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 24,
    marginBottom: 8,
  },
});
