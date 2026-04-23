import { HeroSection } from '@/components/home/hero-section';
import { StatsSection } from '@/components/home/stats-section';
import { DisciplinesSection } from '@/components/home/disciplines-section';
import { FeaturedClubsSection } from '@/components/home/featured-clubs-section';
import { LatestNewsSection } from '@/components/home/latest-news-section';
import { CTASection } from '@/components/home/cta-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <DisciplinesSection />
      <FeaturedClubsSection />
      <LatestNewsSection />
      <CTASection />
    </>
  );
}
