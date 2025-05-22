import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

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

export default function CardsPage() {
  const [, navigate] = useLocation();

  return (
    <div className="bg-background text-foreground min-h-screen pb-32">
      {/* Header */}
      <header className="px-5 pt-4 pb-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-foreground text-xl font-bold">Cartes</span>
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-5 py-4"
      >
        {/* Main card */}
        <motion.div 
          variants={itemVariants}
          className="w-full h-60 bg-gradient-to-br from-black to-black/90 rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-white/70 mb-1">Trade Republic</p>
                <h2 className="text-xl font-bold text-white">Carte Premium</h2>
              </div>
              <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H48V9H0V0Z" fill="white" fillOpacity="0.8"/>
                <path d="M0 15H48V24H0V15Z" fill="white" fillOpacity="0.8"/>
              </svg>
            </div>
            
            <div>
              <p className="text-lg font-medium text-white mb-1">**** **** **** 7849</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-white/70">EXPIRATION</p>
                  <p className="text-sm text-white">09/27</p>
                </div>
                <div>
                  <p className="text-xs text-white/70">CVV</p>
                  <p className="text-sm text-white">***</p>
                </div>
                <svg width="48" height="30" viewBox="0 0 48 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="48" height="30" rx="4" fill="white" fillOpacity="0.1"/>
                  <path d="M20 15C20 12.7909 21.7909 11 24 11C26.2091 11 28 12.7909 28 15C28 17.2091 26.2091 19 24 19C21.7909 19 20 17.2091 20 15Z" fill="white" fillOpacity="0.8"/>
                  <path d="M16 15C16 17.2091 17.7909 19 20 19C22.2091 19 24 17.2091 24 15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        
      </motion.div>

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
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-card/60 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 text-chart-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium text-chart-1">Cartes</span>
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