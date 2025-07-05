import React from 'react';
import { Shield, ChevronDown } from 'lucide-react';

const HeroSection = ({ setAuthType, setShowAuthModal, setShowAbstract }) => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* Removed the animated background orbs */}
  
  <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <div className="w-40 h-40 mx-auto bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-8 shadow-2xl animate-pulse">
            <Shield className="w-20 h-20 text-white" />
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            IOCL Security
          </h1>
          <p className="text-2xl md:text-3xl text-gray-200 mb-4 font-light">
            Advanced AI-Powered Security & Safety Management System
          </p>
          <p className="text-lg md:text-xl text-cyan-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Revolutionizing industrial security with cutting-edge artificial intelligence,
            real-time monitoring, and comprehensive safety protocols for the modern workplace.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <button
            onClick={() => { setAuthType('login'); setShowAuthModal(true); }}
            className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 px-10 py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Get Started Now
          </button>
          <button
            onClick={() => setShowAbstract(true)}
            className="border-2 border-cyan-400 hover:bg-cyan-400 hover:text-slate-900 px-10 py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105"
          >
            Learn More
          </button>
        </div>

        <div className="animate-bounce">
          <ChevronDown className="w-10 h-10 mx-auto text-cyan-400" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
