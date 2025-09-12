import { RouteObject } from 'react-router-dom';
import HomePage from './presentation/pages';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
];

export default routes;
