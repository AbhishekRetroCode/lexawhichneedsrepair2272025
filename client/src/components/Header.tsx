import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { HomeIcon, SettingsIcon } from "@radix-ui/react-icons";

export const Header: React.FC = () => {
  const [location] = useLocation();

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
            className={location.pathname === "/" ? "bg-accent" : ""}
          >
            <Link to="/">
              <HomeIcon className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className={location.pathname === "/settings" ? "bg-accent" : ""}
          >
            <Link to="/settings">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};