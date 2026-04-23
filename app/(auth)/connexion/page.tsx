'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '@/lib/store/auth-store';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Mock login - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Mock successful login
      const mockUser = {
        id: '1',
        email: formData.email,
        firstName: 'Mamadou',
        lastName: 'Diallo',
        role: 'MEMBRE' as const,
        licenseNumber: 'FSS-DK-001234',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      login(mockUser, 'mock-access-token');
      router.push('/membre');
    } catch {
      setError('Email ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={FADE_IN_UP} className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          Connexion
        </h1>
        <p className="text-muted-foreground">
          Accédez à votre espace membre
        </p>
      </motion.div>

      <motion.form
        variants={FADE_IN_UP}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Adresse email</Label>
          <Input
            id="email"
            type="email"
            placeholder="exemple@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <Link
              href="/mot-de-passe-oublie"
              className="text-sm text-primary hover:underline"
            >
              Mot de passe oublié?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={isLoading}
              autoComplete="current-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            checked={formData.rememberMe}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, rememberMe: checked === true })
            }
            disabled={isLoading}
          />
          <Label htmlFor="rememberMe" className="text-sm font-normal">
            Se souvenir de moi
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connexion en cours...
            </>
          ) : (
            'Se connecter'
          )}
        </Button>
      </motion.form>

      <motion.div variants={FADE_IN_UP} className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Pas encore membre?{' '}
          <Link href="/affiliation" className="font-medium text-primary hover:underline">
            S&apos;affilier maintenant
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
