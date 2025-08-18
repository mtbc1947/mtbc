// main.jsx
if (import.meta.env.DEV) {
    import("eruda").then((eruda) => {
        eruda.default.init();
    });
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './auth/AuthContext';
import React, { FC } from 'react'; // Import React and FC (Functional Component type)

import PageWithBackground from './components/PageWithBackground';

// Import background images for all pages that need one
import homeBackground from './assets/Home_2.jpg';
import aboutUsBackground from './assets/green1.jpg';
import historyBackground from './assets/green1.jpg';
import officersBackground from './assets/green1.jpg';
import openDayBackground from './assets/green1.jpg';
import socialBackground from './assets/green1.jpg';
import teamBackground from './assets/green1.jpg';
import noticeBoardBackground from './assets/green1.jpg';
import newsReportsBackground from './assets/green1.jpg';
import privacyBackground from './assets/green1.jpg';
import locationBackground from './assets/green1.jpg';
import contactUsBackground from './assets/green1.jpg';
import fixturesBackground from './assets/green1.jpg';
import bookingBackground from './assets/green1.jpg';
import countyPresidentsBackground from './assets/green1.jpg';
import presidentsBackground from './assets/green1.jpg';
import adminBackground from './assets/green1.jpg';
import notFoundBackground from './assets/green1.jpg';


import { MainLayout } from './layouts';
import { ErrorBoundary } from './components';
import { RouteError } from './components';

import { HomePage } from './pages';
import { OpenDayPage } from './pages';
import { AboutUsPage } from './pages';
import { HistoryPage } from './pages';
import { FixturesPage } from './pages';
import { OfficersPage } from './pages';
import { TeamPage } from './pages';
import { NoticeBoardPage } from './pages';
import { NewsReportsPage } from './pages';
import { PrivacyPage } from './pages';
import { SocialPage } from './pages';
import { LocationPage } from './pages';
import { ContactUsPage } from './pages';
import { BookingPage } from './pages';
import { CountyPresidentsPage } from './pages';
import { PresidentsPage } from './pages';
import { AdminPage } from './pages';
import { MaintainRefDataPage } from './pages';
import { MaintainEventPage } from './pages';
import { MaintainMemberPage } from './pages';
import { MaintainCommitteePage } from './pages';
import { MaintainOfficerPage } from './pages';
import { NotFoundPage } from './pages';

const router = createBrowserRouter([
    {
        errorElement: <RouteError />,
         children: [
            { path: '/', element: <PageWithBackground backgroundImage={homeBackground} Component={HomePage} /> },
            { path: "/aboutUs", element: <PageWithBackground backgroundImage={aboutUsBackground} Component={AboutUsPage} />} ,
            { path: "/history", element: <PageWithBackground backgroundImage={historyBackground} Component={HistoryPage} /> },
            { path: "/officers", element: <PageWithBackground backgroundImage={officersBackground} Component={OfficersPage} />} ,
            { path: "/openDay", element: <PageWithBackground backgroundImage={openDayBackground} Component={OpenDayPage} />} ,
            { path: "/social", element: <PageWithBackground backgroundImage={socialBackground} Component={SocialPage} />} ,
            { path: "/team/:league/:team", element: <PageWithBackground backgroundImage={teamBackground} Component={TeamPage} /> },
            { path: "/noticeBoard", element: <PageWithBackground backgroundImage={noticeBoardBackground} Component={NoticeBoardPage}  centerContent={true} />} ,
            { path: "/newsReports", element: <PageWithBackground backgroundImage={newsReportsBackground} Component={NewsReportsPage}  centerContent={true} /> },
            { path: "/location", element: <PageWithBackground backgroundImage={locationBackground} Component={LocationPage} />} ,
            { path: "/contactUs", element: <PageWithBackground backgroundImage={contactUsBackground} Component={ContactUsPage} />} ,
            { path: "/privacy", element: <PageWithBackground backgroundImage={privacyBackground} Component={PrivacyPage} /> },
            { path: "/fixtures", element: <PageWithBackground backgroundImage={fixturesBackground} Component={FixturesPage} />} ,
            { path: "/booking", element: <PageWithBackground backgroundImage={bookingBackground} Component={BookingPage}  centerContent={true} /> },
            { path: "/countyPresidents", element: <PageWithBackground backgroundImage={countyPresidentsBackground} Component={CountyPresidentsPage} /> },
            { path: "/presidents", element: <PageWithBackground backgroundImage={presidentsBackground} Component={PresidentsPage} /> },
            { path: "/admin", element: <PageWithBackground backgroundImage={adminBackground} Component={AdminPage} /> },
            { path: "/maintainRefData", element: <PageWithBackground backgroundImage={adminBackground} Component={MaintainRefDataPage} /> },
            { path: "/maintainEvent", element: <PageWithBackground backgroundImage={adminBackground} Component={MaintainEventPage} /> },
            { path: "/maintainMember", element: <PageWithBackground backgroundImage={adminBackground} Component={MaintainMemberPage} /> },
            { path: "/maintainCommittee", element: <PageWithBackground backgroundImage={adminBackground} Component={MaintainCommitteePage} /> },
            { path: "/maintainOfficer", element: <PageWithBackground backgroundImage={adminBackground} Component={MaintainOfficerPage} /> },
            { path: '*', element: <PageWithBackground backgroundImage={notFoundBackground} Component={NotFoundPage}  centerContent={true} />} 
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
                    <ToastContainer position="top-right" autoClose={3000} />
                </ErrorBoundary>
            </AuthProvider>
        </HelmetProvider>
    </StrictMode>
);