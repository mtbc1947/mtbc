import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import RouteError from './components/routeError.jsx';

import MainLayout from './layouts/MainLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import OpenDayPage from './pages/OpenDayPage.jsx';
import AboutUsPage from './pages/AboutUsPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import OfficersPage from './pages/OfficersPage.jsx';
import KennetPage from './pages/KennetPage.jsx';
import KLVPage from './pages/KLVPage.jsx';
import RoyalShieldPage from './pages/RoyalShieldPage.jsx';
import ThamesValleyPage from './pages/ThamesValleyPage.jsx';
import NoticeBoardPage from './pages/NoticeBoardPage.jsx';
import NewsReportsPage from './pages/NewsReportsPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import SocialPage from './pages/SocialPage.jsx';
import LocationPage from './pages/LocationPage.jsx';
import ContactUsPage from './pages/ContactUsPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import CountyPresidentsPage from './pages/CountyPresidentsPage.jsx';
import PresidentsPage from './pages/PresidentsPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import ErrorBoundary from './components/errorBoundary.jsx';


const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage  />,
        errorElement: <RouteError />,
      },
      {
        path: "/aboutUs",
        element: <AboutUsPage />,
        errorElement: <RouteError />,
      },
      {
        path: "/history",
        element: <HistoryPage />,
        errorElement: <RouteError />,
      },
      {
        path: "/officers",
        element: <OfficersPage />,
        errorElement: <RouteError />,
      },
      {
        path: "/openDay",
        element: <OpenDayPage />,
        errorElement: <RouteError />,
      },
      {
        path: "/social",
        element: <SocialPage />,
        errorElement: <RouteError />,
      },
      {
        path: "/kl/:teamKey",
        element: <KennetPage />,
        errorElement: <RouteError />,
      },
      {
        path: "/klv/:teamKey",
        element: <KLVPage />,
        errorElement: <RouteError />,
      },
      {
        path: "/rs/:teamKey",
        element: <RoyalShieldPage />,
        errorElement: <RouteError />,
      },
      {
        path: "/tv/:teamKey",
        element: <ThamesValleyPage />,
        errorElement: <RouteError />,
      },
      {
        path: "/noticeBoard",
        element: <NoticeBoardPage />,
        errorElement: <RouteError />,
      },
      {
        path: "/newsReports",
        element: <NewsReportsPage />,
        errorElement: <RouteError />,
      },
      {
        path: "/location",
        element: <LocationPage />,
        errorElement: <RouteError />,
      },
      {
        path: "/contactUs",
        element: <ContactUsPage />,
        errorElement: <RouteError />,
      },
      {
        path: "/privacy",
        element: <PrivacyPage />,
        errorElement: <RouteError />,
      },
      {
        path: "/booking",
        element: <BookingPage />,
        errorElement: <RouteError />,
      },
      {
        path: "/countyPresidents",
        element: <CountyPresidentsPage />,
        errorElement: <RouteError />,
      },
      {
        path: "/presidents",
        element: <PresidentsPage />,
        errorElement: <RouteError />,
      },
      {
        path: "/admin",
        element: <AdminPage />,
        errorElement: <RouteError />,  
      },
    ]
  }
])


// @ts-ignore
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router = { router } />
    </ErrorBoundary>
  </StrictMode>,
)
