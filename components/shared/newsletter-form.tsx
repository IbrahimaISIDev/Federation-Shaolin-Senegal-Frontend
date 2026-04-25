'use client';

import { ArrowRight } from 'lucide-react';

export function NewsletterForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center gap-2">
      <input
        type="email"
        placeholder="Votre adresse email"
        className="flex-1 rounded-lg border border-white/15 bg-white/8 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-colors"
      />
      <button
        type="submit"
        className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
      >
        S&apos;inscrire
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
