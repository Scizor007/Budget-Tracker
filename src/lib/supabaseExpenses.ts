import { supabase } from "@/integrations/supabase/client";

export type Expense = {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string; // ISO date string
  user_id: string;
};

export async function fetchExpenses(userId: string): Promise<Expense[]> {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });
  if (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }
  return (data as Expense[]) || [];
}

export async function addExpense(expense: Omit<Expense, "id">): Promise<{ error: any, data: Expense | null }> {
  const { data, error } = await supabase
    .from("expenses")
    .insert([expense])
    .select()
    .single();
  if (error) {
    console.error("Error adding expense:", error);
    return { error, data: null };
  }
  return { error: null, data: data as Expense };
}

export async function deleteExpense(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);
  if (error) {
    console.error("Error deleting expense:", error);
    return false;
  }
  return true;
}
