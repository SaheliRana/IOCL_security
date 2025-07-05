import React from 'react';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 border-t border-slate-700 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              IOCL Security
            </span>
          </div>
          <p className="text-gray-400 text-center">
            © 2025 IOCL Security System. All rights reserved. | Powered by Advanced AI Technology
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

