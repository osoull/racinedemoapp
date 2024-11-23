import { useEffect, useState } from "react";

const Footer = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // Update year when component mounts
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-background text-primary py-4 text-center border-t">
      <p className="text-primary/80">
        جميع الحقوق محفوظة لشركة رسين للأستثمار© {year}
      </p>
    </footer>
  );
};

export default Footer;