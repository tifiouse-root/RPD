import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

export default function StatisticsPage() {
  const [, navigate] = useLocation();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Fetch yearly summary
  const { data: yearlyData } = useQuery<any>({
    queryKey: [`/api/yearly-summary/${selectedYear}`],
    // Fallback to using monthly data
    queryFn: async () => {
      const monthlySummaries = await Promise.all(
        Array.from({ length: 12 }, (_, i) => 
          fetch(`/api/summary/${i + 1}/${selectedYear}`).then(res => res.json())
        )
      );
      
      return {
        monthlySummaries,
        totalRevenus: monthlySummaries.reduce((sum, month) => sum + (month.revenus || 0), 0),
        totalDépenses: monthlySummaries.reduce((sum, month) => sum + (month.dépenses || 0), 0),
        totalInvestissement: monthlySummaries.reduce((sum, month) => sum + (month.investissement || 0), 0),
      };
    }
  });

  return (
    <div className="bg-background text-foreground min-h-screen pb-32">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-foreground text-xl font-bold">Statistiques</span>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <motion.button 
            className="bg-card rounded-full p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="4" />
            </svg>
          </motion.button>
        </div>
      </header>

      {/* Yearly Summary */}
      <motion.section 
        className="px-5 py-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex justify-between items-center mb-6"
          variants={itemVariants}
        >
          <Button 
            onClick={() => setSelectedYear(selectedYear - 1)}
            variant="ghost" 
            className="px-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </Button>
          <h2 className="text-2xl font-bold">{selectedYear}</h2>
          <Button 
            onClick={() => setSelectedYear(selectedYear + 1)}
            variant="ghost" 
            className="px-2"
            disabled={selectedYear >= currentYear}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Button>
        </motion.div>

        {/* Annual Summary Cards */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <motion.div
            variants={itemVariants}
            className="bg-card rounded-xl p-5 shadow-soft"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Bilan annuel</h3>
              <span className="text-xs text-muted-foreground bg-card px-2 py-1 rounded-full">
                {selectedYear}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-2">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Revenus</p>
                <p className={`text-xl font-bold text-chart-1`}>{formatCurrency(yearlyData?.totalRevenus || 0)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Dépenses</p>
                <p className={`text-xl font-bold text-chart-2`}>{formatCurrency(yearlyData?.totalDépenses || 0)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Investissement</p>
                <p className={`text-xl font-bold text-chart-3`}>{formatCurrency(yearlyData?.totalInvestissement || 0)}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Épargne nette</p>
                <p className="text-xl font-bold">
                  {formatCurrency((yearlyData?.totalRevenus || 0) - (yearlyData?.totalDépenses || 0))}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Monthly Breakdown */}
        <motion.h3 
          variants={itemVariants}
          className="text-lg font-medium mb-4"
        >
          Détail mensuel
        </motion.h3>

        <motion.div 
          variants={itemVariants}
          className="space-y-3"
        >
          {MONTHS.map((month, index) => {
            const monthlySummary = yearlyData?.monthlySummaries?.[index] || { revenus: 0, dépenses: 0, investissement: 0 };
            const hasActivity = monthlySummary.revenus > 0 || monthlySummary.dépenses > 0 || monthlySummary.investissement > 0;
            
            return (
              <motion.div 
                key={month}
                className={`bg-card rounded-xl p-4 ${hasActivity ? 'shadow-soft' : 'opacity-60'}`}
                whileHover={hasActivity ? { scale: 1.02, x: 5 } : {}}
                whileTap={hasActivity ? { scale: 0.98 } : {}}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{month}</h4>
                  <div className="flex space-x-3">
                    {monthlySummary.revenus > 0 && (
                      <span className="text-chart-1 text-sm font-medium">+{formatCurrency(monthlySummary.revenus || 0)}</span>
                    )}
                    {monthlySummary.dépenses > 0 && (
                      <span className="text-chart-2 text-sm font-medium">-{formatCurrency(monthlySummary.dépenses || 0)}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl pb-2 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="flex justify-center py-1 mb-1">
          <div className="w-[15%] h-[4px] bg-muted rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-4 gap-1 px-3 py-3">
          <motion.button
            onClick={() => navigate('/')}
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-card/60 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium text-muted-foreground">Accueil</span>
          </motion.button>
          
          <motion.button
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-card/60 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 text-chart-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs font-medium text-chart-1">Statistiques</span>
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/cards')}
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-card/60 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium text-muted-foreground">Cartes</span>
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/settings')}
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-card/60 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-medium text-muted-foreground">Paramètres</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}