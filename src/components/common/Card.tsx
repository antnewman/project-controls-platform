import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export default function Card({ children, className, header, footer }: CardProps) {
  return (
    <div className={cn('bg-white rounded-xl shadow-md', className)}>
      {header && (
        <div className="px-6 py-4 border-b border-slate-200">
          {header}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          {footer}
        </div>
      )}
    </div>
  );
}
