import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Eye, Users, HardHat } from 'lucide-react';

const features = [
  {
    id: 'qr-creation',
    title: 'ADD WORKER(ENTRY PASS/QR GENERATOR)',
    description:
      'Add or edit Worker details',
    icon: QrCode,
    gradient: 'from-cyan-400 via-blue-500 to-purple-600',
  },
  {
    id: 'qr-recognition',
    title: 'QR Verification + Face Recognition',
    description:
      'Verify your QR and put your face for in front of camera for face recognition',
    icon: Eye,
    gradient: 'from-pink-400 via-purple-500 to-indigo-600',
  },
  {
    id: 'entry-logging',
    title: 'Automated Entry/Exit Logging',
    description:
      'Seamless tracking of personnel movement with intelligent automated logging and real-time analytics',
    icon: Users,
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
  },
  {
    id: 'ppe-detection',
    title: 'Helmet and PPE Detection',
    description:
      'AI-powered safety equipment detection for comprehensive compliance monitoring and worker protection',
    icon: HardHat,
    gradient: 'from-orange-400 via-red-500 to-pink-600',
  },
];

const Features = ({ setShowAuthModal, setAuthType }) => {
  const navigate = useNavigate();

  const handleFeatureClick = (featureId) => {
    const token = localStorage.getItem('token');

    // if (!token) {
    //   alert('⚠ Please log in or sign up to access this feature.');
    //   setAuthType('login');
    //   setShowAuthModal(true);
    //   return;
    // }

    // Navigate to the specific feature route
    if (featureId === 'ppe-detection') {
      navigate('/helmet-detection');
    }
    else if (featureId === 'entry-logging') {
      navigate('/dashboard');
    } 
    else if (featureId === 'qr-creation') {
      window.open('http://localhost:8000/admin/', '_blank'); // open Django in new tab
      return;
    }
    else if (featureId === 'qr-recognition') {
      fetch('http://localhost:8000/run-qr-scanner/')
        .then(res => res.json())
        .then(data => {
          alert(data.status || data.error);
        });
      return;
    }
    else {
      alert('✅ This feature is not yet connected to a page.');
    }
    
  };
  
  

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Security Features
          </h2>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Experience next-generation security technology with our comprehensive suite of AI-powered solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative"
                style={{
                  animation: `fadeInUp 0.8s ease-out ${index * 0.3}s both`,
                }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all duration-500`}
                ></div>
                <div className="relative bg-slate-800/60 backdrop-blur-xl p-10 rounded-3xl border border-slate-600 hover:border-slate-500 transition-all duration-500 group-hover:transform group-hover:scale-105 shadow-2xl">
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-6 text-white group-hover:text-cyan-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                  <button
                    onClick={() => handleFeatureClick(feature.id)}
                    className={`w-full bg-gradient-to-r ${feature.gradient} hover:shadow-2xl px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 transform hover:scale-105`}
                  >
                    Access Feature
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
