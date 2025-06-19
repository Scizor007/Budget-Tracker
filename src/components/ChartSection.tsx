import React, { useMemo, useState, useEffect } from "react";
import { fetchExpenses, addExpense } from "@/lib/supabaseExpenses";
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
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch expenses from Supabase
  useEffect(() => {
    const loadExpenses = async () => {
      setLoading(true);
      try {
        const data = await fetchExpenses();
        console.log("Fetched expenses from Supabase:", data);
        setExpenses(data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };
    loadExpenses();
  }, []);
  
  // Debug logging
  console.log("All expenses:", expenses);
  
  // Function to add sample data
  const addSampleData = async () => {
    try {
      const sampleExpenses = [
        { amount: 50, category: "Food", note: "Lunch", date: new Date().toISOString() },
        { amount: 30, category: "Travel", note: "Bus fare", date: new Date().toISOString() },
        { amount: 100, category: "Shopping", note: "Clothes", date: new Date().toISOString() },
        { amount: 80, category: "Bills", note: "Electricity", date: new Date().toISOString() },
        { amount: 25, category: "Entertainment", note: "Movie", date: new Date().toISOString() },
      ];
      
      for (const expense of sampleExpenses) {
        const result = await addExpense(expense);
        if (result.error) {
          console.error("Error adding sample expense:", result.error);
        }
      }
      
      // Reload expenses
      const data = await fetchExpenses();
      setExpenses(data);
      console.log("Sample data added successfully");
    } catch (error) {
      console.error("Error adding sample data:", error);
    }
  };
  
  // Apply range filter
  const filtered = useMemo(() => {
    const now = new Date();
    const filteredExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      if (range === "today") return isSameDay(d, now);
      if (range === "week") return isThisWeek(d, { weekStartsOn: 1 });
      return isThisMonth(d);
    });
    console.log("Filtered expenses for range", range, ":", filteredExpenses);
    return filteredExpenses;
  }, [expenses, range]);
  
  // Group by category
  const data = useMemo(() => {
    const chartData = CATEGORY_OPTIONS.map((cat, i) => ({
      category: cat,
      total: filtered.filter(e=>e.category === cat)
                     .reduce((acc, curr) => acc + curr.amount, 0),
      color: COLORS[i % COLORS.length],
    })).filter(d=>d.total > 0);
    console.log("Chart data:", chartData);
    return chartData;
  }, [filtered]);

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mt-6 shadow-lg">
        <CardContent className="h-64 sm:h-72 pt-4">
          <div className="text-center text-muted-foreground py-12">Loading expenses...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mt-6 shadow-lg">
      <CardHeader className="flex-row flex justify-between items-center gap-2">
        <CardTitle className="text-lg sm:text-xl">Spending Analysis</CardTitle>
        <div className="flex flex-wrap gap-2 justify-end">
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
            className="ml-2 min-w-[90px] text-xs"
          >
            {chartType === "bar" ? "Bar Chart" : "Pie Chart"}
          </Toggle>
        </div>
      </CardHeader>
      <CardContent className="h-96 pt-4">
        {data.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 flex flex-col items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
              <ellipse cx="60" cy="100" rx="40" ry="10" fill="#e0e7ef" />
              <rect x="30" y="30" width="60" height="40" rx="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
              <rect x="40" y="40" width="40" height="8" rx="4" fill="#cbd5e1" />
              <rect x="40" y="52" width="25" height="6" rx="3" fill="#e0e7ef" />
              <circle cx="85" cy="55" r="5" fill="#38bdf8" />
            </svg>
            <div className="text-lg font-semibold mb-1">No expenses for this range.</div>
            <div className="text-sm text-muted-foreground mb-2">Add some expenses first to see the graph!</div>
            <Button 
              onClick={addSampleData} 
              variant="outline" 
              size="sm" 
              className="mt-2 button-modern animate-pop"
            >
              Add Sample Data (Test)
            </Button>
            <Button 
              onClick={async () => {
                try {
                  const data = await fetchExpenses();
                  console.log("Connection test successful:", data);
                  alert(`Connection successful! Found ${data.length} expenses.`);
                } catch (error) {
                  console.error("Connection test failed:", error);
                  alert(`Connection failed: ${error}`);
                }
              }} 
              variant="outline" 
              size="sm" 
              className="mt-2 ml-2 button-modern animate-pop"
            >
              Test Connection
            </Button>
            <div className="mt-4 text-xs">
              Debug: {expenses.length} total expenses, {filtered.length} filtered expenses
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart data={data}>
                <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
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
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                  nameKey="category"
                >
                  {data.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend iconType="circle" />
                <Tooltip />
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
