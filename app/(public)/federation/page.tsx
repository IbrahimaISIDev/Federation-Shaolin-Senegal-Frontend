'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Star, Shield, Users, Settings, Medal, CalendarDays, CheckCircle2, Building,
  GraduationCap, Trophy, Globe, MapPin, Sparkles, Target,
} from 'lucide-react';
import { BUREAU_MEMBERS, ADSS_HISTORY, FADE_IN_UP, STAGGER_CONTAINER } from '@/lib/constants';
import type { BureauMember, HistoryEvent } from '@/lib/constants';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

// ─── Card variants ────────────────────────────────────────────────────────────

function PresidencyCard({ member }: { member: BureauMember }) {
  return (
    <motion.div variants={FADE_IN_UP}>
      <div className="group relative overflow-hidden rounded-2xl border border-accent/25 bg-primary p-8 text-center shadow-navy transition-all hover:shadow-gold">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />
        <div className="pointer-events-none absolute -top-10 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-accent/8 blur-3xl" />
        <div className="relative mx-auto mb-5 h-40 w-32 overflow-hidden">
          {member.id === 'president' ? (
            <Image
              src="/images/president/maitre-ngom.png"
              alt="Maître Ousmane Ngom, Président ADSS"
              fill
              className="object-contain object-bottom drop-shadow-lg"
              priority
            />
          ) : (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-accent/50 bg-accent/10" />
              <div className="absolute inset-2 rounded-full border border-accent/20" />
              <div className="flex h-full w-full items-center justify-center">
                <span className="relative z-10 font-serif text-3xl font-bold text-accent">{getInitials(member.name)}</span>
              </div>
            </>
          )}
        </div>
        {member.id === 'president' && (
          <div className="mb-3 flex justify-center gap-1">
            {[...Array(3)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />)}
          </div>
        )}
        <div className="text-xl font-bold text-white">{member.name}</div>
        <div className="mt-2 inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-0.5 text-sm font-semibold text-accent">
          {member.role}
        </div>
      </div>
    </motion.div>
  );
}

function ExecutiveCard({ member }: { member: BureauMember }) {
  return (
    <motion.div variants={FADE_IN_UP}>
      <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/8 ring-1 ring-primary/10">
          <span className="font-serif text-xl font-bold text-primary">{getInitials(member.name)}</span>
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-foreground">{member.name}</div>
          <div className="mt-0.5 text-sm text-muted-foreground">{member.role}</div>
        </div>
      </div>
    </motion.div>
  );
}

function CommissionCard({ member }: { member: BureauMember }) {
  const isPresident = member.role === 'Président';
  return (
    <motion.div variants={FADE_IN_UP}>
      <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-accent/20 hover:shadow-sm">
        <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${isPresident ? 'bg-accent/10 ring-1 ring-accent/20' : 'bg-muted'}`}>
          <span className={`font-serif text-base font-bold ${isPresident ? 'text-accent' : 'text-muted-foreground'}`}>{getInitials(member.name)}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-foreground">{member.name}</div>
          <div className={`mt-0.5 text-xs font-medium ${isPresident ? 'text-accent' : 'text-muted-foreground'}`}>{member.role}</div>
        </div>
        {isPresident && <Star className="h-4 w-4 shrink-0 fill-accent/30 text-accent/60" />}
      </div>
    </motion.div>
  );
}

function ZoneCard({ zone, area, coordinators }: { zone: string; area: string; coordinators: string }) {
  return (
    <motion.div variants={FADE_IN_UP}>
      <div className="group h-full rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-accent/30 hover:shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/15">
            <MapPin className="h-4 w-4" />
          </div>
          <h3 className="font-serif text-base font-semibold text-foreground">{zone}</h3>
        </div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{area}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{coordinators}</p>
      </div>
    </motion.div>
  );
}

// ─── Timeline event ───────────────────────────────────────────────────────────

function TimelineEvent({ event, isLast }: { event: HistoryEvent; isLast: boolean }) {
  return (
    <motion.div
      variants={FADE_IN_UP}
      className="relative flex gap-6"
    >
      {/* Vertical line */}
      {!isLast && (
        <div className="absolute left-[1.4375rem] top-12 bottom-0 w-px bg-gradient-to-b from-border to-transparent" />
      )}

      {/* Timeline dot */}
      <div className="relative flex-shrink-0 mt-1">
        <div className={`flex h-[2.875rem] w-[2.875rem] items-center justify-center rounded-full border-2 ${
          event.highlight
            ? 'border-accent bg-accent/10 shadow-gold'
            : 'border-border bg-card'
        }`}>
          {event.medals ? (
            <Medal className={`h-5 w-5 ${event.highlight ? 'text-accent' : 'text-muted-foreground'}`} />
          ) : event.highlight ? (
            <Star className="h-5 w-5 fill-accent/40 text-accent" />
          ) : (
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`pb-10 flex-1 min-w-0 ${isLast ? 'pb-0' : ''}`}>
        <div className="flex flex-wrap items-baseline gap-3 mb-2">
          <span className={`text-sm font-bold tabular-nums ${event.highlight ? 'text-accent' : 'text-muted-foreground'}`}>
            {event.year}
          </span>
          {event.highlight && (
            <span className="inline-block rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
              Étape clé
            </span>
          )}
        </div>

        <div className={`rounded-xl border p-5 transition-shadow hover:shadow-sm ${
          event.highlight
            ? 'border-accent/20 bg-primary/[0.02]'
            : 'border-border/60 bg-card'
        }`}>
          <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">
            {event.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {event.description}
          </p>
          {event.medals && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/8 px-3 py-2">
              <Medal className="h-4 w-4 shrink-0 text-accent" />
              <span className="text-sm font-semibold text-accent">{event.medals}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section Title ────────────────────────────────────────────────────────────

function SectionTitle({ icon, title, subtitle, compact = false }: {
  icon: React.ReactNode; title: string; subtitle: string; compact?: boolean;
}) {
  return (
    <motion.div variants={FADE_IN_UP} className={compact ? 'mb-5' : 'mb-8'}>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">{icon}</div>
        <div>
          <h2 className={`font-serif font-bold text-foreground ${compact ? 'text-xl' : 'text-2xl'}`}>{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="mt-3 h-px bg-gradient-to-r from-accent/30 via-border to-transparent" />
    </motion.div>
  );
}

// ─── Data: rôle & activités, présence nationale ────────────────────────────────

const ACTIVITES = [
  {
    icon: GraduationCap,
    title: 'Formation des cadres',
    description:
      "L'ADSS forme ses cadres techniques, arbitres et officiels, et organise régulièrement des stages de mise à niveau ainsi que des formations d'Initiateur de Shaolin.",
  },
  {
    icon: Trophy,
    title: 'Compétitions nationales',
    description:
      "Championnats du Sénégal, coupe du PDG de Mangane Holding, coupe de la marraine nationale, et le Takoussanou Shaolin — un festival de démonstration réunissant tous les clubs affiliés.",
  },
  {
    icon: Globe,
    title: 'Rayonnement international',
    description:
      "L'ADSS participe activement à toutes les compétitions organisées par la Fédération Africaine de Shaolin ainsi qu'à celles du Temple Shaolin de Chine.",
  },
];

const ZONES = [
  { zone: 'Zone Sud', area: 'Kolda', coordinators: 'Coordonnée par Maître Abdoulaye Kandé.' },
  { zone: 'Zone Centre-Ouest', area: 'Fatick · Kaffrine · Kaolack', coordinators: 'Gérée par Maître Alpha Mbassor Faye, assisté par Maître Niokhor Diouf.' },
  { zone: 'Zone Nord', area: 'Saint-Louis · Louga', coordinators: 'Responsable : Maître Mamadou Lamine Sarr, basé à Podor.' },
  { zone: 'Région de Thiès', area: 'Thiès · Mbour · Tivaouane · Ngaye · Pire', coordinators: 'District de Mbour piloté par Maître Izi Diassy ; Tivaouane, Ngaye et Pire par Maître Mohamed Fall.' },
  { zone: 'Région de Diourbel', area: 'Touba · Mbacké · Diourbel', coordinators: 'Menée par Maître Cheikh Mbacké Diagne, avec Maîtres Ibrahima Sylla, Modou Diouf et Cheikh Ndigal Gning.' },
  { zone: 'Région de Dakar', area: 'Capitale — cœur du Shaolin sénégalais', coordinators: "Dirigée par le Directeur Technique National, Maître Abdoulaye Diarra." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FederationPage() {
  const presidency = BUREAU_MEMBERS.filter((m) => m.tier === 'presidency');
  const executive = BUREAU_MEMBERS.filter((m) => m.tier === 'executive');
  const orgMembers = BUREAU_MEMBERS.filter((m) => m.commission?.includes('Organisation'));
  const commMembers = BUREAU_MEMBERS.filter((m) => m.commission?.includes('Communication'));

  return (
    <div className="min-h-screen">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary py-20 lg:py-28">
        {/* Real photo background */}
        <Image
          src="/images/delegation/delegation-banniere-temple.jpeg"
          alt="Délégation ADSS devant le Temple Shaolin"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay to keep text readable */}
        <div className="absolute inset-0 bg-primary/85" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.8'%3E%3Crect x='10' y='10' width='60' height='60'/%3E%3Crect x='20' y='20' width='40' height='40'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }}
        />
        <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-accent/10 blur-[80px]" />

        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="visible"
          className="container relative mx-auto px-4 text-center"
        >
          <motion.span variants={FADE_IN_UP}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
          >
            <Shield className="h-3.5 w-3.5" />
            Association officielle · Ministère de l&apos;Intérieur · NINEA
          </motion.span>
          <motion.h1 variants={FADE_IN_UP} className="mb-2 font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Disciples Shaolin Si Sénégal
          </motion.h1>
          <motion.div variants={FADE_IN_UP} className="mb-2 font-serif text-xl text-accent/80">
            Association Disciples Shaolin Si Sénégal
          </motion.div>
          <motion.div variants={FADE_IN_UP} className="mb-6 flex justify-center">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
          </motion.div>
          <motion.p variants={FADE_IN_UP} className="mx-auto max-w-2xl text-base text-white/65 lg:text-lg">
            Association nationale dédiée à la promotion du Shaolin authentique, directement
            transmis par le Temple Shaolin de Chine, active au Sénégal depuis 1981.
          </motion.p>

          {/* Quick trust badges */}
          <motion.div variants={FADE_IN_UP} className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { icon: CheckCircle2, label: 'Reconnue par le Ministère de l\'Intérieur' },
              { icon: Users, label: '1 000+ adhérents' },
              { icon: Medal, label: '5 médailles internationales' },
              { icon: Building, label: 'Siège équipé — Mangane Holding' },
            ].map((badge) => (
              <span key={badge.label} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/70">
                <badge.icon className="h-3.5 w-3.5 text-accent/70" />
                {badge.label}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 py-16 lg:py-20 space-y-20">

        {/* ── Histoire ─────────────────────────────────────────────────── */}
        <section>
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionTitle
              icon={<CalendarDays className="h-5 w-5" />}
              title="Notre histoire"
              subtitle="Du Wushu au Shaolin — 40 ans de passion"
            />

            <div className="lg:max-w-3xl">
              {ADSS_HISTORY.map((event, i) => (
                <TimelineEvent
                  key={event.year}
                  event={event}
                  isLast={i === ADSS_HISTORY.length - 1}
                />
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Rôle & activités ─────────────────────────────────────────── */}
        <section>
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionTitle
              icon={<Target className="h-5 w-5" />}
              title="Rôle & activités"
              subtitle="Ce que fait l'ADSS au quotidien, au Sénégal et au-delà"
            />
            <div className="grid gap-4 sm:grid-cols-3">
              {ACTIVITES.map((a) => (
                <motion.div key={a.title} variants={FADE_IN_UP}>
                  <div className="h-full rounded-xl border border-border/60 bg-card p-6 transition-all hover:border-accent/25 hover:shadow-sm">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <a.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 font-serif text-base font-semibold text-foreground">{a.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{a.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Partenaires stratégiques ─────────────────────────────────── */}
        <section>
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionTitle
              icon={<Building className="h-5 w-5" />}
              title="Partenaires & soutiens"
              subtitle="Les institutions et partenaires qui nous accompagnent"
            />
            <motion.div variants={FADE_IN_UP} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-accent/20 bg-primary/[0.03] p-6">
                <div className="mb-3 font-serif text-lg font-semibold text-foreground">
                  🇨🇳 Ambassade de Chine au Sénégal
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Collaboration étroite avec l&apos;Ambassade de la République Populaire de Chine,
                  via son attaché culturel <span className="font-medium text-foreground">M. Wu Han</span>.
                  Un lien direct avec la source authentique du Shaolin.
                </p>
              </div>
              <div className="rounded-xl border border-accent/20 bg-primary/[0.03] p-6">
                <div className="mb-3 font-serif text-lg font-semibold text-foreground">
                  🏢 Mangane Holding
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Sponsor institutionnel de l&apos;ADSS, dirigé par{' '}
                  <span className="font-medium text-foreground">Shifu Djiby Mangane</span>,
                  ceinture noire 3e Duan Shaolin. Mangane Holding a entièrement financé
                  le siège de l&apos;ADSS à hauteur de{' '}
                  <span className="font-medium text-accent">10 000 000 FCFA</span>.
                </p>
              </div>
              <div className="rounded-xl border border-accent/20 bg-primary/[0.03] p-6">
                <div className="mb-3 font-serif text-lg font-semibold text-foreground">
                  🎗️ Marraine de l&apos;ADSS
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">Madame Aïssatou Mané Mangane</span>,
                  DG de MSTAL, accompagne l&apos;association dans toutes ses activités et prend en
                  charge la location des plus grandes salles de spectacle de Dakar (The Ground,
                  Grand Théâtre, Sorano, Dakar Arena). Elle organise chaque année la Coupe de la
                  Marraine, un rendez-vous majeur de l&apos;ADSS.
                </p>
              </div>
              <div className="rounded-xl border border-accent/20 bg-primary/[0.03] p-6">
                <div className="mb-3 font-serif text-lg font-semibold text-foreground">
                  🚌 Logistique & transport
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Le commandant <span className="font-medium text-foreground">Ismaïla Basse</span>,
                  du Port Autonome de Dakar, met à disposition un bus climatisé de 60 places
                  (SENECAR TOURS) lors de la Grande Nuit des Arts Martiaux et des événements majeurs.
                </p>
              </div>
              <div className="rounded-xl border border-accent/20 bg-primary/[0.03] p-6">
                <div className="mb-3 font-serif text-lg font-semibold text-foreground">
                  📱 Sponsors techniques
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Huawei, Infinix et Itel accompagnent l&apos;ADSS lors de ses grands événements,
                  aux côtés de Mangane Holding qui finance l&apos;intégralité du matériel des
                  athlètes (kimonos, armes, flyers, restauration).
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Présence nationale ────────────────────────────────────────── */}
        <section>
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionTitle
              icon={<MapPin className="h-5 w-5" />}
              title="Présence nationale"
              subtitle="Des points focaux organisés en zones et districts, dans les 14 régions du Sénégal"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ZONES.map((z) => <ZoneCard key={z.zone} {...z} />)}
            </div>
          </motion.div>
        </section>

        {/* ── Bureau Présidence ─────────────────────────────────────────── */}
        <section>
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionTitle
              icon={<Star className="h-5 w-5" />}
              title="Présidence"
              subtitle="Direction générale de l'ADSS"
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-4xl">
              {presidency.map((m) => <PresidencyCard key={m.id} member={m} />)}
            </div>
          </motion.div>
        </section>

        {/* ── Direction Exécutive ───────────────────────────────────────── */}
        <section>
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionTitle
              icon={<Users className="h-5 w-5" />}
              title="Direction Exécutive"
              subtitle="Administration et direction technique"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {executive.map((m) => <ExecutiveCard key={m.id} member={m} />)}
            </div>
          </motion.div>
        </section>

        {/* ── Commissions ──────────────────────────────────────────────── */}
        <section>
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionTitle
              icon={<Settings className="h-5 w-5" />}
              title="Commissions"
              subtitle="Équipes spécialisées au service de l'ADSS"
            />
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Commission Organisation
                </p>
                <div className="space-y-3">
                  {orgMembers.map((m) => <CommissionCard key={m.id} member={m} />)}
                </div>
              </div>
              <div>
                <p className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Commission Communication · Sponsoring · Marketing
                </p>
                <div className="space-y-3">
                  {commMembers.map((m) => <CommissionCard key={m.id} member={m} />)}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

      </div>

      {/* ── Perspectives ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-primary py-20 lg:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.8'%3E%3Ccircle cx='60' cy='60' r='50'/%3E%3Ccircle cx='60' cy='60' r='35'/%3E%3Ccircle cx='60' cy='60' r='15'/%3E%3Cline x1='60' y1='10' x2='60' y2='110'/%3E%3Cline x1='10' y1='60' x2='110' y2='60'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px',
          }}
        />
        <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-accent/10 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/8 blur-[80px]" />

        <div className="container relative mx-auto px-4">
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.span
              variants={FADE_IN_UP}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Perspectives
            </motion.span>
            <motion.h2 variants={FADE_IN_UP} className="mb-4 font-serif text-3xl font-bold text-white md:text-4xl">
              Vers une pleine autonomie, et demain une fédération nationale
            </motion.h2>
            <motion.p variants={FADE_IN_UP} className="text-base leading-relaxed text-white/65 lg:text-lg">
              Avec l&apos;accompagnement de Mangane Holding, l&apos;ADSS ambitionne de se doter
              d&apos;un temple dédié et d&apos;un véhicule pour garantir sa pleine autonomie —
              et de rivaliser, à terme, avec les meilleurs temples Shaolin au monde en se
              transformant en fédération nationale.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Citation finale ───────────────────────────────────────────── */}
      <div className="container mx-auto px-4 py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-accent/15 bg-primary/[0.03] p-10 text-center"
        >
          <div className="mb-4 font-serif text-5xl text-accent/20">少林寺</div>
          <blockquote className="mx-auto max-w-2xl font-serif text-xl italic text-foreground/70">
            &ldquo; Notre mission est de transmettre le Shaolin authentique — héritage du
            Temple Shaolin de Chine — à toutes les générations du Sénégal. &rdquo;
          </blockquote>
          <div className="mt-4 text-sm font-semibold text-accent">
            Association Disciples Shaolin Si Sénégal (ADSS) · Fondée en Mars 2024
          </div>
        </motion.div>
      </div>
    </div>
  );
}
