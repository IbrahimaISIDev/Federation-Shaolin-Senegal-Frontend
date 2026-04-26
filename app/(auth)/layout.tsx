import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/shared/logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Decorative */}
      <div className="relative hidden w-1/2 bg-primary lg:block">
        {/* Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative flex h-full flex-col justify-between p-12">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-accent/30">
                <Image
                  src="/images/logo-adss.jpeg"
                  alt="Logo ADSS"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-primary-foreground">Disciples Shaolin Si Sénégal</span>
                <span className="text-sm text-accent/80">ADSS · 少林寺</span>
              </div>
            </Link>
          </div>

          <div className="max-w-md">
            <blockquote className="text-xl font-medium italic text-primary-foreground/90">
              &ldquo;Le voyage de mille lieues commence par un premier pas.&rdquo;
            </blockquote>
            <p className="mt-4 text-primary-foreground/60">
              — Lao Tseu
            </p>
          </div>

          <div className="text-sm text-primary-foreground/50">
            &copy; {new Date().getFullYear()} Association Disciples Shaolin Si Sénégal
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full flex-col lg:w-1/2">
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-border p-4 lg:hidden">
          <Logo size="sm" />
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Retour au site
          </Link>
        </div>

        {/* Desktop Back Link */}
        <div className="hidden justify-end p-6 lg:flex">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Retour au site
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
