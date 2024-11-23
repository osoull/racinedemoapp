import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-16">
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="Logo" className="h-10" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;