'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, KeyRound, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/lib/api/auth';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

function ResetPasswordForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const token        = searchParams.get('token') ?? '';

  const [password, setPassword]         = useState('');
  const [confirm, setConfirm]           = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [done, setDone]                 = useState(false);
  const [error, setError]               = useState('');

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7 text-destructive" />
        </div>
        <h1 className="text-xl font-bold">Lien invalide</h1>
        <p className="text-muted-foreground text-sm">Ce lien de réinitialisation est invalide ou a expiré.</p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/mot-de-passe-oublie">Demander un nouveau lien</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setIsLoading(true);
    try {
      await authApi.resetPassword({ token, password });
      setDone(true);
      setTimeout(() => router.push('/connexion'), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Lien invalide ou expiré. Demandez un nouveau lien.');
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <motion.div
        variants={STAGGER_CONTAINER}
        initial="hidden"
        animate="visible"
        className="text-center space-y-6"
      >
        <motion.div variants={FADE_IN_UP} className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
        </motion.div>
        <motion.div variants={FADE_IN_UP}>
          <h1 className="text-2xl font-bold">Mot de passe réinitialisé !</h1>
          <p className="mt-2 text-muted-foreground">
            Vous allez être redirigé vers la page de connexion dans 3 secondes...
          </p>
        </motion.div>
        <motion.div variants={FADE_IN_UP}>
          <Button asChild className="w-full bg-accent hover:bg-accent/90">
            <Link href="/connexion">Se connecter maintenant</Link>
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={STAGGER_CONTAINER} initial="hidden" animate="visible">
      <motion.div variants={FADE_IN_UP} className="mb-8 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Nouveau mot de passe</h1>
        <p className="mt-1 text-muted-foreground">Choisissez un mot de passe sécurisé.</p>
      </motion.div>

      <motion.form variants={FADE_IN_UP} onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">Nouveau mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 8 caractères"
              className="pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirmer le mot de passe</Label>
          <Input
            id="confirm"
            type="password"
            placeholder="Répétez le mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            disabled={isLoading}
          />
          {confirm && password !== confirm && (
            <p className="text-xs text-destructive">Les mots de passe ne correspondent pas.</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          disabled={isLoading || !password || !confirm}
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" />Réinitialisation...</>
          ) : (
            'Réinitialiser le mot de passe'
          )}
        </Button>
      </motion.form>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
