import React, { createContext, useContext, useState } from 'react';
import { COLORS } from '../constants/colors';

interface ThemeContextType {
  colors: typeof COLORS;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);

  const toggleHighContrast = () => setHighContrast((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{
        colors: COLORS,
        highContrast,
        toggleHighContrast,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
