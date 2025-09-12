import { Suspense } from 'react';
import { Header } from '../components/common/header';
import { PageLoader } from '../components/common/page-loader';
import { Footer } from '../components/common/footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="relative">
        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </main>
      <Footer />
    </div>
  );
};
