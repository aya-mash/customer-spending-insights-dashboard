import type { DashboardConfig } from '../types/dashboard';
import { Logo } from '../../components/Logo';
import { createElement } from 'react';

function renderLogo() { return createElement(Logo); }

export const dashboardConfig: DashboardConfig = {
  branding: {
    title: 'Spending Insights',
    logo: renderLogo(),
    homeUrl: '/',
  },
  navigation: [
    { id: 'nav-overview', type: 'page', label: 'Overview', path: '/' },
    { id: 'nav-transactions', type: 'page', label: 'Transactions', path: '/transactions' },
    { id: 'nav-insights', type: 'page', label: 'Insights', path: '/insights' },
    { id: 'nav-style', type: 'page', label: 'Style Guide', path: '/style-guide' },
    { id: 'nav-protected', type: 'page', label: 'Protected', path: '/protected' },
  ],
  routes: [
    { path: '/', label: 'Overview', component: () => import('../routes/OverviewRoute').then(m => ({ default: m.default })), prefetch: () => import('../routes/OverviewRoute') },
    { path: '/transactions', label: 'Transactions', component: () => import('../routes/TransactionsRoute').then(m => ({ default: m.default })), prefetch: () => import('../routes/TransactionsRoute') },
    { path: '/insights', label: 'Insights', component: () => import('../routes/InsightsRoute').then(m => ({ default: m.default })), prefetch: () => import('../routes/InsightsRoute') },
    { path: '/style-guide', label: 'Style Guide', component: () => import('../../pages/StyleGuide').then(m => ({ default: m.default })), prefetch: () => import('../../pages/StyleGuide') },
    { path: '/protected', label: 'Protected', component: () => import('../routes/OverviewRoute').then(m => ({ default: m.default })), canActivate: () => false, fallback: createElement('div', null, 'Access denied') },
    { path: '*', label: 'Not Found', component: () => import('../../pages/NotFound').then(m => ({ default: m.default })) },
  ],
  slots: {},
  options: { brandVariant: 'capitec', defaultSidebarCollapsed: false, sidebarWidth: 248 },
};

export default dashboardConfig;