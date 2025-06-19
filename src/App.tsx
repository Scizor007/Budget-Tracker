import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Features from "./pages/Features";
import Graphs from "./pages/Graphs";
import Dashboard from "./pages/Dashboard";
import Navbar from "@/components/Navbar";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import ExpenseForm from "@/components/ExpenseForm";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const queryClient = new QueryClient();

const Fab = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="fixed z-50 bottom-8 right-8 bg-gradient-to-r from-sky-500 via-blue-700 to-blue-900 text-white rounded-full shadow-2xl p-4 flex items-center justify-center hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400 animate-fadeInUp"
          aria-label="Add Expense"
        >
          <Plus className="w-7 h-7" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <h2 className="text-xl font-bold mb-4">Add Expense</h2>
        <ExpenseForm onAdd={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -24 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    style={{ minHeight: '100vh' }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/features" element={<PageTransition><Features /></PageTransition>} />
        <Route path="/graphs" element={<PageTransition><Graphs /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <AnimatedRoutes />
        <Fab />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
