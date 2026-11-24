import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnnouncementBar from './components/AnnouncementBar';
import EventModal from './components/EventModal';
import SignInModal from './components/SignInModal';
import SoothingVoiceWidget from './components/SoothingVoiceWidget';
import Toast from './components/Toast';
import PageTransition from './components/PageTransition';

// Core Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EcosystemPage from './pages/EcosystemPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import AcademyPage from './pages/AcademyPage';
import AcademyDetailPage from './pages/AcademyDetailPage';
import FounderConnectPage from './pages/FounderConnectPage';
import PitchCapitalConnectPage from './pages/PitchCapitalConnectPage';
import ForFoundersPage from './pages/ForFoundersPage';
import ForInvestorsPage from './pages/ForInvestorsPage';
import PartnershipsPage from './pages/PartnershipsPage';
import CommunityPage from './pages/CommunityPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import DisclaimerPage from './pages/DisclaimerPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

// New Editorial & Directory Pages
import InsightsPage from './pages/InsightsPage';
import NewsPage from './pages/NewsPage';
import FounderStoriesPage from './pages/FounderStoriesPage';
import NewsletterPage from './pages/NewsletterPage';
import FoundersDirectoryPage from './pages/FoundersDirectoryPage';
import StartupsDirectoryPage from './pages/StartupsDirectoryPage';
import OpportunitiesPage from './pages/OpportunitiesPage';

function AppContent() {
  const { currentPath } = useApp();

  const renderPage = () => {
    // Normalise path (remove trailing slashes if any, except for root)
    const path = currentPath === '/' ? '/' : currentPath.replace(/\/$/, '');

    // 1. Dynamic Route Matchers
    if (path.startsWith('/academy/') && path !== '/academy') {
      const sessionId = path.replace('/academy/', '');
      return <AcademyDetailPage sessionId={sessionId} />;
    }

    if (path.startsWith('/events/') && path !== '/events') {
      const eventId = path.replace('/events/', '');
      return <EventDetailPage eventId={eventId} />;
    }

    if (path.startsWith('/insights/') && path !== '/insights') {
      const slug = path.replace('/insights/', '');
      return <InsightsPage slug={slug} />;
    }

    if (path.startsWith('/news/') && path !== '/news') {
      const slug = path.replace('/news/', '');
      return <NewsPage slug={slug} />;
    }

    if (path.startsWith('/founder-stories/') && path !== '/founder-stories') {
      const slug = path.replace('/founder-stories/', '');
      return <FounderStoriesPage slug={slug} />;
    }

    if (path.startsWith('/founders/') && path !== '/founders') {
      const id = path.replace('/founders/', '');
      return <FoundersDirectoryPage selectedId={id} />;
    }

    if (path.startsWith('/startups/') && path !== '/startups') {
      const id = path.replace('/startups/', '');
      return <StartupsDirectoryPage selectedId={id} />;
    }

    // 2. Exact Route Matches
    switch (path) {
      case '':
      case '/':
        return <HomePage />;
      case '/about':
        return <AboutPage />;
      case '/academy':
        return <AcademyPage />;
      case '/ecosystem':
        return <EcosystemPage />;
      case '/events':
        return <EventsPage />;
      case '/founder-connect':
        return <FounderConnectPage />;
      case '/pitch-capital-connect':
      case '/pitch-to-us':
      case '/pitch':
        return <PitchCapitalConnectPage />;
      case '/for-founders':
        return <ForFoundersPage />;
      case '/for-investors':
        return <ForInvestorsPage />;
      case '/collaborate':
      case '/partnerships':
        return <PartnershipsPage />;
      case '/community':
        return <CommunityPage />;
      case '/contact':
        return <ContactPage />;
      case '/privacy-policy':
        return <PrivacyPage />;
      case '/terms':
        return <TermsPage />;
      case '/disclaimer':
        return <DisclaimerPage />;
      case '/admin':
        return <AdminPage />;
      case '/insights':
        return <InsightsPage />;
      case '/news':
        return <NewsPage />;
      case '/founder-stories':
        return <FounderStoriesPage />;
      case '/newsletter':
        return <NewsletterPage />;
      case '/founders':
        return <FoundersDirectoryPage />;
      case '/startups':
        return <StartupsDirectoryPage />;
      case '/opportunities':
        return <OpportunitiesPage />;
      default:
        return <NotFoundPage />;
    }
  };

  // If in Admin Console, render clean full-screen layout without public header/footer
  const isAdmin = currentPath.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-[#E8E5DF] selection:bg-[#C5A46D] selection:text-[#101010]">
        <AdminPage />
        <EventModal />
        <SignInModal />
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col theme-surface transition-colors duration-200 selection:bg-[#C5A46D] selection:text-[#101010]">
      {/* Top Announcement Ribbon */}
      <AnnouncementBar />

      {/* Persistent Sticky Navbar */}
      <Navbar />

      {/* Main Page Body with Smooth Page Transitions */}
      <main className="flex-1">
        <PageTransition key={currentPath}>
          {renderPage()}
        </PageTransition>
      </main>

      {/* Comprehensive 4-Column Footer */}
      <Footer />

      {/* Interactive Modal for Event Details & Registration Pass */}
      <EventModal />

      {/* Sign In Modal */}
      <SignInModal />

      {/* Floating Soothing Voice Narration & Harmonic Audio Widget */}
      <SoothingVoiceWidget />

      {/* Dynamic Toast Notifications */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
