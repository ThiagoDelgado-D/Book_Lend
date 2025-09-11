import { DashboardSection } from '../components/home/dashboard-section';
import { HeroSection } from '../components/home/hero-section';
import { MainLayout } from '../layouts/main-layout';

const Index = () => {
  return (
    <MainLayout>
      <main>
        <HeroSection />
        <section className="py-16">
          <div className="container">
            <DashboardSection />
          </div>
        </section>
      </main>
    </MainLayout>
  );
};

export default Index;
