import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeeklyTrendChart from "@/components/WeeklyTrendChart";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-2 py-4 sm:py-8 section-fade">
      <Card className="w-full max-w-2xl mt-8 shadow-lg card-modern animate-fadeInUp">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Spending Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyTrendChart />
          <Button className="mt-8 w-full button-modern animate-pop" onClick={() => navigate("/")} variant="secondary">
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
