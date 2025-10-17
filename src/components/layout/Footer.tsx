import { BRAND_NAME, BRAND_DOMAIN, BRAND_TAGLINE } from '../../lib/brand';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="text-sm text-slate-600">
            Built by{' '}
            <a
              href={`https://${BRAND_DOMAIN}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-600 transition-colors font-medium"
            >
              {BRAND_NAME}
            </a>
          </div>
          <div className="text-sm text-slate-500">
            © {currentYear} {BRAND_NAME}. {BRAND_TAGLINE}
          </div>
        </div>
      </div>
    </footer>
  );
}
