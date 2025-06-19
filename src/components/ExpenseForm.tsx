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
import { addExpense } from "@/lib/supabaseExpenses";
import CategoryInput from "./CategoryInput";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      toast({ title: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    const newExpense = {
      amount: amt,
      category,
      note,
      date: date.toISOString(),
    };
    const result = await addExpense(newExpense);
    if (result.error) {
      toast({ title: "Error adding expense", description: result.error.message, variant: "destructive" });
      return;
    }
    setAmount("");
    setNote("");
    setCategory("Food");
    setDate(new Date());
    toast({ title: "Expense added!" });
    if (onAdd && result.data) onAdd(result.data);
  };

  return (
    <form className="space-y-4 animate-fadeInUp" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          value={amount}
          onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
          placeholder="e.g. 12.50"
          inputMode="decimal"
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <CategoryInput
          value={category}
          onChange={setCategory}
          inputId="category"
        />
      </div>
      <div>
        <Label htmlFor="note">Note</Label>
        <Textarea
          id="note"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="e.g. Lunch at KFC"
          rows={2}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full justify-start text-left font-normal mt-1 button-modern animate-pop"
            >
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-30" align="start">
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
      <Button type="submit" className="w-full mt-2 text-base py-3 button-modern animate-pop">Add Expense</Button>
    </form>
  );
}
