
import React, { useState, useRef, useEffect } from "react";

const DEFAULT_CATEGORIES = [
  "Food", "Travel", "Shopping", "Bills", "Entertainment", "Health", "Other"
];

// Read categories from localStorage, falling back to defaults
function loadCategories(): string[] {
  const storage = localStorage.getItem("userCategories");
  try {
    const arr = storage ? JSON.parse(storage) : [];
    if (Array.isArray(arr)) return Array.from(new Set([...DEFAULT_CATEGORIES, ...arr]));
    return DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

// Save categories to localStorage (excluding defaults)
function saveCategories(cats: string[]) {
  const filtered = cats.filter(
    (cat) => !DEFAULT_CATEGORIES.includes(cat)
  );
  localStorage.setItem("userCategories", JSON.stringify(filtered));
}

// Simple fuzzy matching: checks if input is close to suggestion
function fuzzyMatch(input: string, suggestion: string): boolean {
  const a = input.trim().toLowerCase();
  const b = suggestion.trim().toLowerCase();
  if (a === b) return true;
  if (b.startsWith(a)) return true;
  // Levenshtein distance (max 1 edit)
  if (levenshtein(a, b) <= 1) return true;
  return false;
}

// Levenshtein distance between two strings
function levenshtein(a: string, b: string): number {
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] =
        a[i - 1] === b[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
    }
  }
  return matrix[a.length][b.length];
}

type Props = {
  value: string;
  onChange: (category: string) => void;
  inputId?: string;
};

// The CategoryInput provides suggestions as the user types.
// Selecting a suggestion or entering a new unique category is supported.
const CategoryInput: React.FC<Props> = ({ value, onChange, inputId }) => {
  const [categories, setCategories] = useState<string[]>(() => loadCategories());
  const [input, setInput] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  // Update input field if value prop changes (mainly when ExpenseForm resets)
  useEffect(() => {
    setInput(value);
  }, [value]);

  // Suggest categories that fuzzy-match the input, or start with it
  useEffect(() => {
    if (!input.trim()) {
      setSuggestions(categories.slice(0, 5));
      return;
    }
    const filtered = categories
      .filter(
        (cat) =>
          fuzzyMatch(input, cat) ||
          cat.toLowerCase().includes(input.trim().toLowerCase())
      )
      .sort((a, b) => a.localeCompare(b));
    setSuggestions(filtered.slice(0, 6));
  }, [input, categories]);

  // Add new category if not present (on blur or submit)
  function handleBlur() {
    setTimeout(() => setShowSuggestions(false), 120); // allow suggestion click
    commitCategory();
  }

  function handleSuggestionClick(cat: string) {
    setInput(cat);
    setShowSuggestions(false);
    onChange(cat);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    setShowSuggestions(true);
  }

  function commitCategory() {
    let match = categories.find(c => fuzzyMatch(input, c));
    let cat = (match ? match : input).trim();
    if (!cat) return;
    if (!categories.includes(cat)) {
      setCategories(prev => {
        const next = [...prev, cat].sort((a, b) => a.localeCompare(b));
        saveCategories(next);
        return next;
      });
    }
    onChange(cat);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      commitCategory();
      setShowSuggestions(false);
      ref.current?.blur();
    }
    if (e.key === "ArrowDown") {
      setShowSuggestions(true);
    }
  }

  return (
    <div className="relative">
      <input
        id={inputId}
        ref={ref}
        className="w-full rounded-md border px-3 py-2 bg-background mt-1"
        placeholder="Start typing a category..."
        value={input}
        onFocus={() => setShowSuggestions(true)}
        onBlur={handleBlur}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck="false"
        type="text"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute left-0 w-full mt-1 bg-popover border border-border rounded shadow-lg z-30 max-h-48 overflow-y-auto text-sm">
          {suggestions.map((cat) => (
            <li
              key={cat}
              onMouseDown={e => { e.preventDefault(); handleSuggestionClick(cat); }}
              className={"cursor-pointer px-3 py-2 hover:bg-accent transition-colors"}
              tabIndex={-1}
            >
              {cat}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryInput;
