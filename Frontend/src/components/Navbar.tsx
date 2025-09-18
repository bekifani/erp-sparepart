import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  X,
  Settings,
  User,
  Bell,
  Package
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import LanguageSelector from './LanguageSelector';
import komipartsLogo from '@/assets/komiparts-logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { getTotalItems } = useCart();

  const totalItems = getTotalItems();

  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to catalog with search query
      window.location.href = `/catalog?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={komipartsLogo} 
              alt="Komiparts Logo" 
              className="h-8 w-auto"
            />
            <span className="font-bold text-xl">Komiparts</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-foreground/60'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/catalog" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/catalog') ? 'text-primary' : 'text-foreground/60'
              }`}
            >
              Catalog
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/about') ? 'text-primary' : 'text-foreground/60'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/contact') ? 'text-primary' : 'text-foreground/60'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch} className="flex w-full">
              <Input
                type="text"
                placeholder="Search products, codes, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none border-r-0"
              />
              <Button 
                type="submit" 
                variant="outline"
                size="icon"
                className="rounded-l-none border-l-0 hover:bg-primary hover:text-primary-foreground"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Notifications */}
            <Link to="/notifications">
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
            </Link>

            {/* Orders */}
            <Link to="/my-orders">
              <Button variant="outline" size="sm">
                <Package className="h-4 w-4" />
              </Button>
            </Link>
            {/* Cart */}
            <Link to="/cart">
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            <Link to="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-r-none border-r-0"
                />
                <Button 
                  type="submit" 
                  variant="outline"
                  size="icon"
                  className="rounded-l-none border-l-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/" 
                  className={`text-sm font-medium p-2 rounded-md transition-colors ${
                    isActive('/') ? 'bg-primary/10 text-primary' : 'text-foreground/60 hover:text-primary hover:bg-muted'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/catalog" 
                  className={`text-sm font-medium p-2 rounded-md transition-colors ${
                    isActive('/catalog') ? 'bg-primary/10 text-primary' : 'text-foreground/60 hover:text-primary hover:bg-muted'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Catalog
                </Link>
                <Link 
                  to="/my-orders" 
                  className={`text-sm font-medium p-2 rounded-md transition-colors ${
                    isActive('/my-orders') ? 'bg-primary/10 text-primary' : 'text-foreground/60 hover:text-primary hover:bg-muted'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link 
                  to="/notifications" 
                  className={`text-sm font-medium p-2 rounded-md transition-colors ${
                    isActive('/notifications') ? 'bg-primary/10 text-primary' : 'text-foreground/60 hover:text-primary hover:bg-muted'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Notifications
                </Link>
                <Link 
                  to="/profile" 
                  className={`text-sm font-medium p-2 rounded-md transition-colors ${
                    isActive('/profile') ? 'bg-primary/10 text-primary' : 'text-foreground/60 hover:text-primary hover:bg-muted'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link 
                  to="/about" 
                  className={`text-sm font-medium p-2 rounded-md transition-colors ${
                    isActive('/about') ? 'bg-primary/10 text-primary' : 'text-foreground/60 hover:text-primary hover:bg-muted'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className={`text-sm font-medium p-2 rounded-md transition-colors ${
                    isActive('/contact') ? 'bg-primary/10 text-primary' : 'text-foreground/60 hover:text-primary hover:bg-muted'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;