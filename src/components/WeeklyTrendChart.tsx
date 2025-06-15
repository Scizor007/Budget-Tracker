
import React, { useMemo } from "react";
import { getExpenses } from "@/lib/expenseStorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { startOfMonth, addWeeks, startOfWeek, isSameWeek, endOfMonth, format, isWithinInterval } from "date-fns";

const COLORS = [
  "#6366F1", "#F59E42", "#EF4444", "#10B981", "#FBBF24", "#7C3AED"
];

// Calculate weekly totals in the current month
function getWeeklyData(expenses: { amount: number; date: string }[]) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Start on the first Monday in the month
  let weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const weekData: { weekLabel: string; total: number; color: string }[] = [];
  let weekIdx = 0;

  // Build weekly range for the current month
  while (weekStart < monthEnd) {
    const weekEnd = addWeeks(weekStart, 1);
    // All expenses that fall into this week and this month
    const total = expenses
      .filter(e =>
        isWithinInterval(new Date(e.date), {
          start: weekStart,
          end: weekEnd < monthEnd ? weekEnd : monthEnd
        })
      )
      .reduce((acc, e) => acc + e.amount, 0);

    const weekLabel = `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`;
    weekData.push({ weekLabel, total, color: COLORS[weekIdx % COLORS.length] });
    weekStart = weekEnd;
    weekIdx++;
  }
  return weekData;
}

export default function WeeklyTrendChart() {
  const expenses = useMemo(() => getExpenses(), []);
  const weekData = useMemo(() => getWeeklyData(expenses), [expenses]);

  return (
    <Card className="w-full max-w-2xl mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Weekly Trend (This Month)</CardTitle>
      </CardHeader>
      <CardContent className="h-64 sm:h-72 pt-4">
        {weekData.length === 0 || weekData.every(w => w.total === 0) ? (
          <div className="text-center text-muted-foreground py-12">No expenses this month.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekData}>
              <XAxis dataKey="weekLabel" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="total">
                {weekData.map((entry, i) =>
                  <Cell key={i} fill={entry.color} />
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
