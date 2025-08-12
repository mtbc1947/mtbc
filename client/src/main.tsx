import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './auth/AuthContext';


import { MainLayout } from 'layouts';
import { ErrorBoundary } from 'components';
import { RouteError }   from 'components';

import { HomePage } from 'pages';
import { OpenDayPage } from 'pages';
import { AboutUsPage } from 'pages';
import { HistoryPage } from 'pages';
import { FixturesPage } from 'pages';
import { OfficersPage } from 'pages';
import { TeamPage } from 'pages';
import { NoticeBoardPage } from 'pages';
import { NewsReportsPage } from 'pages';
import { PrivacyPage } from 'pages';
import { SocialPage } from 'pages';
import { LocationPage } from 'pages';
import { ContactUsPage } from 'pages';
import { BookingPage } from 'pages';
import { CountyPresidentsPage } from 'pages';
import { PresidentsPage } from 'pages';
import { AdminPage } from 'pages';
import { MaintainRefDataPage } from 'pages';
import { MaintainEventPage } from 'pages';
import { MaintainMemberPage } from 'pages';
import { MaintainCommitteePage } from 'pages';
import { MaintainOfficerPage } from 'pages';
import { NotFoundPage } from 'pages';


const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <RouteError />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/aboutUs", element: <AboutUsPage /> },
      { path: "/history", element: <HistoryPage /> },
      { path: "/officers", element: <OfficersPage /> },
      { path: "/openDay", element: <OpenDayPage /> },
      { path: "/social", element: <SocialPage /> },
      { path: "/team/:league/:team", element: <TeamPage /> },
      { path: "/noticeBoard", element: <NoticeBoardPage /> },
      { path: "/newsReports", element: <NewsReportsPage /> },
      { path: "/location", element: <LocationPage /> },
      { path: "/contactUs", element: <ContactUsPage /> },
      { path: "/privacy", element: <PrivacyPage /> },
      { path: "/fixtures", element: <FixturesPage /> },
      { path: "/booking", element: <BookingPage /> },
      { path: "/countyPresidents", element: <CountyPresidentsPage /> },
      { path: "/presidents", element: <PresidentsPage />},
      { path: "/admin", element: <AdminPage /> },
      { path: "/maintainRefData", element: <MaintainRefDataPage /> },
      { path: "/maintainEvent", element: <MaintainEventPage /> },
      { path: "/maintainMember", element: <MaintainMemberPage /> },
      { path: "/maintainCommittee", element: <MaintainCommitteePage /> },
      { path: "/maintainOfficer", element: <MaintainOfficerPage /> },
      { path: '*', element: <NotFoundPage /> }
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
      <AuthProvider>
        <ErrorBoundary>
          <RouterProvider router={router} />
          <ToastContainer position="top-right" autoClose={3000}/>
        </ErrorBoundary>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
);
