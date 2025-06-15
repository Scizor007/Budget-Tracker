
import React, { useMemo, useState } from "react";
import { getExpenses } from "@/lib/expenseStorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { format, isSameDay, isThisWeek, isThisMonth } from "date-fns";

const COLORS = [
  "#6366F1", "#F59E42", "#EF4444", "#10B981", "#FBBF24", "#7C3AED", "#3B82F6"
];
const CATEGORY_OPTIONS = [
  "Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Other"
];

const TIME_FILTERS = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" }
];

export default function ChartSection() {
  const [range, setRange] = useState<"today"|"week"|"month">("month");
  const [chartType, setChartType] = useState<"bar"|"pie">("bar");
  const expenses = useMemo(() => getExpenses(), []);
  // Apply range filter
  const filtered = useMemo(() => {
    const now = new Date();
    return expenses.filter(e => {
      const d = new Date(e.date);
      if (range === "today") return isSameDay(d, now);
      if (range === "week") return isThisWeek(d, { weekStartsOn: 1 });
      return isThisMonth(d);
    });
  }, [expenses, range]);
  // Group by category
  const data = useMemo(() => {
    return CATEGORY_OPTIONS.map((cat, i) => ({
      category: cat,
      total: filtered.filter(e=>e.category === cat)
                     .reduce((acc, curr) => acc + curr.amount, 0),
      color: COLORS[i % COLORS.length],
    })).filter(d=>d.total > 0);
  }, [filtered]);

  return (
    <Card className="w-full max-w-2xl mt-6">
      <CardHeader className="flex-row flex justify-between items-center gap-2">
        <CardTitle>Spending Analysis</CardTitle>
        <div className="flex gap-2">
          {TIME_FILTERS.map(f =>
            <Button
              key={f.value}
              size="sm"
              variant={range===f.value ? "default" : "outline"}
              onClick={()=>setRange(f.value as any)}
              className="rounded-full"
            >{f.label}</Button>
          )}
          <Toggle
            pressed={chartType==="pie"}
            onPressedChange={v=>setChartType(v ? "pie" : "bar")}
            aria-label="Toggle Pie/Bar"
            size="sm"
            className="ml-2"
          >
            {chartType === "bar" ? "Bar Chart" : "Pie Chart"}
          </Toggle>
        </div>
      </CardHeader>
      <CardContent className="h-72">
        {data.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">No expenses for this range.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={data}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total">
                  {data.map((entry, i) =>
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  )}
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) =>
                    `${category}: ${(percent * 100).toFixed(1)}%`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="total"
                  nameKey="category"
                >
                  {data.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
