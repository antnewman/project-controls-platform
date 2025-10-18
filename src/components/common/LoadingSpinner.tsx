import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner(props: LoadingSpinnerProps) {
  const { size = 'md', text, className } = props;

  const sizeStyles = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  // Check if text prop was explicitly provided
  const hasTextProp = 'text' in props;
  const shouldShowText = hasTextProp ? (text !== undefined && text !== '') : true;
  const displayText = text || 'Taking our time to get this right...';

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-primary-500', sizeStyles[size])} />
      {shouldShowText && <p className="text-sm text-slate-600">{displayText}</p>}
    </div>
  );
}
