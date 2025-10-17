import { Github } from 'lucide-react';
import { BRAND_NAME, BRAND_DOMAIN, BRAND_TAGLINE } from '../../lib/brand';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="text-sm text-slate-600 mb-2">
              © {currentYear} {BRAND_NAME}. Built by{' '}
              <a
                href={`https://${BRAND_DOMAIN}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600 transition-colors duration-300"
              >
                {BRAND_DOMAIN}
              </a>
            </div>
            <div className="text-sm text-slate-500 italic">{BRAND_TAGLINE}</div>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-primary-500 transition-colors duration-300 flex items-center gap-2"
            >
              <Github className="h-5 w-5" />
              <span className="text-sm">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
