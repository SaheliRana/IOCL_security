import HelmetUpload from '../components/HelmetUpload';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import AbstractModal from '../components/AbstractModal';
import BackgroundParticles from '../components/BackgroundParticles';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState('login');
  const [selectedFeature, setSelectedFeature] = useState('');
  const [showAbstract, setShowAbstract] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-x-hidden">
      <BackgroundParticles />
      <Navbar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        scrollY={scrollY}
        setAuthType={setAuthType}
        setShowAuthModal={setShowAuthModal}
        setShowAbstract={setShowAbstract}
      />
      <HeroSection setAuthType={setAuthType} setShowAuthModal={setShowAuthModal} setShowAbstract={setShowAbstract} />
      <Features
        setSelectedFeature={setSelectedFeature}
        setShowAuthModal={setShowAuthModal}
        setAuthType={setAuthType}
      />
      <ContactSection />
      <Footer />
      {selectedFeature === 'ppe-detection' && <HelmetUpload />}

      {showAuthModal && <AuthModal authType={authType} setAuthType={setAuthType} setShowAuthModal={setShowAuthModal} />}
      {showAbstract && <AbstractModal setShowAbstract={setShowAbstract} />}
    </div>
  );
};

export default Home;
