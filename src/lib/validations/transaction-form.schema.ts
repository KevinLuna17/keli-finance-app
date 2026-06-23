import { isValidAmountInput } from "@/lib/amount-utils";
import { z } from "zod";

export const transactionTypeFormSchema = z.enum(["income", "expense"]);

export const transactionFormSchema = z.object({
  type: transactionTypeFormSchema,
  amount: z
    .string()
    .trim()
    .min(1, "Amount is required")
    .refine(isValidAmountInput, "Enter a valid amount greater than 0"),
  categoryId: z.uuid("Select a category"),
  description: z
    .string()
    .trim()
    .min(2, "Description must be at least 2 characters")
    .max(255, "Description must be at most 255 characters"),
  date: z.date({ error: "Date is required" }),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export const defaultTransactionFormValues: TransactionFormValues = {
  type: "expense",
  amount: "",
  categoryId: "",
  description: "",
  date: new Date(),
};
