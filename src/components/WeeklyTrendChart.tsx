
import React, { useMemo } from "react";
import { getExpenses } from "@/lib/expenseStorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, DotProps } from "recharts";
import { startOfMonth, addWeeks, startOfWeek, endOfMonth, format, isWithinInterval } from "date-fns";

// Calculate weekly totals in the current month
function getWeeklyData(expenses: { amount: number; date: string }[]) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  let weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const weekData: { weekLabel: string; total: number }[] = [];
  // Each entry: { weekLabel, total spent }

  while (weekStart < monthEnd) {
    const weekEnd = addWeeks(weekStart, 1);
    const total = expenses
      .filter(e =>
        isWithinInterval(new Date(e.date), {
          start: weekStart,
          end: weekEnd < monthEnd ? weekEnd : monthEnd
        })
      )
      .reduce((acc, e) => acc + e.amount, 0);

    const weekLabel = `${format(weekStart, "MMM d")}-${format(weekEnd, "MMM d")}`;
    weekData.push({ weekLabel, total: Math.round(total) });
    weekStart = weekEnd;
  }
  return weekData;
}

// Custom black dot for points
const CustomDot = (props: DotProps) => {
  const { cx, cy } = props;
  return (
    <circle cx={cx} cy={cy} r={5} stroke="black" strokeWidth={2} fill="black" />
  );
};

export default function WeeklyTrendChart() {
  const expenses = useMemo(() => getExpenses(), []);
  const weekData = useMemo(() => getWeeklyData(expenses), [expenses]);

  return (
    <Card className="w-full max-w-2xl mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Weekly Trend (This Month)</CardTitle>
      </CardHeader>
      <CardContent className="h-64 sm:h-72 pt-4">
        <div className="w-full h-full bg-gray-200 rounded-md p-2">
          {weekData.length === 0 || weekData.every(w => w.total === 0) ? (
            <div className="text-center text-muted-foreground py-12">No expenses this month.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekData}>
                <CartesianGrid stroke="#cccccc" strokeDasharray="3 3"/>
                <XAxis dataKey="weekLabel" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  domain={['auto', 'auto']}
                  width={40}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="black"
                  strokeWidth={2.5}
                  dot={<CustomDot />}
                  activeDot={{ r: 7, fill: 'white', stroke: 'black', strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
