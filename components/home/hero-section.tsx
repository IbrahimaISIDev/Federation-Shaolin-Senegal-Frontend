'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-primary">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />

      <div className="container relative mx-auto flex min-h-[90vh] flex-col items-center justify-center px-4 py-20 lg:flex-row lg:gap-12 lg:py-0">
        {/* Text Content */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="visible"
          className="flex-1 text-center lg:text-left"
        >
          <motion.div variants={FADE_IN_UP} className="mb-4">
            <span className="inline-block rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent">
              Arts martiaux traditionnels chinois
            </span>
          </motion.div>

          <motion.h1
            variants={FADE_IN_UP}
            className="mb-6 font-serif text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl"
          >
            <span className="text-balance">
              Bienvenue à la{' '}
              <span className="text-accent">Fédération Shaolin</span> du Sénégal
            </span>
          </motion.h1>

          <motion.p
            variants={FADE_IN_UP}
            className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-primary-foreground/80 lg:mx-0"
          >
            Découvrez l&apos;art millénaire du Kung Fu Shaolin. Rejoignez notre 
            communauté de pratiquants passionnés à travers tout le Sénégal.
          </motion.p>

          <motion.div
            variants={FADE_IN_UP}
            className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
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
              <Link href="/carte">
                Trouver un club
              </Link>
            </Button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={FADE_IN_UP}
            className="mt-12 flex items-center justify-center gap-8 border-t border-primary-foreground/20 pt-8 lg:justify-start"
          >
            {[
              { value: '2,500+', label: 'Membres actifs' },
              { value: '45+', label: 'Clubs affiliés' },
              { value: '14', label: 'Régions' },
            ].map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <div className="text-2xl font-bold text-accent md:text-3xl">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Image/Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative mt-12 flex-1 lg:mt-0"
        >
          <div className="relative mx-auto aspect-square max-w-md lg:max-w-lg">
            {/* Decorative circles */}
            <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -bottom-4 -right-4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
            
            {/* Main Image Container */}
            <div className="relative z-10 overflow-hidden rounded-2xl border-4 border-accent/30 bg-primary-foreground/5 shadow-2xl">
              <div className="aspect-square bg-gradient-to-br from-accent/20 to-primary/50 p-8">
                {/* Shaolin Symbol */}
                <svg
                  viewBox="0 0 200 200"
                  className="h-full w-full text-primary-foreground/20"
                >
                  {/* Yin Yang inspired martial arts symbol */}
                  <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="3" />
                  <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="1" />
                  
                  {/* Dragon path simplified */}
                  <path
                    d="M100 20 L100 40 M100 160 L100 180 M20 100 L40 100 M160 100 L180 100"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M40 40 L55 55 M145 145 L160 160 M160 40 L145 55 M40 160 L55 145"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  
                  {/* Central lotus/temple */}
                  <path
                    d="M100 60 L80 100 L100 85 L120 100 Z"
                    fill="currentColor"
                    opacity="0.5"
                  />
                  <path
                    d="M70 100 L100 140 L130 100 L100 120 Z"
                    fill="currentColor"
                    opacity="0.3"
                  />
                </svg>

                {/* Overlay text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-serif text-6xl font-bold text-accent opacity-80">
                      少林
                    </div>
                    <div className="mt-2 text-sm uppercase tracking-widest text-primary-foreground/60">
                      Shaolin
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-4 -left-4 z-20 rounded-xl bg-card p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <Play className="h-5 w-5 text-accent" fill="currentColor" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Découvrir le Shaolin
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Vidéo de présentation
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-primary-foreground/30 p-1"
        >
          <div className="h-2 w-1 rounded-full bg-accent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
