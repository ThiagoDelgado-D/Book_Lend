import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import { PageLoader } from './presentation/components/common/page-loader';

function App() {
  const element = useRoutes(routes);

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<PageLoader />}>{element}</Suspense>
    </div>
  );
}

export default App;
