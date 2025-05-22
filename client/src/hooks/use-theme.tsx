import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isSyncing: boolean;
};

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
  isSyncing: false
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [isSyncing, setIsSyncing] = useState(false);

  // Fonction pour synchroniser le thème avec le serveur
  const syncThemeWithServer = async (newTheme: Theme) => {
    try {
      setIsSyncing(true);
      await apiRequest('POST', '/api/settings', { theme: newTheme });
      setIsSyncing(false);
    } catch (error) {
      console.error('Erreur lors de la synchronisation du thème:', error);
      setIsSyncing(false);
    }
  };

  // Charger le thème depuis le serveur au démarrage
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        setIsSyncing(true);
        const response = await apiRequest('GET', '/api/settings');
        if (response && typeof response === 'object' && 'theme' in response) {
          setThemeState(response.theme as Theme);
        }
        setIsSyncing(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des paramètres:', error);
        setIsSyncing(false);
      }
    };
    
    fetchTheme();
  }, []);

  // Fonction pour définir le thème et le synchroniser
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    syncThemeWithServer(newTheme);
  };

  // Appliquer le thème au DOM et le stocker localement
  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme,
    isSyncing
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
