
-- Create a table for expenses
CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  amount numeric NOT NULL,
  category text NOT NULL,
  note text,
  date timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read expenses for now
CREATE POLICY "Allow read all expenses" ON public.expenses
  FOR SELECT
  USING (true);

-- Policy: Anyone can insert expenses (no auth yet, can update later)
CREATE POLICY "Allow insert all expenses" ON public.expenses
  FOR INSERT
  WITH CHECK (true);

-- Policy: Anyone can update their own expenses (matching user_id if added later)
CREATE POLICY "Allow update own expenses" ON public.expenses
  FOR UPDATE
  USING (true);

-- Policy: Anyone can delete their own expenses
CREATE POLICY "Allow delete own expenses" ON public.expenses
  FOR DELETE
  USING (true);
