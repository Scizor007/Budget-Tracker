
import React from "react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChartSection from "@/components/ChartSection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-2 py-8">
      <Card className="w-full max-w-md mb-8">
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseForm />
          {/* Graphs button below Add Expense */}
          <Button
            className="w-full mt-4"
            variant="secondary"
            onClick={() => navigate("/graphs")}
          >
            Graphs
          </Button>
          {/* More Features button, kept below Graphs */}
          <Button
            className="w-full mt-2"
            variant="outline"
            onClick={() => navigate("/features")}
          >
            More Features
          </Button>
        </CardContent>
      </Card>
      <ChartSection />
      <div className="w-full max-w-2xl">
        <ExpenseList />
      </div>
    </div>
  );
};

export default Index;
