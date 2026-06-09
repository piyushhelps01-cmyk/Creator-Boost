import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { GradientHeader } from "@/components/GradientHeader";
import { useApp, type HistoryItem } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type Filter = "all" | "favorites";

function HistoryCard({
  item,
  onToggleFav,
  onCopy,
}: {
  item: HistoryItem;
  onToggleFav: () => void;
  onCopy: () => void;
}) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const date = new Date(item.timestamp).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <TouchableOpacity onPress={() => setExpanded((v) => !v)} activeOpacity={0.8}>
        <View style={styles.cardHeader}>
          <View style={styles.cardMeta}>
            <Text style={[styles.toolName, { color: colors.primary }]} numberOfLines={1}>
              {item.tool}
            </Text>
            <Text style={[styles.cardDate, { color: colors.mutedForeground }]}>
              {date}
            </Text>
          </View>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.mutedForeground}
          />
        </View>
        <Text style={[styles.inputText, { color: colors.foreground }]} numberOfLines={expanded ? undefined : 1}>
          {item.input}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedContent}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.outputText, { color: colors.foreground }]}>
            {item.output}
          </Text>
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.muted }]}
              onPress={onCopy}
            >
              <Ionicons name="copy-outline" size={16} color={colors.accent} />
              <Text style={[styles.actionBtnText, { color: colors.accent }]}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.muted }]}
              onPress={onToggleFav}
            >
              <Ionicons
                name={item.isFavorite ? "heart" : "heart-outline"}
                size={16}
                color={item.isFavorite ? "#FF4D6D" : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.actionBtnText,
                  { color: item.isFavorite ? "#FF4D6D" : colors.mutedForeground },
                ]}
              >
                {item.isFavorite ? "Saved" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

export default function HistoryScreen() {
  const colors = useColors();
  const { history, favorites, toggleFavorite, clearHistory } = useApp();
  const [filter, setFilter] = useState<Filter>("all");

  const data = filter === "favorites" ? favorites : history;

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleClear = () => {
    Alert.alert("Clear History", "This will permanently delete all history.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: clearHistory,
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <GradientHeader title="History" subtitle="Your previous generations" />

      <View style={styles.filterRow}>
        {(["all", "favorites"] as Filter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterBtn,
              {
                backgroundColor:
                  filter === f ? colors.primary : colors.muted,
                borderColor: filter === f ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === f ? "#fff" : colors.mutedForeground },
              ]}
            >
              {f === "all" ? "All" : "Favorites"}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={{ flex: 1 }} />
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <MaterialCommunityIcons
              name="delete-outline"
              size={22}
              color={colors.destructive}
            />
          </TouchableOpacity>
        )}
      </View>

      {data.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="time-outline" size={48} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            {filter === "favorites" ? "No favorites yet" : "No history yet"}
          </Text>
          <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>
            {filter === "favorites"
              ? "Bookmark generations you love"
              : "Your generations will appear here"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoryCard
              item={item}
              onToggleFav={() => toggleFavorite(item.id)}
              onCopy={() => handleCopy(item.output)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  list: { paddingHorizontal: 16, paddingBottom: 120 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    padding: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardMeta: { flex: 1, marginRight: 8 },
  toolName: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  cardDate: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  inputText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  expandedContent: { marginTop: 10, gap: 10 },
  divider: { height: 1 },
  outputText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  cardActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginTop: 8,
  },
  emptyDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
