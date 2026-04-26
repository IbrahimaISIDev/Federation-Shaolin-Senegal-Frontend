'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Users, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

const floatingChars = [
  { char: '武', x: '10%', y: '15%', size: '5rem', delay: 0 },
  { char: '術', x: '85%', y: '10%', size: '4rem', delay: 0.4 },
  { char: '功', x: '75%', y: '70%', size: '6rem', delay: 0.8 },
  { char: '夫', x: '5%', y: '75%', size: '4.5rem', delay: 0.6 },
  { char: '禪', x: '50%', y: '85%', size: '3.5rem', delay: 1.0 },
  { char: '龍', x: '92%', y: '45%', size: '4rem', delay: 0.3 },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-primary">
      {/* Animated floating Chinese characters */}
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        {floatingChars.map((item, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.06, y: 0 }}
            transition={{ duration: 1.2, delay: item.delay, ease: 'easeOut' }}
            style={{ left: item.x, top: item.y, fontSize: item.size }}
            className="absolute font-serif font-bold text-white"
          >
            {item.char}
          </motion.span>
        ))}
      </div>

      {/* Geometric pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.8'%3E%3Crect x='10' y='10' width='60' height='60'/%3E%3Crect x='20' y='20' width='40' height='40'/%3E%3Cline x1='40' y1='0' x2='40' y2='80'/%3E%3Cline x1='0' y1='40' x2='80' y2='40'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Radial glow top-right */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full bg-accent/10 blur-[100px]" />
      {/* Radial glow bottom-left */}
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-accent/8 blur-[80px]" />

      <div className="container relative mx-auto flex min-h-[92vh] flex-col items-center justify-center px-4 py-20 lg:flex-row lg:gap-16 lg:py-0">
        {/* Text Content */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="visible"
          className="flex-1 text-center lg:text-left"
        >
          {/* Badge */}
          <motion.div variants={FADE_IN_UP} className="mb-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Reconnue par le Ministère de l&apos;Intérieur · NINEA · 少林寺
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={FADE_IN_UP}
            className="mb-6 font-serif text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl xl:text-7xl"
          >
            <span className="block text-balance">Disciples</span>
            <span className="block text-balance">
              <span className="text-accent">Shaolin Si</span>
            </span>
            <span className="block text-balance">Sénégal</span>
          </motion.h1>

          {/* Gold divider */}
          <motion.div variants={FADE_IN_UP} className="mb-6 flex justify-center lg:justify-start">
            <div className="h-px w-16 bg-gradient-to-r from-accent to-accent/30" />
          </motion.div>

          <motion.p
            variants={FADE_IN_UP}
            className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-white/70 lg:mx-0 lg:text-lg"
          >
            Association nationale dédiée à la promotion du Shaolin authentique,
            directement transmis par le Temple Shaolin de Chine au Sénégal depuis 1981.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={FADE_IN_UP}
            className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
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
              className="w-full border-white/20 bg-white/5 text-white backdrop-blur-sm hover:border-accent/50 hover:bg-white/10 sm:w-auto"
            >
              <Link href="/carte">
                <MapPin className="mr-2 h-4 w-4" />
                Trouver un club
              </Link>
            </Button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={FADE_IN_UP}
            className="mt-12 flex items-center justify-center gap-8 border-t border-white/10 pt-8 lg:justify-start"
          >
            {[
              { icon: Users, value: '1 000+', label: 'Adhérents' },
              { icon: Trophy, value: '5', label: 'Médailles internationales' },
              { icon: MapPin, value: '1981', label: 'Pratique au Sénégal' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 lg:items-start">
                <div className="flex items-baseline gap-1">
                  <stat.icon className="h-3.5 w-3.5 text-accent/70" />
                  <span className="text-xl font-bold text-accent md:text-2xl">
                    {stat.value}
                  </span>
                </div>
                <span className="text-xs text-white/50">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Visual Panel */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="relative mt-14 flex-shrink-0 lg:mt-0"
        >
          <div className="relative mx-auto h-[420px] w-[340px] lg:h-[520px] lg:w-[420px]">
            {/* Outer decorative ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-accent/15"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-4 rounded-full border border-white/8"
            />

            {/* Corner ornaments */}
            {[
              '-top-2 -left-2 rotate-0',
              '-top-2 -right-2 rotate-90',
              '-bottom-2 -right-2 rotate-180',
              '-bottom-2 -left-2 -rotate-90',
            ].map((pos, i) => (
              <div key={i} className={`absolute ${pos} h-6 w-6`}>
                <svg viewBox="0 0 24 24" className="h-full w-full text-accent/50">
                  <path d="M0 24 L0 0 L24 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            ))}

            {/* Main card — real photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute inset-8 overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
            >
              {/* Photo */}
              <Image
                src="/images/president/maitre-ngom.png"
                alt="Maître Ousmane Ngom, Président ADSS"
                fill
                className="object-contain object-bottom"
                priority
              />
              {/* Gradient pour fondre la silhouette en bas */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
              {/* Top accent bar */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
              {/* 少林 watermark */}
              <div className="pointer-events-none absolute right-3 top-3 select-none font-serif text-5xl font-bold text-white/10">
                少林
              </div>
              {/* Bottom info strip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="absolute inset-x-0 bottom-0 p-4"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-white/70">Maître Ousmane Ngom — ADSS</span>
                  <span className="font-semibold text-accent">Sénégal · 少林寺</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1"
        >
          <div className="h-2 w-0.5 rounded-full bg-accent/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
