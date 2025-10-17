import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { BRAND_NAME } from '../../lib/brand';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Risk Analysis', href: '/risk-analysis' },
    { name: 'WBS Generator', href: '/wbs-generator' },
    { name: 'Integrated Workflow', href: '/integrated' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary-500" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-700">
                Project Controls AI
              </span>
              <span className="text-xs text-slate-500">by {BRAND_NAME}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300',
                  isActive(item.href)
                    ? 'text-primary-500 bg-primary-50'
                    : 'text-slate-600 hover:text-primary-500 hover:bg-slate-50'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-slate-700" />
            ) : (
              <Menu className="h-6 w-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300',
                  isActive(item.href)
                    ? 'text-primary-500 bg-primary-50'
                    : 'text-slate-600 hover:text-primary-500 hover:bg-slate-50'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
