
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChartSection from "@/components/ChartSection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Graphs = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-2 py-8">
      <Card className="w-full max-w-2xl mt-8">
        <CardHeader>
          <CardTitle>Expense Graphs</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartSection />
          <Button
            className="mt-8 w-full"
            onClick={() => navigate("/")}
            variant="secondary"
          >
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Graphs;
