'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FADE_IN_UP, STAGGER_CONTAINER, LICENSE_FEES } from '@/lib/constants';

const benefits = [
  'Licence officielle reconnue',
  'Accès à tous les clubs affiliés',
  'Participation aux compétitions',
  'Assurance sportive incluse',
  'Formation continue',
  'Réseau de pratiquants',
];

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-primary py-20 lg:py-28">
      {/* Geometric pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.8'%3E%3Ccircle cx='60' cy='60' r='50'/%3E%3Ccircle cx='60' cy='60' r='35'/%3E%3Ccircle cx='60' cy='60' r='15'/%3E%3Cline x1='60' y1='10' x2='60' y2='110'/%3E%3Cline x1='10' y1='60' x2='110' y2='60'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px',
        }}
      />

      {/* Glow accents */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-accent/10 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/8 blur-[80px]" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.span
              variants={FADE_IN_UP}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
            >
              <span className="font-serif text-base">加入</span>
              Rejoignez-nous
            </motion.span>

            <motion.h2
              variants={FADE_IN_UP}
              className="mb-4 font-serif text-3xl font-bold text-white md:text-4xl lg:text-5xl"
            >
              <span className="text-balance">
                Prêt à commencer votre voyage avec shaolin si Sénégal
              </span>
            </motion.h2>

            <motion.div variants={FADE_IN_UP} className="mb-6 flex justify-center">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
            </motion.div>

            <motion.p
              variants={FADE_IN_UP}
              className="mb-10 text-base text-white/65 lg:text-lg"
            >
              Affiliez-vous dès maintenant et rejoignez la grande famille du Shaolin au Sénégal.
            </motion.p>

            {/* Benefits Grid */}
            <motion.div
              variants={FADE_IN_UP}
              className="mb-10 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2.5 rounded-lg border border-white/8 bg-white/5 px-4 py-3 text-left"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                  <span className="text-sm font-medium text-white/85">{benefit}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={FADE_IN_UP}
              className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            >
              <Button
                asChild
                size="lg"
                className="w-full bg-accent font-semibold text-accent-foreground shadow-gold hover:bg-accent/90 sm:w-auto"
              >
                <Link href="/affiliation">
                  S&apos;affilier maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-white/20 bg-white/5 text-white backdrop-blur-sm hover:border-white/30 hover:bg-white/10 sm:w-auto"
              >
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </motion.div>

            {/* Pricing info */}
            <motion.p
              variants={FADE_IN_UP}
              className="mt-6 text-xs text-white/40"
            >
              Licence annuelle à partir de <span className="text-accent">{LICENSE_FEES.RENEWAL.toLocaleString('fr-FR')} FCFA</span> · Paiement sécurisé via Wave, Orange Money ou carte
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
