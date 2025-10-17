import { Link, useLocation } from 'react-router-dom';
import { Turtle, Menu, X } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Turtle className="h-8 w-8 text-primary-500" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-800">
                {BRAND_NAME}
              </span>
              <span className="text-xs text-slate-500 font-medium">Project Controls</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors duration-200',
                  isActive(item.href)
                    ? 'text-primary-500'
                    : 'text-slate-700 hover:text-primary-500'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
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
          <div className="md:hidden py-4 space-y-1 border-t border-slate-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-2 text-sm font-medium transition-colors duration-200',
                  isActive(item.href)
                    ? 'text-primary-500'
                    : 'text-slate-700 hover:text-primary-500'
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
