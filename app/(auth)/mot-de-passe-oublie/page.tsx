'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/lib/api/auth';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setSent(true);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
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
          <h1 className="text-2xl font-bold">Email envoyé !</h1>
          <p className="mt-2 text-muted-foreground">
            Si <strong>{email}</strong> est associé à un compte, vous recevrez un lien de réinitialisation dans quelques minutes.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Vérifiez également votre dossier spam.
          </p>
        </motion.div>
        <motion.div variants={FADE_IN_UP}>
          <Button asChild variant="outline" className="w-full">
            <Link href="/connexion">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la connexion
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={FADE_IN_UP} className="mb-8">
        <Link
          href="/connexion"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la connexion
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Mot de passe oublié</h1>
        <p className="mt-1 text-muted-foreground">
          Saisissez votre adresse email pour recevoir un lien de réinitialisation.
        </p>
      </motion.div>

      <motion.form variants={FADE_IN_UP} onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Adresse email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          disabled={isLoading || !email}
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" />Envoi en cours...</>
          ) : (
            'Envoyer le lien de réinitialisation'
          )}
        </Button>
      </motion.form>
    </motion.div>
  );
}
