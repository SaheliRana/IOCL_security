import React from 'react';

const TeamMemberCard = ({ member, index }) => {
  return (
    <div
      className="group relative"
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
      <div className="relative bg-slate-800/70 backdrop-blur-lg p-4 rounded-2xl border border-slate-600 hover:border-cyan-400 transition-all duration-300 group-hover:scale-105 shadow-xl">
        <div className="mb-4">
          <img
            src={member.image}
            alt={member.name}
            className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-cyan-400 group-hover:border-purple-400 transition-all duration-300"
          />
        </div>
        <h5 className="text-lg font-bold mb-2 text-white text-center group-hover:text-cyan-300 transition-colors">
          {member.name}
        </h5>
        <p className="text-cyan-400 font-semibold mb-2 text-center text-sm">{member.role}</p>
        <p className="text-gray-300 text-xs text-center leading-relaxed">{member.description}</p>
      </div>
    </div>
  );
};

export default TeamMemberCard;
