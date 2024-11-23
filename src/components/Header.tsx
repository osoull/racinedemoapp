import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="font-bold text-xl">
            Logo
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              الرئيسية
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              عن المنصة
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              اتصل بنا
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;