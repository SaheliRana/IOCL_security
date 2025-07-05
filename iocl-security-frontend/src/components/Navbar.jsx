import React from 'react';
import { Shield, Menu, X } from 'lucide-react';

const Navbar = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  scrollY, 
  setAuthType, 
  setShowAuthModal, 
  setShowAbstract }) => {
  return (
    <nav
      className="fixed w-full z-40 transition-all duration-300"
      style={{
        backgroundColor: scrollY > 50 ? 'rgba(15, 23, 42, 0.95)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              IOCL Security
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="hover:text-cyan-400 font-medium">Home</a>
            <a href="#features" className="hover:text-cyan-400 font-medium">Features</a>
            <button
  onClick={() => setShowAbstract(true)}
  className="hover:text-cyan-400 font-medium"
>
  About
</button>            <a href="#contact" className="hover:text-cyan-400 font-medium">Contact</a>
            <button
              onClick={() => { setAuthType('login'); setShowAuthModal(true); }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-6 py-2 rounded-lg font-medium shadow-lg"
            >
              Login
            </button>
            <button
              onClick={() => { setAuthType('signup'); setShowAuthModal(true); }}
              className="border-2 border-cyan-400 hover:bg-cyan-400 hover:text-slate-900 px-6 py-2 rounded-lg font-medium"
            >
              Sign Up
            </button>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-slate-800 bg-opacity-95 backdrop-blur-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#home" className="block px-3 py-2 hover:bg-slate-700 rounded-md">Home</a>
            <a href="#features" className="block px-3 py-2 hover:bg-slate-700 rounded-md">Features</a>
            <button
              onClick={() => { setShowAbstract(true); setIsMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 hover:bg-slate-700 rounded-md"
            >
              About
            </button>
            <a href="#contact" className="block px-3 py-2 hover:bg-slate-700 rounded-md">Contact</a>
            <button
              onClick={() => { setAuthType('login'); setShowAuthModal(true); setIsMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 hover:bg-slate-700 rounded-md"
            >
              Login
            </button>
            <button
              onClick={() => { setAuthType('signup'); setShowAuthModal(true); setIsMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 hover:bg-slate-700 rounded-md"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
