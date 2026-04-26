import Link from 'next/link';
import Image from 'next/image';
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
      {/* Logo officiel ADSS */}
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border border-accent/30',
          sizeClasses[size]
        )}
      >
        <Image
          src="/images/logo-adss.jpeg"
          alt="Logo ADSS"
          fill
          className="object-cover"
          sizes="56px"
        />
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
