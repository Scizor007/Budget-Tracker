
import React, { useMemo } from "react";
import { getExpenses } from "@/lib/expenseStorage";
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
  "#4F46E5",
  "#F59E42",
  "#EF4444",
  "#10B981",
  "#E11D48",
  "#A21CAF",
  "#FACC15",
  "#6366F1",
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

// Custom black dot for points
const CustomDot = (props: DotProps) => {
  const { cx, cy, key } = props;
  // Only forward the correct props--no spreads from DotProps
  if (typeof cx !== "number" || typeof cy !== "number") return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      stroke="black"
      strokeWidth={2}
      fill="black"
      key={key}
    />
  );
};

export default function WeeklyTrendChart() {
  const expenses = useMemo(() => getExpenses(), []);
  const { chartData, weekLabels } = useMemo(() => getWeeklyLinesData(expenses), [expenses]);

  // Check if all values are zero: nothing to show
  const noData =
    chartData.length === 0 ||
    weekLabels.length === 0 ||
    chartData.every((item) =>
      weekLabels.every((w) => !item[w] || item[w] === 0)
    );

  return (
    <Card className="w-full max-w-2xl mt-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Weekly Trend (This Month)</CardTitle>
      </CardHeader>
      <CardContent className="h-64 sm:h-72 pt-4">
        <div className="w-full h-full rounded-md p-2" style={{ background: "#111111" }}>
          {noData ? (
            <div className="text-center text-muted-foreground py-12">No expenses this month.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#e5e5e5" }} />
                <YAxis
                  tick={{ fontSize: 12, fill: "#e5e5e5" }}
                  domain={['auto', 'auto']}
                  width={45}
                />
                <Tooltip
                  contentStyle={{ background: "#222", border: "none", color: "#fff" }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                  cursor={{ stroke: "#334155", strokeWidth: 2 }}
                />
                <Legend
                  wrapperStyle={{ color: "#fff" }}
                  iconType="line"
                  verticalAlign="top"
                  height={30}
                />
                {weekLabels.map((week, idx) => (
                  <Line
                    key={week}
                    type="monotone"
                    dataKey={week}
                    name={week}
                    stroke={WEEK_COLORS[idx % WEEK_COLORS.length]}
                    strokeWidth={2.5}
                    dot={<CustomDot />}
                    activeDot={{ r: 7, fill: 'white', stroke: WEEK_COLORS[idx % WEEK_COLORS.length], strokeWidth: 2 }}
                    isAnimationActive={false}
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
