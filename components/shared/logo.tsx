import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'light';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-14 w-14',
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
};

export function Logo({ className, showText = true, size = 'md', variant = 'default' }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn('flex items-center gap-2.5 transition-opacity hover:opacity-85', className)}
    >
      {/* Shaolin Temple Icon */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-xl border border-accent/30 bg-primary',
          sizeClasses[size]
        )}
      >
        {/* Gold top accent line */}
        <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-xl bg-gradient-to-r from-transparent via-accent to-transparent" />

        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-[58%] w-[58%] text-accent"
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
          <span
            className={cn(
              'font-bold leading-none',
              textSizeClasses[size],
              variant === 'light' ? 'text-white' : 'text-primary'
            )}
          >
            Shaolin Si Sénégal
          </span>
          <span
            className={cn(
              'text-[0.65rem] font-medium tracking-wide',
              size === 'lg' && 'text-xs',
              variant === 'light' ? 'text-accent/80' : 'text-accent'
            )}
          >
            ADSS · 少林寺
          </span>
        </div>
      )}
    </Link>
  );
}
