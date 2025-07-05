
import React from 'react';

const BackgroundParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">

      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-10"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 100}s`,
          }}
        ></div>
      ))}
    </div>
  );
};

export default BackgroundParticles;
