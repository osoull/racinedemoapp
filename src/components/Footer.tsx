import { useEffect, useState } from "react";

const Footer = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4">
        <div className="py-4 flex flex-col items-center justify-center">
          <p className="text-primary/80 font-medium text-base">
            جميع الحقوق محفوظة لشركة رسين للأستثمار© {year}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;