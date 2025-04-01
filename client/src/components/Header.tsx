import React from "react";
import { ThemeToggle } from "./ThemeToggle";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 sticky top-0 z-50 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-semibold text-xl">L</span>
              </div>
              <h1 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
                Lexa <span className="text-gray-400 dark:text-gray-300 text-sm font-normal">• Powered by Quzard</span>
              </h1>
            </div>
          </div>
          <nav className="flex space-x-4 items-center">
            <ThemeToggle />
            <a href="#" className="text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium">
              Documentation
            </a>
            <a href="#" className="text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium">
              API
            </a>
            <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              Get Started
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
