import React from "react";
import { ThemeToggle } from "./ThemeToggle";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 shadow-lg backdrop-blur-sm sticky top-0 z-50 transition-all border-b-2 border-amber-200 dark:border-amber-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-5">
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center shadow-lg relative ink-drop">
                <span className="text-white font-bold text-xl heading-font">L</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100 heading-font">
                  Lexa
                </h1>
                <p className="text-sm text-amber-700 dark:text-amber-300 font-medium italic writing-font">
                  Powered by Quzard
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-2 text-amber-800 dark:text-amber-200">
              <span className="text-xl">🖋️</span>
              <span className="text-sm writing-font italic font-medium">Where Ideas Flow Like Ink</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
