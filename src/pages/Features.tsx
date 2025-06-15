
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-2 py-8">
      <Card className="w-full max-w-md mt-8">
        <CardHeader>
          <CardTitle>Coming Soon: More Features!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">This page will hold more advanced features for your expense tracker. Stay tuned!</p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </CardContent>
      </Card>
    </div>
  );
};
export default Features;
