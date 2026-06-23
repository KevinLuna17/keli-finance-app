import { Transaction } from "@/services/transactions/transaction.types";

export type TransactionListRow =
  | { type: "header"; key: string; label: string }
  | { type: "transaction"; key: string; transaction: Transaction };

function startOfDay(date: Date): Date {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function getDateGroupKey(isoDate: string): string {
  return startOfDay(new Date(isoDate)).toISOString();
}

export function getDateGroupLabel(isoDateKey: string): string {
  const date = new Date(isoDateKey);
  const today = startOfDay(new Date());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const target = startOfDay(date);

  if (target.getTime() === today.getTime()) {
    return "Today";
  }

  if (target.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: target.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  }).format(date);
}

export function formatTransactionRowDate(isoDate: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

export function buildTransactionListRows(
  transactions: Transaction[],
): TransactionListRow[] {
  const rows: TransactionListRow[] = [];
  let lastDateKey: string | null = null;

  for (const transaction of transactions) {
    const dateKey = getDateGroupKey(transaction.transactionDate);

    if (dateKey !== lastDateKey) {
      rows.push({
        type: "header",
        key: `header-${dateKey}`,
        label: getDateGroupLabel(dateKey),
      });
      lastDateKey = dateKey;
    }

    rows.push({
      type: "transaction",
      key: transaction.id,
      transaction,
    });
  }

  return rows;
}

export function mergeTransactions(
  current: Transaction[],
  incoming: Transaction[],
): Transaction[] {
  const byId = new Map(current.map((transaction) => [transaction.id, transaction]));

  for (const transaction of incoming) {
    byId.set(transaction.id, transaction);
  }

  return Array.from(byId.values()).sort(
    (left, right) =>
      new Date(right.transactionDate).getTime() -
      new Date(left.transactionDate).getTime(),
  );
}
