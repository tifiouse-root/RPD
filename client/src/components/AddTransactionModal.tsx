import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { motion } from "framer-motion";

// Form validation schema
const formSchema = z.object({
  amount: z.string().min(1, "Le montant est requis"),
  description: z.string().min(1, "La description est requise"),
  type: z.enum(["revenus", "dépenses", "investissement"]),
  recipient: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (data: FormValues) => void;
  isPending: boolean;
}

export default function AddTransactionModal({ 
  isOpen, 
  onClose, 
  onAddTransaction,
  isPending
}: AddTransactionModalProps) {
  const [activeType, setActiveType] = useState<"revenus" | "dépenses" | "investissement">("dépenses");

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      description: "",
      type: "dépenses",
      recipient: "",
    },
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    // Update the type based on the selected type
    data.type = activeType;
    onAddTransaction(data);
  };

  // Handle type selection
  const handleTypeChange = (type: "revenus" | "dépenses" | "investissement") => {
    setActiveType(type);
    form.setValue("type", type);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const iconVariants = {
    initial: { scale: 0 },
    animate: { scale: 1, transition: { type: "spring", stiffness: 500, damping: 30, delay: 0.2 } }
  };

  // Get color based on type
  const getTypeColor = (type: string) => {
    switch(type) {
      case "revenus": return "var(--chart-1)";
      case "dépenses": return "var(--chart-2)";
      case "investissement": return "var(--chart-3)";
      default: return "var(--chart-1)";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md max-w-[90%] bg-background rounded-2xl p-6 max-h-[90vh] overflow-auto border-0 shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed"
        style={{ width: "450px" }}
      >
        <DialogTitle className="sr-only">Nouvelle Transaction</DialogTitle> {/* For accessibility */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="text-center space-y-2">
            <motion.div 
              className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3" 
              initial="initial"
              animate="animate"
              variants={iconVariants}
              style={{ backgroundColor: `color-mix(in srgb, ${getTypeColor(activeType)} 15%, transparent)` }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ color: getTypeColor(activeType) }}>
                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold">Nouvelle Transaction</h2>
            <p className="text-muted-foreground text-sm">Ajoutez les détails de votre transaction</p>
          </motion.div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Montant</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="decimal"
                          placeholder="0,00 €"
                          className="bg-card border-none rounded-xl p-4 text-xl font-bold transition-all duration-200 focus:ring-2 focus:ring-offset-2"
                          style={{ borderColor: getTypeColor(activeType), boxShadow: `0 0 0 1px ${getTypeColor(activeType)}15` }}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ajouter une description"
                          className="bg-card border-none rounded-xl p-4 transition-all duration-200 focus:ring-2 focus:ring-offset-2"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Destinataire (optionnel)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nom du destinataire"
                          className="bg-card border-none rounded-xl p-4 transition-all duration-200 focus:ring-2 focus:ring-offset-2"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2">
                <FormLabel className="text-muted-foreground block">Type</FormLabel>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    type="button"
                    onClick={() => handleTypeChange("revenus")}
                    className={`rounded-xl py-3 font-medium transition-all duration-300 transform ${
                      activeType === "revenus"
                        ? "bg-chart-1/20 text-chart-1 hover:bg-chart-1/30 scale-105"
                        : "bg-muted/20 text-muted-foreground hover:bg-muted/30"
                    }`}
                  >
                    Revenus
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleTypeChange("dépenses")}
                    className={`rounded-xl py-3 font-medium transition-all duration-300 transform ${
                      activeType === "dépenses"
                        ? "bg-chart-2/20 text-chart-2 hover:bg-chart-2/30 scale-105"
                        : "bg-muted/20 text-muted-foreground hover:bg-muted/30"
                    }`}
                  >
                    Dépenses
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleTypeChange("investissement")}
                    className={`rounded-xl py-3 font-medium transition-all duration-300 transform ${
                      activeType === "investissement"
                        ? "bg-chart-3/20 text-chart-3 hover:bg-chart-3/30 scale-105"
                        : "bg-muted/20 text-muted-foreground hover:bg-muted/30"
                    }`}
                  >
                    Invest.
                  </Button>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="pt-4">
                <motion.div 
                  className="w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full rounded-xl py-5 font-bold text-black transition-all duration-300 transform hover:scale-[1.02]"
                    style={{ 
                      background: getTypeColor(activeType),
                      boxShadow: `0 10px 15px -3px ${getTypeColor(activeType)}30`
                    }}
                  >
                    {isPending ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Traitement...
                      </div>
                    ) : "Confirmer"}
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </Form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
