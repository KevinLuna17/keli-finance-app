import { TransactionFormScreen } from "@/components/transactions/transaction-form-screen";
import { useBackendSync } from "@/hooks/useBackendSync";
import { useLocalSearchParams } from "expo-router";

/** Saving the first transaction completes the onboarding and opens Home. */
export default function OnboardingFirstTransactionRoute() {
  const { type } = useLocalSearchParams<{ type?: string }>();
  const { completeOnboarding } = useBackendSync();

  return (
    <TransactionFormScreen
      mode="create"
      initialType={type === "income" ? "income" : "expense"}
      onSuccess={completeOnboarding}
    />
  );
}
