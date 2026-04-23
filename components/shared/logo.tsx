import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
};

const textSizeClasses = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
};

export function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn('flex items-center gap-2 transition-opacity hover:opacity-80', className)}
    >
      {/* Shaolin Temple Icon */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-lg bg-primary',
          sizeClasses[size]
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-2/3 w-2/3 text-primary-foreground"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Pagoda/Temple shape */}
          <path d="M12 2L3 7h18L12 2z" fill="currentColor" />
          <path d="M5 7v3h14V7" />
          <path d="M12 7L4 11h16L12 7z" fill="currentColor" />
          <path d="M6 11v3h12v-3" />
          <path d="M12 11L5 15h14L12 11z" fill="currentColor" />
          <path d="M7 15v7h10v-7" />
          <path d="M10 18h4v4h-4z" />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={cn('font-bold text-primary', textSizeClasses[size])}>
            Fédération Shaolin
          </span>
          <span className={cn('text-xs font-medium text-muted-foreground', size === 'lg' && 'text-sm')}>
            Sénégal
          </span>
        </div>
      )}
    </Link>
  );
}
