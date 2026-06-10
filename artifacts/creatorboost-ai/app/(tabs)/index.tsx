import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ApiKeyModal } from "@/components/ApiKeyModal";
import { CategoryTab } from "@/components/CategoryTab";
import { GradientHeader } from "@/components/GradientHeader";
import { ToolCard } from "@/components/ToolCard";
import { UsageBanner } from "@/components/UsageBanner";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { hasEnvApiKey } from "@/lib/gemini";
import {
  ADVANCED_TOOLS,
  INSTAGRAM_TOOLS,
  YOUTUBE_TOOLS,
} from "@/lib/tools";

type Category = "youtube" | "instagram" | "advanced";

const CATEGORY_CONFIG: Record<
  Category,
  { label: string; color: string; color2: string; icon: string }
> = {
  youtube: { label: "YouTube", color: "#FF0000", color2: "#CC0000", icon: "youtube" },
  instagram: { label: "Instagram", color: "#E1306C", color2: "#833AB4", icon: "instagram" },
  advanced: { label: "Advanced", color: "#F59E0B", color2: "#D97706", icon: "star-four-points" },
};

export default function HomeScreen() {
  const colors = useColors();
  const { plan, geminiApiKey } = useApp();
  const [activeCategory, setActiveCategory] = useState<Category>("youtube");
  const [showApiModal, setShowApiModal] = useState(false);

  const tools =
    activeCategory === "youtube"
      ? YOUTUBE_TOOLS
      : activeCategory === "instagram"
        ? INSTAGRAM_TOOLS
        : ADVANCED_TOOLS;

  const apiReady = hasEnvApiKey || !!geminiApiKey;

  const handleToolPress = (toolId: string, isProOnly: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!apiReady) {
      setShowApiModal(true);
      return;
    }
    if (isProOnly && plan !== "pro") {
      router.push("/plans");
      return;
    }
    router.push({ pathname: "/tool/[id]", params: { id: toolId } });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <GradientHeader showBranding />

      {!apiReady && (
        <TouchableOpacity
          style={[styles.apiWarning, { backgroundColor: "#1A1A0F", borderColor: "#F59E0B" }]}
          onPress={() => setShowApiModal(true)}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="key-alert" size={16} color="#F59E0B" />
          <Text style={[styles.apiWarningText, { color: "#F59E0B" }]}>
            Tap to add Gemini API key to enable AI tools
          </Text>
        </TouchableOpacity>
      )}

      <UsageBanner />

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContent}
      >
        {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => {
          const cfg = CATEGORY_CONFIG[cat];
          return (
            <CategoryTab
              key={cat}
              label={cfg.label}
              isActive={activeCategory === cat}
              onPress={() => setActiveCategory(cat)}
              activeColor={cfg.color}
              activeColor2={cfg.color2}
            />
          );
        })}
      </ScrollView>

      {/* Tool List */}
      <FlatList
        data={tools}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ToolCard
            tool={item}
            onPress={() => handleToolPress(item.id, !!item.proOnly)}
            isPremiumLocked={!!item.proOnly && plan !== "pro"}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!tools.length}
      />

      <ApiKeyModal
        visible={showApiModal}
        onClose={() => setShowApiModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  apiWarning: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  apiWarningText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    flex: 1,
  },
  tabsScroll: {
    flexGrow: 0,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
});
