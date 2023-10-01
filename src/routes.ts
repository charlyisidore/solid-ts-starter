import { lazy } from 'solid-js';

export default [
  {
    path: '/',
    component: lazy(() => import('./pages/Home')),
  },
  {
    path: '/settings',
    component: lazy(() => import('./pages/Settings')),
  },
];
