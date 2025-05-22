import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import StatisticsPage from "@/pages/StatisticsPage";
import CardsPage from "@/pages/CardsPage";
import SettingsPage from "@/pages/SettingsPage";
import { SplashScreen } from "@/components/SplashScreen";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/statistics" component={StatisticsPage} />
      <Route path="/cards" component={CardsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleFinishLoading = () => {
    setIsLoading(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {isLoading ? (
          <SplashScreen onFinish={handleFinishLoading} />
        ) : (
          <Router />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
