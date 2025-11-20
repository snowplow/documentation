import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { Sun, Moon } from 'lucide-react';
import { Button } from './button';

const ThemeSwitcher = () => {
  const { colorMode, setColorMode } = useColorMode();

  const toggleTheme = () => {
    const newTheme = colorMode === 'dark' ? 'light' : 'dark';
    setColorMode(newTheme);
    // Ensure the theme is applied to the root element
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="transition-colors duration-300"
    >
      {colorMode === 'dark' ? (
        <Sun className="h-5 w-5 transition-transform duration-300" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-300" />
      )}
    </Button>
  );
};

export default ThemeSwitcher; 