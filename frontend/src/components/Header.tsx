import { Music } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-secondary shadow-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2 text-primary-foreground">
          <div className="rounded-full bg-primary p-2">
            <Music className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">Genre Classifier</span>
        </Link>
        
        <nav className="flex gap-2">
          <Link
            to="/predict"
            className={cn(
              "rounded-full px-6 py-2 font-medium transition-all",
              location.pathname === "/predict"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            Predict
          </Link>
          <Link
            to="/train"
            className={cn(
              "rounded-full px-6 py-2 font-medium transition-all",
              location.pathname === "/train"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            Train
          </Link>
          <Link
            to="/record"
            className={cn(
              "rounded-full px-6 py-2 font-medium transition-all",
              location.pathname === "/record"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            Record
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
