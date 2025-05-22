import { 
  users, type User, type InsertUser,
  transactions, type Transaction, type InsertTransaction
} from "@shared/schema";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel en utilisant ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le fichier JSON
const DATA_FILE_PATH = path.join(__dirname, 'data', 'transactions.json');

// Interface pour les données stockées dans le JSON
interface JsonData {
  transactions: Transaction[];
  settings: {
    theme: 'dark' | 'light';
  };
}

// Fonction pour lire les données JSON
function readJsonData(): JsonData {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      // Si le fichier n'existe pas, créer le fichier avec des données par défaut
      const defaultData: JsonData = {
        transactions: [],
        settings: {
          theme: 'dark'
        }
      };
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data) as JsonData;
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier JSON:', error);
    // Retourner des données par défaut en cas d'erreur
    return {
      transactions: [],
      settings: {
        theme: 'dark'
      }
    };
  }
}

// Fonction pour écrire les données JSON
function writeJsonData(data: JsonData): void {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erreur lors de l\'écriture du fichier JSON:', error);
  }
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Transaction methods
  getTransactions(userId: number): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getMonthlySummary(userId: number, month: number, year: number): Promise<{
    revenus: number;
    dépenses: number;
    investissement: number;
  }>;
  getBalance(userId: number): Promise<number>;
  saveSettings(theme: 'dark' | 'light'): Promise<void>;
  getSettings(): Promise<{ theme: 'dark' | 'light' }>;
}

export class JsonStorage implements IStorage {
  private users: Map<number, User>;
  private transactions: Transaction[];
  private settings: { theme: 'dark' | 'light' };
  private currentUserId: number;
  private currentTransactionId: number;

  constructor() {
    this.users = new Map();
    
    // Lire les données à partir du fichier JSON
    const jsonData = readJsonData();
    this.transactions = jsonData.transactions;
    this.settings = jsonData.settings;
    
    // Configurer les ID
    this.currentUserId = 1;
    this.currentTransactionId = this.transactions.length > 0 
      ? Math.max(...this.transactions.map(t => t.id)) + 1
      : 1;
    
    // Créer un utilisateur par défaut si aucun n'existe
    this.createUser({
      username: "demo",
      password: "password"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTransactions(userId: number): Promise<Transaction[]> {
    return this.transactions
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.find(transaction => transaction.id === id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    
    // Créer une nouvelle transaction en évitant la propagation directe des propriétés
    const transaction: Transaction = { 
      id,
      date: new Date(),
      amount: typeof insertTransaction.amount === 'string' 
        ? insertTransaction.amount
        : String(insertTransaction.amount),
      description: insertTransaction.description,
      type: insertTransaction.type,
      userId: insertTransaction.userId,
      recipient: insertTransaction.recipient || null
    };
    
    // Ajouter la transaction au tableau
    this.transactions.push(transaction);
    
    // Enregistrer dans le fichier JSON
    writeJsonData({
      transactions: this.transactions,
      settings: this.settings
    });
    
    return transaction;
  }

  async getMonthlySummary(userId: number, month: number, year: number): Promise<{
    revenus: number;
    dépenses: number;
    investissement: number;
  }> {
    const userTransactions = await this.getTransactions(userId);
    const monthlyTransactions = userTransactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });

    return monthlyTransactions.reduce(
      (summary, transaction) => {
        const amount = parseFloat(transaction.amount.toString());
        
        if (transaction.type === "revenus") {
          summary.revenus += amount;
        } else if (transaction.type === "dépenses") {
          summary.dépenses += amount;
        } else if (transaction.type === "investissement") {
          summary.investissement += amount;
        }
        
        return summary;
      },
      { revenus: 0, dépenses: 0, investissement: 0 }
    );
  }

  async getBalance(userId: number): Promise<number> {
    const transactions = await this.getTransactions(userId);
    
    return transactions.reduce((balance, transaction) => {
      const amount = parseFloat(transaction.amount.toString());
      
      if (transaction.type === "revenus") {
        return balance + amount;
      } else if (transaction.type === "dépenses") {
        return balance - amount;
      } else {
        return balance;
      }
    }, 0);
  }
  
  async saveSettings(theme: 'dark' | 'light'): Promise<void> {
    this.settings.theme = theme;
    
    writeJsonData({
      transactions: this.transactions,
      settings: this.settings
    });
  }
  
  async getSettings(): Promise<{ theme: 'dark' | 'light' }> {
    return this.settings;
  }
}

// Exporter une instance de JsonStorage au lieu de MemStorage
export const storage = new JsonStorage();
