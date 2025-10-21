import HeroSection from '@/components/sections/HeroSection';
import CountdownTimer from '@/components/sections/CountdownTimer';
import CompetitionsOverview from '@/components/sections/CompetitionsOverview';
import TimelineSection from '@/components/sections/TimelineSection';
import VlogChallenge from '@/components/sections/VlogChallenge';
import GallerySection from '@/components/sections/GallerySection';
import Testimonials from '@/components/sections/Testimonials';
import SearchParamsProvider from '@/components/search-provider';

export default function Home() {
  return (
    <SearchParamsProvider>
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-orange-50">
        <HeroSection />
        <CountdownTimer />
        <CompetitionsOverview />
        <TimelineSection />
        <VlogChallenge />
        <GallerySection />
        <Testimonials />
      </main>
    </SearchParamsProvider>
  );
}