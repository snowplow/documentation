import React from "react";
import { cn } from "../../lib/utils.js";
import { 
  Home, 
  BookOpen, 
  Settings, 
  User, 
  ChevronDown,
  Menu
} from "lucide-react";
import ThemeSwitcher from "./theme-switcher.jsx";

const Navigation = ({ className }) => {
  return (
    <nav className={cn("border-b", className)}>
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <a href="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6" />
          
          </a>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <a href="/docs" className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary">
              <BookOpen className="h-4 w-4" />
              <span>Docs</span>
            </a>
            <a href="/settings" className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </a>
            
            <ThemeSwitcher />
          </div>
          
          <div className="md:hidden flex items-center space-x-4">
            <ThemeSwitcher />
            <button>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 