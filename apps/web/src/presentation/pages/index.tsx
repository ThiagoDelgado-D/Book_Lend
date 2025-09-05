import { HeroSection } from '../components/home/hero-section';
import { StatsSection } from '../components/home/stats-section';
import { CategoriesGrid } from '../components/home/categories-grid';
import { MainLayout } from '../layouts/main-layout';

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <StatsSection />
      <CategoriesGrid />
    </MainLayout>
  );
}
