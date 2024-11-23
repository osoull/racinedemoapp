import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="رسين للاستثمار" className="h-8" />
          </Link>

          {/* Navigation */}
          <NavigationMenu>
            <NavigationMenuList className="hidden md:flex gap-6">
              <NavigationMenuItem>
                <NavigationMenuTrigger>عن رسين</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link className="block p-2 hover:bg-gray-50 rounded-md" to="/about">من نحن</Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link className="block p-2 hover:bg-gray-50 rounded-md" to="/team">فريق العمل</Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link className="block p-2 hover:bg-gray-50 rounded-md" to="/careers">الوظائف</Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>خدماتنا</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link className="block p-2 hover:bg-gray-50 rounded-md" to="/investment">الاستثمار</Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link className="block p-2 hover:bg-gray-50 rounded-md" to="/funding">التمويل</Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/projects" className="block py-2">المشاريع</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/blog" className="block py-2">المدونة</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/contact" className="block py-2">اتصل بنا</Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Button variant="outline">تسجيل الدخول</Button>
            <Button>إنشاء حساب</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;