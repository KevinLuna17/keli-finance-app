import ScreenLayout from "@/components/ui/ScreenLayout";
import { getSessionTaskLabel } from "@/lib/clerk-session-task";
import { useClerk } from "@clerk/expo";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

/**
 * Shown when Clerk leaves a session `currentTask` after finalize.
 * Configure tasks in Clerk Dashboard → Sessions. For most Keli MVP setups
 * this screen never appears.
 */
export default function SessionTaskScreen() {
  const { session, loaded } = useClerk();
  const router = useRouter();

  const task = session?.currentTask;
  const message = getSessionTaskLabel(task);

  React.useEffect(() => {
    if (loaded && !task) {
      router.replace("/(home)");
    }
  }, [loaded, task, router]);

  if (!loaded) {
    return null;
  }

  return (
    <ScreenLayout edges={["top", "bottom"]} className="px-6">
      <View className="flex-1 justify-center">
        <View className="rounded-[20px] bg-card p-8 shadow-sm">
          <View className="self-center rounded-full bg-secondary px-3 py-1">
            <Text className="text-xs font-semibold uppercase tracking-[1px] text-secondary-foreground">
              Account setup
            </Text>
          </View>

          <Text className="mt-6 text-center text-2xl font-extrabold text-brand">
            One more step
          </Text>

          <Text className="mt-3 text-center text-base leading-6 text-muted-foreground">
            {message}
          </Text>

          <Text className="mt-4 text-center text-sm leading-5 text-muted-foreground">
            If you did not expect this, check your Clerk Dashboard session tasks
            or contact support.
          </Text>

          <Pressable
            className="mt-8 h-14 items-center justify-center rounded-2xl bg-brand active:opacity-90"
            onPress={() => router.replace("/(home)")}
          >
            <Text className="text-lg font-extrabold text-white">
              Continue to Keli
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenLayout>
  );
}
