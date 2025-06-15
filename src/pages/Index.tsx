import React, { useState } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChartSection from "@/components/ChartSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-2 py-8">
      <Card className="w-full max-w-md mb-8">
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseForm />
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
