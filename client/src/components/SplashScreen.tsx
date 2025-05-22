import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading with artificial delay and progress
    const timer = setTimeout(() => {
      onFinish();
    }, 2400);

    // Update progress every 100ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onFinish]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-card dark:bg-background">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-10"
      >
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-24 h-24 mb-6 rounded-full bg-black flex items-center justify-center dark:bg-white"
          >
            <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0H40V8H0V0Z" fill="white" className="dark:fill-black"/>
              <path d="M0 12H40V20H0V12Z" fill="white" className="dark:fill-black"/>
            </svg>
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl font-bold mb-2 text-foreground"
          >
            Trade Republic
          </motion.h1>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-lg font-medium text-foreground"
          >
            Business
          </motion.h2>
        </div>
      </motion.div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className="h-1 bg-black dark:bg-white rounded-full transition-all ease-in-out"
        style={{ width: `${Math.min(progress, 100)}%`, maxWidth: "80%" }}
      />
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-6 text-sm text-muted-foreground"
      >
        Chargement en cours...
      </motion.p>
    </div>
  );
};