'use client';

import { motion } from 'framer-motion';
import { Swords, Wind, Sparkles, Shield, Target, Flame } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

const disciplines = [
  {
    icon: Swords,
    name: 'Kung Fu Shaolin',
    description: 'L\'art martial traditionnel du temple Shaolin, combinant force, souplesse et techniques de combat.',
  },
  {
    icon: Wind,
    name: 'Wushu',
    description: 'Art martial moderne chinois avec des formes acrobatiques spectaculaires et des techniques de combat.',
  },
  {
    icon: Sparkles,
    name: 'Tai Chi Chuan',
    description: 'Art martial interne axé sur la méditation en mouvement, l\'équilibre et la circulation de l\'énergie.',
  },
  {
    icon: Target,
    name: 'Qi Gong',
    description: 'Pratique énergétique millénaire pour développer la force interne et améliorer la santé.',
  },
  {
    icon: Shield,
    name: 'Sanda',
    description: 'Boxe chinoise de combat avec des techniques de frappe, projection et balayage.',
  },
  {
    icon: Flame,
    name: 'Wing Chun',
    description: 'Style de kung fu efficace et direct, idéal pour le combat rapproché et l\'auto-défense.',
  },
];

export function DisciplinesSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <motion.span
            variants={FADE_IN_UP}
            className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
          >
            Nos disciplines
          </motion.span>
          <motion.h2
            variants={FADE_IN_UP}
            className="mb-4 font-serif text-3xl font-bold text-foreground md:text-4xl"
          >
            <span className="text-balance">Les arts martiaux que nous enseignons</span>
          </motion.h2>
          <motion.p
            variants={FADE_IN_UP}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
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
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {disciplines.map((discipline) => (
            <motion.div key={discipline.name} variants={FADE_IN_UP}>
              <Card className="group h-full border-2 border-transparent transition-all hover:border-accent/20 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    <discipline.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {discipline.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {discipline.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
