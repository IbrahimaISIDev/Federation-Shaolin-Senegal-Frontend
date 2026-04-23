'use client';

import { motion } from 'framer-motion';
import { Users, Building2, Trophy, Award } from 'lucide-react';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

const stats = [
  {
    icon: Users,
    value: '2,500+',
    label: 'Membres actifs',
    description: 'Pratiquants à travers le pays',
  },
  {
    icon: Building2,
    value: '45+',
    label: 'Clubs affiliés',
    description: 'Dans toutes les régions',
  },
  {
    icon: Trophy,
    value: '120+',
    label: 'Compétitions',
    description: 'Organisées chaque année',
  },
  {
    icon: Award,
    value: '50+',
    label: 'Médailles internationales',
    description: 'Remportées par nos athlètes',
  },
];

export function StatsSection() {
  return (
    <section className="relative -mt-16 z-10 px-4">
      <motion.div
        variants={STAGGER_CONTAINER}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="container mx-auto"
      >
        <div className="rounded-2xl bg-card p-8 shadow-xl lg:p-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={FADE_IN_UP}
                className="group relative text-center"
              >
                {/* Divider for desktop */}
                {index !== 0 && (
                  <div className="absolute left-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-border lg:block" />
                )}
                
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <stat.icon className="h-7 w-7" />
                </div>
                
                <div className="mb-1 text-3xl font-bold text-foreground lg:text-4xl">
                  {stat.value}
                </div>
                
                <div className="mb-1 font-semibold text-foreground">
                  {stat.label}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
