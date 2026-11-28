import { DarkTheme, DefaultTheme, type Theme } from "expo-router";

/**
 * Navigation themes aligned with the design tokens in global.css.
 *
 * Expo Router ships its own copy of React Navigation, so themes, the
 * ThemeProvider and useTheme must come from `expo-router`. Using
 * `@react-navigation/native` creates a separate context that native headers
 * never read (modal titles fell back to the light theme in dark mode).
 *
 * `colors.card` must equal the `--card` token so modal headers, their content
 * and NativeWind `bg-card` surfaces are one color, with no seams.
 */
export const lightNavigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#4F6D5B",
    background: "#DEEDDE",
    card: "#FFFFFF",
    text: "#26362B",
    border: "#D3DED9",
    notification: "#F04242",
  },
};

export const darkNavigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#7FC49B",
    background: "#101814",
    card: "#1A231F",
    text: "#E8F3ED",
    border: "#364940",
    notification: "#E05252",
  },
};
