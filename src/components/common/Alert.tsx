import { useState } from 'react';
import type { ReactNode } from 'react';
import React from 'react';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import type { AlertType } from '../../lib/types';
import { cn } from '../../lib/utils';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AlertType;
  children: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export default function Alert({
  type = 'info',
  children,
  dismissible = false,
  onDismiss,
  className,
  ...props
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  if (!visible) return null;

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-primary-50 border-primary-200 text-primary-800',
  };

  return (
    <div {...props} className={cn('border rounded-lg p-4 flex items-start gap-3 transition-all duration-300', styles[type], className)}>
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1">{children}</div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 hover:opacity-70 transition-opacity duration-300"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
