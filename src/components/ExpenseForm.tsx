import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { saveExpense, Expense } from "@/lib/expenseStorage";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const CATEGORY_OPTIONS = [
  "Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Other"
];

type Props = {
  onAdd?: (e: Expense) => void;
};

export default function ExpenseForm({ onAdd }: Props) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");
  const [date, setDate] = useState<Date>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      toast({ title: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    const expense: Expense = {
      id: uuidv4(),
      amount: amt,
      category,
      note,
      date: date.toISOString(),
    };
    saveExpense(expense);
    setAmount("");
    setNote("");
    setCategory("Food");
    setDate(new Date());
    toast({ title: "Expense added!" });
    if (onAdd) onAdd(expense);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          value={amount}
          onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
          placeholder="e.g. 12.50"
          inputMode="decimal"
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          className="w-full rounded-md border px-3 py-2 bg-background"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          {CATEGORY_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="note">Note</Label>
        <Textarea
          id="note"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="e.g. Lunch at KFC"
          rows={2}
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={v=>v && setDate(v)}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button type="submit" className="w-full">Add Expense</Button>
    </form>
  );
}
