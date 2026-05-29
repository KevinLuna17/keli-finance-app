import { hapticButtonPress } from "@/lib/haptics";
import { GlassView } from "expo-glass-effect";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Pressable } from "react-native";

interface GlassBackButtonProps {
  /** Custom onPress handler. If not provided, navigates back using router.back() */
  onPress?: () => void;
}

/**
 * A glass-effect back button with an arrow icon.
 */
export function GlassBackButton({ onPress }: GlassBackButtonProps) {
  const handleBack = () => {
    hapticButtonPress();
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <Pressable onPress={handleBack} hitSlop={8}>
      <GlassView
        glassEffectStyle={"regular"}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          justifyContent: "center",
          alignItems: "center",
        }}
        isInteractive={true}
      >
        <SymbolView name="chevron.left" size={20} tintColor="#1A1A1A" />
      </GlassView>
    </Pressable>
  );
}
