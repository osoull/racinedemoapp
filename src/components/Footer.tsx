import { useEffect, useState } from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Button } from "./ui/button";

const Footer = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4">
        <div className="py-4 flex items-center">
          {/* Social Icons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary/80 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-primary/80 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-primary/80 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-primary/80 hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
          </div>

          {/* Copyright Text */}
          <p className="text-primary/80 font-medium text-base flex-1 text-center">
            جميع الحقوق محفوظة لشركة رسين للأستثمار© {year}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;