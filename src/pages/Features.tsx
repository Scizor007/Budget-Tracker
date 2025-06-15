
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-2 py-4 sm:py-8">
      <Card className="w-full max-w-md mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl text-center">
            Coming Soon: More Features!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-center text-base sm:text-lg">This page will hold more advanced features for your expense tracker. Stay tuned!</p>
          <Button onClick={() => navigate("/")} className="w-full max-w-xs mx-auto">
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
export default Features;
