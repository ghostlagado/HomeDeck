import { useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import CategoryPage from '../pages/CategoryPage';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

export function RouteProvider() {
  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: '/',
          element: <MainLayout />,
          errorElement: <NotFound />,
          children: [
            {
              index: true,
              element: <Home />,
            },
            {
              path: 'c/:categoryId',
              element: <CategoryPage />,
            },
            {
              path: 'settings',
              element: <Settings />,
            },
            {
              path: '*',
              element: <NotFound />,
            },
          ],
        },
      ]),
    []
  );

  return <RouterProvider router={router} />;
}
