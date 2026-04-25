'use client';

import { motion } from 'framer-motion';
import { Swords, Wind, Sparkles, Shield, Target, Flame } from 'lucide-react';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

const disciplines = [
  {
    icon: Swords,
    name: 'Kung Fu Shaolin',
    chineseChar: '少林',
    description: 'L\'art martial traditionnel du temple Shaolin, combinant force, souplesse et techniques de combat.',
    color: 'from-primary/10 to-primary/5',
    iconBg: 'bg-primary/10 group-hover:bg-primary',
    iconColor: 'text-primary group-hover:text-white',
    accentColor: 'text-primary',
    borderHover: 'hover:border-primary/30',
  },
  {
    icon: Wind,
    name: 'Wushu',
    chineseChar: '武術',
    description: 'Art martial moderne chinois avec des formes acrobatiques spectaculaires et des techniques de combat.',
    color: 'from-accent/10 to-accent/5',
    iconBg: 'bg-accent/10 group-hover:bg-accent',
    iconColor: 'text-accent group-hover:text-accent-foreground',
    accentColor: 'text-accent',
    borderHover: 'hover:border-accent/30',
  },
  {
    icon: Sparkles,
    name: 'Tai Chi Chuan',
    chineseChar: '太極',
    description: 'Art martial interne axé sur la méditation en mouvement, l\'équilibre et la circulation de l\'énergie.',
    color: 'from-primary/10 to-primary/5',
    iconBg: 'bg-primary/10 group-hover:bg-primary',
    iconColor: 'text-primary group-hover:text-white',
    accentColor: 'text-primary',
    borderHover: 'hover:border-primary/30',
  },
  {
    icon: Target,
    name: 'Qi Gong',
    chineseChar: '氣功',
    description: 'Pratique énergétique millénaire pour développer la force interne et améliorer la santé.',
    color: 'from-accent/10 to-accent/5',
    iconBg: 'bg-accent/10 group-hover:bg-accent',
    iconColor: 'text-accent group-hover:text-accent-foreground',
    accentColor: 'text-accent',
    borderHover: 'hover:border-accent/30',
  },
  {
    icon: Shield,
    name: 'Sanda',
    chineseChar: '散打',
    description: 'Boxe chinoise de combat avec des techniques de frappe, projection et balayage.',
    color: 'from-primary/10 to-primary/5',
    iconBg: 'bg-primary/10 group-hover:bg-primary',
    iconColor: 'text-primary group-hover:text-white',
    accentColor: 'text-primary',
    borderHover: 'hover:border-primary/30',
  },
  {
    icon: Flame,
    name: 'Wing Chun',
    chineseChar: '詠春',
    description: 'Style de kung fu efficace et direct, idéal pour le combat rapproché et l\'auto-défense.',
    color: 'from-accent/10 to-accent/5',
    iconBg: 'bg-accent/10 group-hover:bg-accent',
    iconColor: 'text-accent group-hover:text-accent-foreground',
    accentColor: 'text-accent',
    borderHover: 'hover:border-accent/30',
  },
];

export function DisciplinesSection() {
  return (
    <section className="relative py-20 lg:py-28">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />

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
            <span className="font-serif text-base">武術</span>
            Nos disciplines
          </motion.span>
          <motion.h2
            variants={FADE_IN_UP}
            className="mb-4 font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl"
          >
            <span className="text-balance">Les arts martiaux que nous enseignons</span>
          </motion.h2>
          <motion.div variants={FADE_IN_UP} className="mb-5 flex justify-center">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </motion.div>
          <motion.p
            variants={FADE_IN_UP}
            className="mx-auto max-w-2xl text-base text-muted-foreground lg:text-lg"
          >
            Découvrez la richesse des arts martiaux chinois à travers nos différentes disciplines,
            adaptées à tous les âges et niveaux.
          </motion.p>
        </motion.div>

        {/* Disciplines Grid */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {disciplines.map((discipline) => (
            <motion.div
              key={discipline.name}
              variants={FADE_IN_UP}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`group relative h-full overflow-hidden rounded-xl border border-border/60 bg-card p-6 transition-all duration-300 hover:shadow-navy ${discipline.borderHover}`}
              >
                {/* Chinese character watermark */}
                <div className="pointer-events-none absolute right-4 top-2 font-serif text-6xl font-bold text-foreground/[0.04] select-none">
                  {discipline.chineseChar}
                </div>

                {/* Top row */}
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${discipline.iconBg}`}
                  >
                    <discipline.icon className={`h-6 w-6 transition-colors duration-300 ${discipline.iconColor}`} />
                  </div>
                  <span className={`font-serif text-2xl font-bold opacity-30 transition-opacity duration-300 group-hover:opacity-60 ${discipline.accentColor}`}>
                    {discipline.chineseChar}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {discipline.name}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {discipline.description}
                </p>

                {/* Bottom accent line */}
                <div className={`absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r transition-transform duration-300 group-hover:scale-x-100 ${discipline.accentColor === 'text-accent' ? 'from-accent to-accent/30' : 'from-primary to-primary/30'}`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
