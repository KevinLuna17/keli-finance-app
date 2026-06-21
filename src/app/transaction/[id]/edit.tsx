import { TransactionFormScreen } from "@/components/transactions/transaction-form-screen";
import { useLocalSearchParams } from "expo-router";

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <TransactionFormScreen mode="edit" transactionId={id} />;
}
