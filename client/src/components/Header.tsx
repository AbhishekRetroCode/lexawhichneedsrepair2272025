import React from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { useLocation, Link } from "wouter";
import { Button } from "./ui/button";
import { Home, Settings, History } from "lucide-react";

export const Header: React.FC = () => {
  const [location, setLocation] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <h1 className="text-2xl font-bold heading-font text-primary cursor-pointer hover:text-primary/80 transition-colors">
              Writtus
            </h1>
          </Link>
          <span className="text-sm text-muted-foreground">
            Powered by Cripticle
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={location === "/" ? "bg-accent" : ""}
          >
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={location === "/history" ? "bg-accent" : ""}
          >
            <Link to="/history">
              <History className="h-4 w-4 mr-2" />
              History
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className={location === "/settings" ? "bg-accent" : ""}
          >
            <Link to="/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>

          <div className="flex items-center space-x-4">
            {location !== '/' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/')}
                className="flex items-center space-x-2"
              >
                <span>🏠</span>
                <span>Home</span>
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};