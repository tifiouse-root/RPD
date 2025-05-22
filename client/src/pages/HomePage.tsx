import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Transaction } from "@shared/schema";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatFrenchDate } from "@/lib/utils";
import AddTransactionModal from "@/components/AddTransactionModal";
import { TransferIcon } from "@/components/icons/BankIcons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Fetch transactions data
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });

  // Fetch current balance
  const { data: balanceData } = useQuery<{ balance: number }>({
    queryKey: ['/api/balance'],
  });

  // Fetch monthly summary
  const { data: summary } = useQuery<{ revenus: number; dépenses: number; investissement: number }>({
    queryKey: [`/api/summary/${selectedMonth + 1}/${selectedYear}`],
  });

  // Add transaction mutation
  const addTransaction = useMutation({
    mutationFn: (data: any) => {
      return apiRequest('POST', '/api/transactions', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/balance'] });
      queryClient.invalidateQueries({ queryKey: [`/api/summary/${selectedMonth + 1}/${selectedYear}`] });
      toast({
        title: "Transaction ajoutée",
        description: "Votre transaction a été ajoutée avec succès",
      });
      setIsModalOpen(false);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la transaction",
        variant: "destructive",
      });
    },
  });

  // Handle month navigation
  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleAddTransaction = (data: any) => {
    addTransaction.mutate(data);
  };

  return (
    <div className="bg-background text-foreground min-h-screen pb-32">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-muted-foreground text-xl font-medium">Épargne</span>
          <span className="text-foreground text-xl font-bold">Espèces</span>
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

      {/* Balance Card */}
      <section className="px-5 py-3">
        <p className="text-muted-foreground text-sm mb-1">Disponible</p>
        <h1 className="text-foreground text-4xl font-bold mb-4">
          {formatCurrency(balanceData?.balance || 0)}
        </h1>
        
        <div className="flex space-x-4 mb-4">
          <button 
            onClick={handlePreviousMonth} 
            className={`text-sm ${selectedMonth === currentMonth - 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
          >
            {MONTHS[selectedMonth === 0 ? 11 : selectedMonth - 1]}.
          </button>
          <button 
            className="text-foreground text-sm font-medium"
          >
            {MONTHS[selectedMonth]}
          </button>
          <button 
            onClick={handleNextMonth} 
            className={`text-sm ${selectedMonth === currentMonth + 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
          >
            {MONTHS[selectedMonth === 11 ? 0 : selectedMonth + 1]}.
          </button>
        </div>
      </section>

      {/* Circular Charts */}
      <section className="px-5 py-2 flex justify-center space-x-1 mb-6">
        {/* Income Circle */}
        <div className="w-[110px] h-[110px] rounded-full flex items-center justify-center flex-col border-[3px] border-chart-1" 
             style={{ backgroundColor: "rgba(74, 222, 128, 0.15)" }}>
          <span className="text-xl font-bold">{formatCurrency(summary?.revenus || 0, { minimumFractionDigits: 0 })}</span>
          <span className="text-xs text-muted-foreground">Revenus</span>
        </div>
        
        {/* Expenses Circle */}
        <div className="w-[110px] h-[110px] rounded-full flex items-center justify-center flex-col ml-5 border-[3px] border-chart-2" 
             style={{ backgroundColor: "rgba(139, 92, 246, 0.15)" }}>
          <span className="text-xl font-bold">{formatCurrency(summary?.dépenses || 0, { minimumFractionDigits: 0 })}</span>
          <span className="text-xs text-muted-foreground">Dépenses</span>
        </div>
        
        {/* Investments Circle */}
        <div className="w-[110px] h-[110px] rounded-full flex items-center justify-center flex-col ml-5 border-[3px] border-chart-3" 
             style={{ backgroundColor: "rgba(51, 51, 51, 0.15)" }}>
          <span className="text-xl font-bold">{formatCurrency(summary?.investissement || 0, { minimumFractionDigits: 0 })}</span>
          <span className="text-xs text-muted-foreground">Investissement</span>
        </div>
      </section>

      {/* Transaction Section */}
      <section className="px-5 py-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Transactions</h2>
          <motion.button 
            className="text-foreground bg-card rounded-full p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </div>
        
        {/* Liste des transactions */}
        {transactions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.1
              }}
              className="w-20 h-20 rounded-full bg-card flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </motion.div>
            <p className="text-muted-foreground text-lg font-medium">Aucune transaction</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-chart-1 font-medium flex items-center space-x-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Ajouter une transaction</span>
            </motion.button>
          </motion.div>
        ) : (
          <div className="max-h-[40vh] overflow-y-auto pr-1 mt-4 scrollbar-thin space-y-2">
            {transactions.map((transaction, index) => (
              <motion.div 
                key={transaction.id} 
                className="flex items-center justify-between py-3 border-b border-border hover:bg-card/40 rounded-xl px-3 transition-all duration-300 cursor-pointer mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 24,
                  delay: index * 0.05
                }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex items-center">
                  <Avatar className={`rounded-full w-12 h-12 mr-3 flex items-center justify-center shadow-md ${
                    transaction.type === "revenus" 
                      ? "bg-chart-1/20 text-chart-1" 
                      : transaction.type === "dépenses" 
                        ? "bg-chart-2/20 text-chart-2" 
                        : "bg-chart-3/20 text-chart-3"
                  }`}>
                    {transaction.recipient ? transaction.recipient.charAt(0).toUpperCase() : <TransferIcon />}
                  </Avatar>
                  <div>
                    <p className="font-medium text-base">{transaction.recipient || transaction.description}</p>
                    <div className="flex items-center text-muted-foreground text-xs mt-1">
                      <span className="mr-2">{formatFrenchDate(new Date(transaction.date))}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        transaction.type === "revenus" 
                          ? "bg-chart-1/20 text-chart-1" 
                          : transaction.type === "dépenses" 
                            ? "bg-chart-2/20 text-chart-2" 
                            : "bg-chart-3/20 text-chart-3"
                      }`}>
                        {transaction.type === "revenus" 
                          ? "Reçu" 
                          : transaction.type === "dépenses" 
                            ? "Envoyé" 
                            : "Investi"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-base ${
                    transaction.type === "revenus" 
                      ? "text-chart-1" 
                      : transaction.type === "dépenses" 
                        ? "text-chart-2" 
                        : "text-chart-3"
                  }`}>
                    {transaction.type === "revenus" ? "+" : transaction.type === "dépenses" ? "-" : ""}
                    {formatCurrency(Number(transaction.amount))}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Floating Action Button - Mobile Optimized */}
      <motion.button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-5 w-16 h-16 rounded-full bg-chart-1 flex items-center justify-center shadow-lg z-10"
        whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(74, 222, 128, 0.3)" }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ 
            scale: { repeat: Infinity, repeatType: "loop", duration: 2, repeatDelay: 2 }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </motion.div>
      </motion.button>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl pb-2 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="flex justify-center py-1 mb-1">
          <div className="w-[15%] h-[4px] bg-muted rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-4 gap-1 px-3 py-3">
          <motion.button
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-card/60 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 text-chart-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium">Accueil</span>
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/statistics')}
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-card/60 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs font-medium text-muted-foreground">Statistiques</span>
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

      {/* Add Transaction Modal */}
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddTransaction={handleAddTransaction}
        isPending={addTransaction.isPending}
      />
    </div>
  );
}