import React, { useMemo, useState, useEffect } from "react";
import { fetchExpenses } from "@/lib/supabaseExpenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  DotProps,
} from "recharts";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  addWeeks,
  format,
} from "date-fns";

const WEEK_COLORS = [
  "#6366F1",
  "#F59E42",
  "#EF4444",
  "#10B981",
  "#E11D48",
  "#A21CAF",
  "#FACC15",
  "#3B82F6",
];

// Returns a mapping of weekNumber -> [{ date, amount }] for each day (Monday-Sunday) in the week
function getWeeklyLinesData(expenses: { amount: number; date: string }[]) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  let weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const weekLines: { [weekLabel: string]: { [day: string]: number } } = {};
  const weekLabels: string[] = [];

  // For building X axis labels (Mon, Tue, ..., Sun)
  const dayKeys: string[] = [];
  for (let i = 0; i < 7; i++) {
    dayKeys.push(format(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i), "EEE")); // "Mon", ...
  }

  while (weekStart < monthEnd) {
    const weekEnd = addDays(weekStart, 6);
    const weekLabel = `${format(weekStart, "MMM d")}-${format(weekEnd, "MMM d")}`;
    weekLabels.push(weekLabel);
    // Gather totals for each weekday in this week (Mon..Sun)
    let dailyTotals: { [day: string]: number } = {};
    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      const dayLabel = format(day, "EEE");
      if (day < monthStart || day > monthEnd) {
        dailyTotals[dayLabel] = 0;
      } else {
        dailyTotals[dayLabel] = expenses
          .filter(
            (e) => format(new Date(e.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
          )
          .reduce((acc, e) => acc + e.amount, 0);
      }
    }
    weekLines[weekLabel] = dailyTotals;
    weekStart = addWeeks(weekStart, 1);
  }

  // Define proper type for recharts: each entry has day as string, other fields as numbers
  type ChartEntry = { day: string } & { [weekName: string]: number };

  const chartData: ChartEntry[] = dayKeys.map((day) => {
    // Build entry object for each day of the week
    const entry: any = { day };
    weekLabels.forEach((w) => {
      entry[w] = weekLines[w][day];
    });
    return entry as ChartEntry;
  });

  return { chartData, weekLabels };
}

// Custom dot with shadow
const CustomDot = (props: DotProps) => {
  const { cx, cy, key, stroke } = props;
  if (typeof cx !== "number" || typeof cy !== "number") return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      stroke={stroke || "#fff"}
      strokeWidth={2}
      fill="#fff"
      filter="url(#dotShadow)"
      key={key}
    />
  );
};

export default function WeeklyTrendChart() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch expenses from Supabase
  useEffect(() => {
    const loadExpenses = async () => {
      setLoading(true);
      const data = await fetchExpenses();
      setExpenses(data);
      setLoading(false);
    };
    loadExpenses();
  }, []);
  
  const { chartData, weekLabels } = useMemo(() => getWeeklyLinesData(expenses), [expenses]);

  // Calculate total spending for this month
  const totalSpending = useMemo(() =>
    expenses.reduce((acc, e) => acc + (typeof e.amount === 'number' ? e.amount : 0), 0),
    [expenses]
  );

  // Check if all values are zero: nothing to show
  const noData =
    chartData.length === 0 ||
    weekLabels.length === 0 ||
    chartData.every((item) =>
      weekLabels.every((w) => !item[w] || item[w] === 0)
    );

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mt-6 shadow-lg">
        <CardContent className="h-80 pt-4">
          <div className="text-center text-muted-foreground py-12">Loading expenses...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mt-6 shadow-2xl border-0">
      <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-xl p-6 shadow-md">
        <CardTitle className="text-2xl text-white font-bold drop-shadow-lg flex flex-col gap-1">
          Weekly Trend (This Month)
          <span className="text-base font-normal text-white/80 mt-1">Track your weekly spending patterns</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80 p-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-b-xl flex flex-col justify-between">
        <div className="px-6 pt-4 pb-2 flex items-center justify-between">
          <span className="text-lg font-semibold text-white/90">Total Spent:</span>
          <span className="text-2xl font-bold text-pink-300 drop-shadow">${totalSpending.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
        <div className="w-full h-full rounded-xl p-2" style={{ minHeight: 240 }}>
          {noData ? (
            <div className="text-center text-muted-foreground py-12">No expenses this month.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                <defs>
                  <filter id="dotShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
                  </filter>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#F59E42" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#334155" strokeDasharray="4 4" />
                <XAxis dataKey="day" tick={{ fontSize: 16, fill: "#c7d2fe", fontWeight: 600 }} axisLine={{ stroke: '#6366F1' }} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 16, fill: "#c7d2fe", fontWeight: 600 }}
                  domain={['auto', 'auto']}
                  width={55}
                  axisLine={{ stroke: '#6366F1' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ background: "#1e293b", border: "none", color: "#fff", borderRadius: 12, boxShadow: '0 4px 24px #0004' }}
                  labelStyle={{ color: "#fbbf24", fontWeight: 700, fontSize: 16 }}
                  itemStyle={{ color: "#fff", fontWeight: 500, fontSize: 15 }}
                  cursor={{ stroke: "#fbbf24", strokeWidth: 2 }}
                />
                <Legend
                  wrapperStyle={{ color: "#fff", fontWeight: 600, fontSize: 16, paddingBottom: 8 }}
                  iconType="circle"
                  verticalAlign="top"
                  height={36}
                  align="right"
                />
                {weekLabels.map((week, idx) => (
                  <Line
                    key={week}
                    type="monotone"
                    dataKey={week}
                    name={week}
                    stroke={WEEK_COLORS[idx % WEEK_COLORS.length]}
                    strokeWidth={3.5}
                    dot={<CustomDot stroke={WEEK_COLORS[idx % WEEK_COLORS.length]} />}
                    activeDot={{ r: 9, fill: '#fff', stroke: WEEK_COLORS[idx % WEEK_COLORS.length], strokeWidth: 3 }}
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationEasing="ease"
                    strokeDasharray="0"
                    shadow="true"
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
