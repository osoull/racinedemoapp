import { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthDialog from "./auth/AuthDialog";

const Header = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold sm:inline-block">رسين للاستثمار</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Button variant="outline" onClick={() => setShowAuthDialog(true)}>
            تسجيل الدخول
          </Button>
          <AuthDialog 
            isOpen={showAuthDialog} 
            onClose={() => setShowAuthDialog(false)} 
          />
        </div>
      </div>
    </header>
  );
};

export default Header;