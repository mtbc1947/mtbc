import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import MainLayout from 'layouts';

import HomePage from 'pages';
import OpenDayPage from 'pages';
import AboutUsPage from 'pages';
import HistoryPage from 'pages';
import OfficersPage from 'pages';
import TeamPage from 'pages';
import NoticeBoardPage from 'pages';
import NewsReportsPage from 'pages';
import PrivacyPage from 'pages';
import SocialPage from 'pages';
import LocationPage from 'pages';
import ContactUsPage from 'pages';
import BookingPage from 'pages';
import CountyPresidentsPage from 'pages';
import PresidentsPage from 'pages';
import AdminPage from 'pages';
import MaintainDataPage from 'pages';

import ErrorBoundary from 'components';
import RouteError   from 'components';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage />, errorElement: <RouteError /> },
      { path: "/aboutUs", element: <AboutUsPage />, errorElement: <RouteError /> },
      { path: "/history", element: <HistoryPage />, errorElement: <RouteError /> },
      { path: "/officers", element: <OfficersPage />, errorElement: <RouteError /> },
      { path: "/openDay", element: <OpenDayPage />, errorElement: <RouteError /> },
      { path: "/social", element: <SocialPage />, errorElement: <RouteError /> },
      { path: "/team/:league/:team", element: <TeamPage />, errorElement: <RouteError /> },
      { path: "/noticeBoard", element: <NoticeBoardPage />, errorElement: <RouteError /> },
      { path: "/newsReports", element: <NewsReportsPage />, errorElement: <RouteError /> },
      { path: "/location", element: <LocationPage />, errorElement: <RouteError /> },
      { path: "/contactUs", element: <ContactUsPage />, errorElement: <RouteError /> },
      { path: "/privacy", element: <PrivacyPage />, errorElement: <RouteError /> },
      { path: "/booking", element: <BookingPage />, errorElement: <RouteError /> },
      { path: "/countyPresidents", element: <CountyPresidentsPage />, errorElement: <RouteError /> },
      { path: "/presidents", element: <PresidentsPage />, errorElement: <RouteError /> },
      { path: "/admin", element: <AdminPage />, errorElement: <RouteError /> },
      { path: "/maintainData", element: <MaintainDataPage />, errorElement: <RouteError /> },
    ],
  },
]);

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
);
