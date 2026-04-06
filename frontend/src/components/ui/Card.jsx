import { cn } from '../../utils/cn';

export function Card({ children, className, hover = false, glass = false }) {
  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden',
        'bg-white shadow-card',
        'border border-slate-200/60',
        hover && 'card-hover cursor-pointer',
        glass && 'glass',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={cn('px-6 py-4 border-b border-slate-100', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={cn('text-lg font-semibold text-slate-900', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }) {
  return (
    <p className={cn('text-sm text-slate-500 mt-1', className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className }) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }) {
  return (
    <div className={cn('px-6 py-4 border-t border-slate-100 bg-slate-50/50', className)}>
      {children}
    </div>
  );
}
