import React, { useEffect, useState } from "react";
import { Expense, fetchExpenses, deleteExpense } from "@/lib/supabaseExpenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, Car, ShoppingBag, CreditCard, Film, HeartPulse, MoreHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Filter = "all" | string;
type SortBy = "date" | "amount";

const CATEGORY_OPTIONS = [
  "Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Other"
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Food: <Utensils className="w-4 h-4 inline-block mr-1 text-sky-400" />,
  Travel: <Car className="w-4 h-4 inline-block mr-1 text-blue-400" />,
  Shopping: <ShoppingBag className="w-4 h-4 inline-block mr-1 text-green-400" />,
  Bills: <CreditCard className="w-4 h-4 inline-block mr-1 text-purple-400" />,
  Entertainment: <Film className="w-4 h-4 inline-block mr-1 text-pink-400" />,
  Health: <HeartPulse className="w-4 h-4 inline-block mr-1 text-red-400" />,
  Other: <MoreHorizontal className="w-4 h-4 inline-block mr-1 text-gray-400" />,
};

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [loading, setLoading] = useState(false);

  const loadExpenses = async () => {
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }
    const data = await fetchExpenses(user.id);
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
    <Card className="mt-6 shadow-md card-modern animate-fadeInUp">
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
          <div className="text-muted-foreground py-6 text-center flex flex-col items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
              <ellipse cx="60" cy="100" rx="40" ry="10" fill="#e0e7ef" />
              <rect x="30" y="30" width="60" height="40" rx="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
              <rect x="40" y="40" width="40" height="8" rx="4" fill="#cbd5e1" />
              <rect x="40" y="52" width="25" height="6" rx="3" fill="#e0e7ef" />
              <circle cx="85" cy="55" r="5" fill="#38bdf8" />
            </svg>
            <div className="text-lg font-semibold mb-1">No expenses yet!</div>
            <div className="text-sm text-muted-foreground">Start tracking your spending by adding your first expense.</div>
          </div>
        ) : (
          <ul className="divide-y">
            {sorted.map(exp => (
              <li key={exp.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap">
                <span className="font-mono font-semibold text-lg">${exp.amount.toFixed(2)}</span>
                <span className="rounded bg-muted px-2 py-0.5 text-xs flex items-center">
                  {CATEGORY_ICONS[exp.category] || CATEGORY_ICONS.Other}
                  {exp.category}
                </span>
                <span className="flex-1 text-sm break-words max-w-full">{exp.note}</span>
                <span className="text-xs text-muted-foreground">{new Date(exp.date).toLocaleString()}</span>
                <Button onClick={()=>handleDelete(exp.id)} size="sm" variant="outline" className="mt-2 sm:mt-0 button-modern animate-pop">Delete</Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
