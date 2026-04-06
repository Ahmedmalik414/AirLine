import { cn } from '../../utils/cn';

const variantStyles = {
  primary: 'bg-primary-100 text-primary-800 border-primary-200',
  secondary: 'bg-secondary-100 text-secondary-800 border-secondary-200',
  accent: 'bg-accent-100 text-accent-800 border-accent-200',
  success: 'bg-success-100 text-success-800 border-success-200',
  danger: 'bg-danger-100 text-danger-800 border-danger-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  info: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  slate: 'bg-slate-100 text-slate-800 border-slate-200',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className,
  rounded = false,
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border',
        rounded ? 'rounded-full' : 'rounded-md',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
