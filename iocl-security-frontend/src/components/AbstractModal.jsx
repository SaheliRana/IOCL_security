import React from 'react';
import { X } from 'lucide-react';
import TeamMemberCard from './TeamMemberCard';

const teamMembers = [
  {
    name: "Bharat Kumar Jhawar",
    role: "Project Lead",
    image: "src/assets/bharat.png",
    description: "3rd year student at Heritage Institute of Technology"
  },
  {
    name: "Arunima Saha",
    role: "Software Developer",
    image: "src/assets/arunima.jpeg",
    description: "3rd year student at Heritage Institute of Technology"
  },
  {
    name: "Saheli Rana",
    role: "Machine Learning",
    image: "src/assets/saheli.jpeg",
    description: "3rd year student at Heritage Institute of Technology"
  },
  {
    name: "Debidyuti Kar",
    role: "Software Developer",
    image: "src/assets/debidyuti.jpeg",
    description: "3rd year student at NIT Durgapur"
  },
  {
    name: "Sayantika Bhunia",
    role: "Software Developer",
    image: "src/assets/sayantika.jpeg",
    description: "3rd year student at Heritage Institute of Technology"
  }
];

const AbstractModal = ({ setShowAbstract }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-7xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-700">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Learn More About Us
          </h3>
          <button onClick={() => setShowAbstract(false)} className="text-gray-400 hover:text-white transition-colors">
            <X size={32} />
          </button>
        </div>

        {/* Abstract Section */}
        <div className="mb-12">
          <h4 className="text-3xl font-bold text-cyan-400 mb-6">Project Abstract</h4>
          <div className="text-gray-300 leading-relaxed mb-6 text-lg">
            In high-risk industrial and construction environments, ensuring worker safety is both a legal
            mandate and a moral responsibility.
            This project presents an AI-powered Automated Safety Compliance System that performs real-time Helmet
            and PPE detection using deep learning, while simultaneously logging entry and exit activities via QR-based
            authentication and facial recognition.
          </div>
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 p-6 rounded-xl border border-slate-600 mb-6">
            <h5 className="text-xl font-semibold text-cyan-400 mb-4">Key Objectives:</h5>
            <ul className="text-gray-300 space-y-2 list-disc pl-5">
              <li>QR-Based Entry Pass Generator</li>
              <li>QR Verification + Live Face Recognition</li>
              <li>Automated Entry/Exit & Overtime Alerts  </li>
              <li>Complete IFR-Suit Detection</li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h4 className="text-3xl font-bold text-purple-400 mb-8 text-center">Meet Our Team</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} member={member} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbstractModal;