import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-2xl text-gray-300 mb-8">
            Ready to enhance your security infrastructure? Contact us today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-lg rounded-2xl border border-slate-600 hover:border-cyan-400 transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-cyan-400">Email</h3>
            <p className="text-gray-300 text-lg">jhawarbharat52@gmail.com</p>
          </div>

          <div className="p-8 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-lg rounded-2xl border border-slate-600 hover:border-purple-400 transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-purple-400">Phone</h3>
            <p className="text-gray-300 text-lg">+91 9830096812</p>
          </div>

          <div className="p-8 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-lg rounded-2xl border border-slate-600 hover:border-green-400 transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-green-400">Address</h3>
            <p className="text-gray-300 text-lg">IOCL Guwahati Refinery, Noonmati</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

