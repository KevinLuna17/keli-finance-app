import { getApiErrorMessage } from "@/lib/api/api-error-message";
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
  initialType?: TransactionFormValues["type"];
  onSuccess?: () => void | Promise<void>;
};

export function useTransactionForm({
  mode,
  transactionId,
  workspaceId,
  initialType,
  onSuccess,
}: UseTransactionFormOptions) {
  const { getToken } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(mode === "edit");

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      ...defaultTransactionFormValues,
      type: initialType ?? defaultTransactionFormValues.type,
    },
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
            getApiErrorMessage(error, "errors.loadTransaction"),
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

      await onSuccess?.();
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, "errors.saveTransaction"),
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
