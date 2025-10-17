import { Link } from 'react-router-dom';
import { BRAND_NAME } from '../../lib/brand';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { path: '/', label: 'Home' },
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/integrated', label: 'Integrated Workflow' },
    ],
    tools: [
      { path: '/risk-analysis', label: 'Risk Analysis' },
      { path: '/wbs-generator', label: 'WBS Generator' },
    ],
  };

  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4 group">
              <img
                src="/images/tortoiseai-logo.png"
                alt="TortoiseAI Logo"
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold">{BRAND_NAME}</span>
            </Link>
            <p className="text-white/80 max-w-md leading-relaxed">
              AI-powered project controls platform for intelligent risk analysis and work breakdown structure management.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/80 hover:text-primary-500 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Tools</h3>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/80 hover:text-primary-500 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/60 text-sm">
              &copy; {currentYear} {BRAND_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
