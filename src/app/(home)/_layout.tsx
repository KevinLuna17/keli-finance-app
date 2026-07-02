import { hapticTabPress } from "@/lib/haptics";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useTranslation } from "react-i18next";

export default function HomeLayout() {
  const { t } = useTranslation();

  return (
    <NativeTabs
      tintColor={"forestgreen"}
      screenListeners={{
        tabPress: () => {
          hapticTabPress();
        },
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{t("home")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={"house"} md={"home"} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="transactions">
        <NativeTabs.Trigger.Label>{t("transactions")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={"receipt"} md={"receipt_long"} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="statistics">
        <NativeTabs.Trigger.Label>{t("statistics.title")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={"chart.bar"} md={"bar_chart"} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>{t("profile")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={"person.circle"} md={"account_circle"} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
