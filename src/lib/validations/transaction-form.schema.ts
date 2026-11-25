import { isValidAmountInput } from "@/lib/amount-utils";
import { z } from "zod";

export const transactionTypeFormSchema = z.enum(["income", "expense"]);

export const transactionFormSchema = z.object({
  type: transactionTypeFormSchema,
  amount: z
    .string()
    .trim()
    .min(1, "validation.amountRequired")
    .refine(isValidAmountInput, "validation.amountInvalid"),
  categoryId: z.uuid("validation.categoryRequired"),
  description: z
    .string()
    .trim()
    .min(2, "validation.descriptionTooShort")
    .max(255, "validation.descriptionTooLong"),
  date: z.date({ error: "validation.dateRequired" }),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export const defaultTransactionFormValues: TransactionFormValues = {
  type: "expense",
  amount: "",
  categoryId: "",
  description: "",
  date: new Date(),
};
