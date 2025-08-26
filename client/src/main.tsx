/* eslint-disable @typescript-eslint/no-floating-promises */
if (import.meta.env.DEV) {
  import("eruda").then((eruda) => {
    eruda.default.init();
  });
}

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./auth/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import AppLoader from "./components/AppLoader";

import PageWithBackground from "./components/PageWithBackground";

// Background images
import homeBackground from "./assets/Home_2.jpg";
import aboutUsBackground from "./assets/green1.jpg";
import historyBackground from "./assets/green1.jpg";
import officersBackground from "./assets/green1.jpg";
import openDayBackground from "./assets/green1.jpg";
import socialBackground from "./assets/green1.jpg";
import teamBackground from "./assets/green1.jpg";
import noticeBoardBackground from "./assets/green1.jpg";
import newsReportsBackground from "./assets/green1.jpg";
import privacyBackground from "./assets/green1.jpg";
import locationBackground from "./assets/green1.jpg";
import contactUsBackground from "./assets/green1.jpg";
import fixturesBackground from "./assets/green1.jpg";
import bookingBackground from "./assets/green1.jpg";
import countyPresidentsBackground from "./assets/green1.jpg";
import presidentsBackground from "./assets/green1.jpg";
import adminBackground from "./assets/green1.jpg";
import notFoundBackground from "./assets/green1.jpg";

import { MainLayout } from "./layouts";
import { ErrorBoundary } from "./components";
import { RouteError } from "./components";

import {
  HomePage,
  OpenDayPage,
  AboutUsPage,
  HistoryPage,
  FixturesPage,
  OfficersPage,
  TeamPage,
  NoticeBoardPage,
  NewsReportsPage,
  PrivacyPage,
  SocialPage,
  LocationPage,
  ContactUsPage,
  BookingPage,
  CountyPresidentsPage,
  PresidentsPage,
  AdminPage,
  MaintainRefDataPage,
  MaintainEventPage,
  MaintainMemberPage,
  MaintainCommitteePage,
  MaintainOfficerPage,
  NotFoundPage,
} from "./pages";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    errorElement: <RouteError />,
    children: [
      { path: "/", element: <PageWithBackground backgroundImage={homeBackground} Component={HomePage} /> },
      { path: "/aboutUs", element: <PageWithBackground backgroundImage={aboutUsBackground} Component={AboutUsPage} /> },
      { path: "/history", element: <PageWithBackground backgroundImage={historyBackground} Component={HistoryPage} /> },
      { path: "/officers", element: <PageWithBackground backgroundImage={officersBackground} Component={OfficersPage} /> },
      { path: "/openDay", element: <PageWithBackground backgroundImage={openDayBackground} Component={OpenDayPage} /> },
      { path: "/social", element: <PageWithBackground backgroundImage={socialBackground} Component={SocialPage} /> },
      { path: "/team/:league/:team", element: <PageWithBackground backgroundImage={teamBackground} Component={TeamPage} /> },
      { path: "/noticeBoard", element: <PageWithBackground backgroundImage={noticeBoardBackground} Component={NoticeBoardPage} centerContent /> },
      { path: "/newsReports", element: <PageWithBackground backgroundImage={newsReportsBackground} Component={NewsReportsPage} centerContent /> },
      { path: "/location", element: <PageWithBackground backgroundImage={locationBackground} Component={LocationPage} /> },
      { path: "/contactUs", element: <PageWithBackground backgroundImage={contactUsBackground} Component={ContactUsPage} /> },
      { path: "/privacy", element: <PageWithBackground backgroundImage={privacyBackground} Component={PrivacyPage} /> },
      { path: "/fixtures", element: <PageWithBackground backgroundImage={fixturesBackground} Component={FixturesPage} /> },
      { path: "/booking", element: <PageWithBackground backgroundImage={bookingBackground} Component={BookingPage} centerContent /> },
      { path: "/countyPresidents", element: <PageWithBackground backgroundImage={countyPresidentsBackground} Component={CountyPresidentsPage} /> },
      { path: "/presidents", element: <PageWithBackground backgroundImage={presidentsBackground} Component={PresidentsPage} /> },
      { path: "/admin", element: <PageWithBackground backgroundImage={adminBackground} Component={AdminPage} /> },
      { path: "/maintainRefData", element: <PageWithBackground backgroundImage={adminBackground} Component={MaintainRefDataPage} /> },
      { path: "/maintainEvent", element: <PageWithBackground backgroundImage={adminBackground} Component={MaintainEventPage} /> },
      { path: "/maintainMember", element: <PageWithBackground backgroundImage={adminBackground} Component={MaintainMemberPage} /> },
      { path: "/maintainCommittee", element: <PageWithBackground backgroundImage={adminBackground} Component={MaintainCommitteePage} /> },
      { path: "/maintainOfficer", element: <PageWithBackground backgroundImage={adminBackground} Component={MaintainOfficerPage} /> },
      { path: "*", element: <PageWithBackground backgroundImage={notFoundBackground} Component={NotFoundPage} centerContent /> },
    ],
  },
]);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppLoader>
        <HelmetProvider>
          <AuthProvider>
            <ErrorBoundary>
              <RouterProvider router={router} />
              <ToastContainer position="top-right" autoClose={3000} />
            </ErrorBoundary>
          </AuthProvider>
        </HelmetProvider>
      </AppLoader>
    </QueryClientProvider>
  </StrictMode>
);
