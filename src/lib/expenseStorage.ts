
export type Expense = {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string; // ISO date
};

const STORAGE_KEY = "expense-tracker:expenses";

export const getExpenses = (): Expense[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveExpense = (expense: Expense) => {
  const expenses = getExpenses();
  expenses.unshift(expense); // most recent first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
};

export const setExpenses = (expenses: Expense[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
};
