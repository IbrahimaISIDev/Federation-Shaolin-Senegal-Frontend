'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FADE_IN_UP, STAGGER_CONTAINER, BUREAU_MEMBERS } from '@/lib/constants';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const topMembers = BUREAU_MEMBERS.filter((m) => m.tier !== 'commission');

export function BureauSection() {
  return (
    <section className="relative py-20 lg:py-28">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/20 via-transparent to-transparent" />

      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <motion.span
            variants={FADE_IN_UP}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/8 px-4 py-1.5 text-sm font-medium text-accent"
          >
            <Shield className="h-3.5 w-3.5" />
            Gouvernance
          </motion.span>
          <motion.h2
            variants={FADE_IN_UP}
            className="mb-4 font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl"
          >
            Bureau de l&apos;Association
          </motion.h2>
          <motion.div variants={FADE_IN_UP} className="mb-5 flex justify-center">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </motion.div>
          <motion.p
            variants={FADE_IN_UP}
            className="mx-auto max-w-xl text-base text-muted-foreground"
          >
            Le bureau directeur de l&apos;ADSS, élu pour diriger
            et développer les arts martiaux chinois à travers le pays.
          </motion.p>
        </motion.div>

        {/* Président & Vice-président — highlighted */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-6"
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:mx-auto lg:max-w-2xl">
            {topMembers
              .filter((m) => m.tier === 'presidency')
              .map((member) => (
                <motion.div key={member.id} variants={FADE_IN_UP}>
                  <div className="group relative overflow-hidden rounded-2xl border border-accent/20 bg-primary p-6 text-center shadow-navy transition-shadow hover:shadow-gold">
                    {/* Gold top accent */}
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />
                    {/* Background glow */}
                    <div className="pointer-events-none absolute -top-8 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-accent/10 blur-2xl" />

                    {/* Avatar */}
                    <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-accent/40 bg-accent/10" />
                      <div className="absolute inset-1 rounded-full border border-accent/20" />
                      <span className="relative z-10 font-serif text-2xl font-bold text-accent">
                        {getInitials(member.name)}
                      </span>
                    </div>

                    {/* Star for president */}
                    {member.id === 'president' && (
                      <div className="mb-2 flex justify-center">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                      </div>
                    )}

                    <div className="text-lg font-bold text-white">{member.name}</div>
                    <div className="mt-1 text-sm font-medium text-accent">{member.role}</div>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Executive members — 3 cards */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {topMembers
              .filter((m) => m.tier === 'executive')
              .map((member) => (
                <motion.div key={member.id} variants={FADE_IN_UP}>
                  <div className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md">
                    {/* Avatar */}
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                      <div className="absolute inset-0 rounded-xl border border-primary/10" />
                      <span className="relative font-serif text-lg font-bold text-primary">
                        {getInitials(member.name)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-foreground">{member.name}</div>
                      <div className="mt-0.5 truncate text-xs font-medium text-muted-foreground">
                        {member.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* CTA — voir bureau complet */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button asChild variant="outline" size="lg" className="border-primary/20 hover:border-accent/40 hover:text-accent">
            <Link href="/federation">
              Voir le bureau complet
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
