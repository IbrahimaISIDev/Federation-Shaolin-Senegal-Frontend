'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

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
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 50m-40 0a40,40 0 1,0 80,0a40,40 0 1,0 -80,0' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M50 50m-25 0a25,25 0 1,0 50,0a25,25 0 1,0 -50,0' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M50 50m-10 0a10,10 0 1,0 20,0a10,10 0 1,0 -20,0' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
          }}
        />
      </div>

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
              className="mb-4 inline-block rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent"
            >
              Rejoignez-nous
            </motion.span>
            
            <motion.h2
              variants={FADE_IN_UP}
              className="mb-6 font-serif text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl"
            >
              <span className="text-balance">
                Prêt à commencer votre voyage dans les arts martiaux?
              </span>
            </motion.h2>
            
            <motion.p
              variants={FADE_IN_UP}
              className="mb-10 text-lg text-primary-foreground/80"
            >
              Affiliez-vous dès maintenant et rejoignez la grande famille du Shaolin au Sénégal.
            </motion.p>

            {/* Benefits Grid */}
            <motion.div
              variants={FADE_IN_UP}
              className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-2 rounded-lg bg-primary-foreground/10 px-4 py-3"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                  <span className="text-sm font-medium text-primary-foreground">
                    {benefit}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={FADE_IN_UP}
              className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Button
                asChild
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
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
                className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
              >
                <Link href="/contact">
                  Nous contacter
                </Link>
              </Button>
            </motion.div>

            {/* Pricing info */}
            <motion.p
              variants={FADE_IN_UP}
              className="mt-6 text-sm text-primary-foreground/60"
            >
              Licence annuelle à partir de 10 000 FCFA · Paiement sécurisé via Wave, Orange Money ou carte
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
