'use client';

import { motion } from 'framer-motion';
import { Users, Building2, Trophy, Award } from 'lucide-react';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

const stats = [
  {
    icon: Users,
    value: '1 000+',
    label: 'Adhérents',
    description: 'Membres à travers le pays',
    chineseChar: '人',
  },
  {
    icon: Building2,
    value: '3 000+',
    label: 'Participants aux stages',
    description: 'Dans toutes les régions et en Gambie',
    chineseChar: '功',
  },
  {
    icon: Trophy,
    value: '5',
    label: 'Médailles internationales',
    description: 'Monde 2021 & Afrique 2023',
    chineseChar: '賽',
  },
  {
    icon: Award,
    value: '3e Duan',
    label: 'Grade Shaolin',
    description: 'Obtenu au Temple Shaolin en Zambie',
    chineseChar: '金',
  },
];

export function StatsSection() {
  return (
    <section className="relative -mt-14 z-10 px-4">
      <motion.div
        variants={STAGGER_CONTAINER}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="container mx-auto"
      >
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-navy">
          {/* Top accent line */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary/50" />

          <div className="grid divide-y divide-border/50 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4 p-6 lg:p-10 gap-0">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={FADE_IN_UP}
                className="group relative flex flex-col items-center gap-3 p-6 text-center first:pt-0 last:pb-0 md:first:pt-6 md:last:pb-6"
              >
                {/* Chinese watermark */}
                <div className="pointer-events-none absolute right-3 top-3 font-serif text-5xl font-bold text-foreground/[0.03] select-none">
                  {stat.chineseChar}
                </div>

                {/* Icon */}
                <div className="inline-flex h-13 w-13 items-center justify-center rounded-xl bg-accent/8 text-accent ring-1 ring-accent/15 transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:ring-accent">
                  <stat.icon className="h-6 w-6" />
                </div>

                {/* Value */}
                <div className="text-3xl font-bold text-foreground lg:text-4xl">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="font-semibold text-foreground/80">{stat.label}</div>

                {/* Description */}
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
