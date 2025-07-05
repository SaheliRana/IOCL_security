import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Features from './components/Features';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AbstractModal from './components/AbstractModal';
import BackgroundParticles from './components/BackgroundParticles';
import HelmetUpload from './components/HelmetUpload';
import Dashboard from './components/Dashboard';
// import Dashboard from './pages/Dashboard';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('login');
  const [showAbstract, setShowAbstract] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-x-hidden">
        <BackgroundParticles />
        {/* <Navbar
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          scrollY={scrollY}
          setAuthType={setAuthType}
          setShowAuthModal={setShowAuthModal}
        /> */}

        <Routes>
          <Route path="/" element={
            <>
              <HeroSection
                setAuthType={setAuthType}
                setShowAuthModal={setShowAuthModal}
                setShowAbstract={setShowAbstract}
              />
              <Features
                setAuthType={setAuthType}
                setShowAuthModal={setShowAuthModal}
              />
              <ContactSection />
              <Footer />
            </>
          } />
          <Route path="/helmet-detection" element={<HelmetUpload />} />
          <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>

        {/* Modals */}
        {showAuthModal && (
          <AuthModal
            authType={authType}
            setAuthType={setAuthType}
            setShowAuthModal={setShowAuthModal}
          />
        )}
        {showAbstract && <AbstractModal setShowAbstract={setShowAbstract} />}
      </div>
    </Router>
  );
};

export default App;
