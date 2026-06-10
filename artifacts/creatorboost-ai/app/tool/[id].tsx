import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RewardedAdModal } from "@/components/RewardedAdModal";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { callGemini, hasEnvApiKey } from "@/lib/gemini";
import { TOOLS } from "@/lib/tools";

export default function ToolScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { geminiApiKey, incrementUsage, addHistoryItem, plan, canWatchRewardedAd } = useApp();

  const tool = TOOLS.find((t) => t.id === id);

  const [input, setInput] = useState("");
  const [extra, setExtra] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);

  if (!tool) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>Tool not found.</Text>
      </View>
    );
  }

  const CATEGORY_COLORS: Record<string, [string, string]> = {
    youtube: ["#FF0000", "#CC0000"],
    instagram: ["#E1306C", "#833AB4"],
    advanced: ["#F59E0B", "#D97706"],
  };

  const catColors = CATEGORY_COLORS[tool.category];
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleGenerate = async () => {
    if (!input.trim()) {
      setError("Please fill in the required field.");
      return;
    }

    if (!hasEnvApiKey && !geminiApiKey) {
      setError("Please add your Gemini API key in Settings.");
      return;
    }

    const canProceed = incrementUsage();
    if (!canProceed) {
      if (canWatchRewardedAd) {
        setShowAdModal(true);
      } else {
        setError("Daily limit reached. Upgrade your plan for more generations.");
      }
      return;
    }

    setLoading(true);
    setError("");
    setOutput("");

    try {
      const prompt = tool.buildPrompt(input.trim(), extra.trim() || undefined);
      const result = await callGemini(prompt, geminiApiKey);
      setOutput(result);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await addHistoryItem({
        tool: tool.name,
        category: tool.category,
        input: input.trim(),
        output: result,
      });
    } catch (err: any) {
      const msg = err?.message || "";
      if (msg === "NO_API_KEY" || msg === "INVALID_API_KEY") {
        setError("Invalid or missing API key. Go to Settings to update it.");
      } else if (msg === "EMPTY_RESPONSE") {
        setError("No response from AI. Try again.");
      } else {
        setError("Generation failed. Check your internet and try again.");
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(output);
    setCopied(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: output });
    } catch {}
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={["#0F1B3D", "#050B1A"]}
        style={[styles.header, { paddingTop: topPad }]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <LinearGradient
            colors={catColors}
            style={styles.headerIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialCommunityIcons name={tool.icon as any} size={18} color="#fff" />
          </LinearGradient>
          <View>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              {tool.name}
            </Text>
            <Text style={[styles.headerDesc, { color: colors.mutedForeground }]}>
              {tool.description}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: colors.foreground }]}>
            {tool.inputLabel} *
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.foreground,
              },
            ]}
            placeholder={tool.inputPlaceholder}
            placeholderTextColor={colors.mutedForeground}
            value={input}
            onChangeText={setInput}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {tool.extraLabel && (
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.foreground }]}>
              {tool.extraLabel}
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.foreground,
                },
              ]}
              placeholder={tool.extraPlaceholder}
              placeholderTextColor={colors.mutedForeground}
              value={extra}
              onChangeText={setExtra}
            />
          </View>
        )}

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: "#2D0B0B", borderColor: colors.destructive }]}>
            <Ionicons name="warning-outline" size={16} color={colors.destructive} />
            <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
          </View>
        ) : null}

        {/* Generate Button */}
        <TouchableOpacity
          onPress={handleGenerate}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={loading ? ["#333", "#333"] : [colors.primary, colors.accent]}
            style={styles.generateBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <MaterialCommunityIcons name="lightning-bolt" size={20} color="#fff" />
                <Text style={styles.generateBtnText}>Generate with AI</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Output */}
        {output ? (
          <View
            style={[styles.outputBox, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.outputHeader}>
              <Text style={[styles.outputLabel, { color: colors.accent }]}>
                Result
              </Text>
              <View style={styles.outputActions}>
                <TouchableOpacity
                  style={[styles.outputBtn, { backgroundColor: colors.muted }]}
                  onPress={handleCopy}
                >
                  <Ionicons
                    name={copied ? "checkmark" : "copy-outline"}
                    size={16}
                    color={copied ? colors.success : colors.accent}
                  />
                  <Text style={[styles.outputBtnText, { color: copied ? colors.success : colors.accent }]}>
                    {copied ? "Copied!" : "Copy"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.outputBtn, { backgroundColor: colors.muted }]}
                  onPress={handleShare}
                >
                  <Ionicons name="share-outline" size={16} color={colors.primary} />
                  <Text style={[styles.outputBtnText, { color: colors.primary }]}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.outputText, { color: colors.foreground }]}>
              {output}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <RewardedAdModal
        visible={showAdModal}
        onClose={() => setShowAdModal(false)}
        onRewarded={() => {
          setError("");
          setShowAdModal(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  backBtn: {
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  headerDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  inputGroup: { gap: 8 },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    minHeight: 60,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  generateBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  generateBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  outputBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  outputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  outputLabel: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  outputActions: { flexDirection: "row", gap: 8 },
  outputBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  outputBtnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  outputText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
});
