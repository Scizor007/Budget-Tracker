
import React, { useEffect, useState } from "react";
import { Expense, fetchExpenses, deleteExpense } from "@/lib/supabaseExpenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Filter = "all" | string;
type SortBy = "date" | "amount";

const CATEGORY_OPTIONS = [
  "Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Other"
];

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [loading, setLoading] = useState(false);

  const loadExpenses = async () => {
    setLoading(true);
    const data = await fetchExpenses();
    setExpenses(data);
    setLoading(false);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = await deleteExpense(id);
    if (ok) {
      setExpenses(expenses => expenses.filter(e => e.id !== id));
    }
  };

  const filtered = filter === "all"
    ? expenses
    : expenses.filter(e => e.category === filter);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return b.amount - a.amount;
  });

  return (
    <Card className="mt-6 shadow-md">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 text-lg sm:text-xl">
          Expense History
          <select className="ml-auto rounded px-2 py-1 text-sm border bg-card z-10" value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {CATEGORY_OPTIONS.map(opt =>
              <option key={opt} value={opt}>{opt}</option>
            )}
          </select>
          <select className="rounded px-2 py-1 text-sm border bg-card z-10" value={sortBy} onChange={e=>setSortBy(e.target.value as SortBy)}>
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-muted-foreground py-6 text-center">Loading...</div>
        ) : sorted.length === 0 ? (
          <div className="text-muted-foreground py-6 text-center">No expenses yet!</div>
        ) : (
          <ul className="divide-y">
            {sorted.map(exp => (
              <li key={exp.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap">
                <span className="font-mono font-semibold text-lg">${exp.amount.toFixed(2)}</span>
                <span className="rounded bg-muted px-2 py-0.5 text-xs">{exp.category}</span>
                <span className="flex-1 text-sm break-words max-w-full">{exp.note}</span>
                <span className="text-xs text-muted-foreground">{new Date(exp.date).toLocaleString()}</span>
                <Button onClick={()=>handleDelete(exp.id)} size="sm" variant="outline" className="mt-2 sm:mt-0">Delete</Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
