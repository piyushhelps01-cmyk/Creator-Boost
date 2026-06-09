import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface ApiKeyModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ApiKeyModal({ visible, onClose }: ApiKeyModalProps) {
  const colors = useColors();
  const { geminiApiKey, setGeminiApiKey } = useApp();
  const [inputKey, setInputKey] = useState(geminiApiKey);

  const handleSave = async () => {
    await setGeminiApiKey(inputKey.trim());
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Gemini API Key
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.desc, { color: colors.mutedForeground }]}>
            Enter your Google Gemini API key to enable AI generation. Your key is stored locally only.
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.muted,
                borderColor: colors.border,
                color: colors.foreground,
              },
            ]}
            placeholder="AIza..."
            placeholderTextColor={colors.mutedForeground}
            value={inputKey}
            onChangeText={setInputKey}
            secureTextEntry
            autoCorrect={false}
            autoCapitalize="none"
          />

          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://aistudio.google.com/app/apikey")
            }
          >
            <Text style={[styles.link, { color: colors.accent }]}>
              Get free API key from Google AI Studio
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Text style={styles.saveBtnText}>Save API Key</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 24,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  desc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  link: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  saveBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
