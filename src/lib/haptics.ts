import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

// Haptic feedback utility functions for consistent tactile feedback

/**
 * Light haptic for button presses and selections
 */
export const hapticLight = () => {
  if (Platform.OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};

/**
 * Medium haptic for significant actions like swipe
 */
export const hapticMedium = () => {
  if (Platform.OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
};

/**
 * Heavy haptic
 */
export const hapticHeavy = () => {
  if (Platform.OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }
};

/**
 * Selection haptic for UI element selection
 */
export const hapticSelection = () => {
  if (Platform.OS === "ios") {
    Haptics.selectionAsync();
  }
};

/**
 * Success notification
 */
export const hapticSuccess = () => {
  if (Platform.OS === "ios") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
};

/**
 * Warning notification
 */
export const hapticWarning = () => {
  if (Platform.OS === "ios") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }
};

/**
 * Error notification
 */
export const hapticError = () => {
  if (Platform.OS === "ios") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
};

// Semantic haptic functions for KELI app

/**
 * Haptic for button press
 */
export const hapticButtonPress = () => hapticSelection();

/**
 * Haptic for tab selection
 */
export const hapticTabPress = () => hapticLight();
