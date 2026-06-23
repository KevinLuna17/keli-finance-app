import { ApiError } from "@/lib/api/client";
import { parseAmountToCents, formatCentsToAmountInput } from "@/lib/amount-utils";
import {
  defaultTransactionFormValues,
  transactionFormSchema,
  TransactionFormValues,
} from "@/lib/validations/transaction-form.schema";
import {
  createTransaction,
  getTransaction,
  updateTransaction,
} from "@/services/transactions/transaction.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/expo";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export type TransactionFormMode = "create" | "edit";

type UseTransactionFormOptions = {
  mode: TransactionFormMode;
  transactionId?: string;
  workspaceId: string;
  onSuccess?: () => void;
};

export function useTransactionForm({
  mode,
  transactionId,
  workspaceId,
  onSuccess,
}: UseTransactionFormOptions) {
  const { getToken } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(mode === "edit");

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: defaultTransactionFormValues,
    mode: "onChange",
  });

  useEffect(() => {
    if (mode !== "edit" || !transactionId) {
      return;
    }

    let cancelled = false;

    async function loadTransaction() {
      setIsLoadingInitial(true);
      setLoadError(null);

      try {
        const transaction = await getTransaction(() => getToken(), transactionId!);

        if (cancelled) {
          return;
        }

        form.reset({
          type: transaction.type,
          amount: formatCentsToAmountInput(transaction.amountInCents),
          categoryId: transaction.categoryId,
          description: transaction.description,
          date: new Date(transaction.transactionDate),
        });
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof ApiError
              ? error.message
              : "Could not load transaction",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingInitial(false);
        }
      }
    }

    loadTransaction();

    return () => {
      cancelled = true;
    };
  }, [form, getToken, mode, transactionId]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    const payload = {
      categoryId: values.categoryId,
      type: values.type,
      amountInCents: parseAmountToCents(values.amount),
      description: values.description,
      transactionDate: values.date.toISOString(),
    };

    try {
      if (mode === "create") {
        await createTransaction(() => getToken(), workspaceId, payload);
      } else if (transactionId) {
        await updateTransaction(() => getToken(), transactionId, payload);
      }

      onSuccess?.();
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "Could not save transaction",
      );
    }
  });

  const { isSubmitting, isValid } = form.formState;

  return {
    form,
    onSubmit,
    submitError,
    loadError,
    isLoadingInitial,
    isSubmitting,
    isSubmitDisabled: isSubmitting || !isValid || isLoadingInitial,
  };
}
