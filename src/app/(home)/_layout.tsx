import { hapticTabPress } from "@/lib/haptics";
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function HomeLayout() {
  return (
    <NativeTabs
      tintColor={"forestgreen"}
      screenListeners={{
        tabPress: (e) => {
          hapticTabPress();
        },
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={"house"} md={"home"} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="transactions">
        <NativeTabs.Trigger.Label>Transactions</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={"receipt"} md={"receipt_long"} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="statistics">
        <NativeTabs.Trigger.Label>Statistics</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={"chart.bar"} md={"bar_chart"} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={"person.circle"} md={"account_circle"} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
