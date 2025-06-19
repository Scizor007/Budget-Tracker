import React from "react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChartSection from "@/components/ChartSection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-2 py-4 sm:py-8 relative section-fade">
      <ThemeToggle />
      <Card className="w-full max-w-md mb-8 shadow-lg card-modern animate-fadeInUp">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Add Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseForm />
          <Button
            className="w-full mt-4 button-modern animate-pop"
            variant="secondary"
            onClick={() => navigate("/graphs")}
          >
            Graphs
          </Button>
          <Button
            className="w-full mt-2 button-modern animate-pop"
            variant="outline"
            onClick={() => navigate("/features")}
          >
            More Features
          </Button>
          <Button
            className="w-full mt-2 button-modern animate-pop"
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </Button>
        </CardContent>
      </Card>
      <div className="w-full max-w-2xl animate-fadeInUp">
        <ChartSection />
      </div>
      <div className="w-full max-w-2xl animate-fadeInUp">
        <ExpenseList />
      </div>
    </div>
  );
};

export default Index;
