import React, { useState } from 'react';
import { X } from 'lucide-react';

const AuthModal = ({ authType, setAuthType, setShowAuthModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async () => {
    if (authType === 'signup' && password !== confirmPassword) {
      alert("❌ Passwords do not match");
      return;
    }

    const url = authType === 'login'
      ? "http://127.0.0.1:8000/api/auth/login/"
      : "http://127.0.0.1:8000/api/auth/signup/";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("📡 Response:", res.status, data);  // helpful debug

      if (!res.ok) {
        alert(data.message || 'Something went wrong');
        return;
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        alert(`✅ ${authType === 'login' ? 'Logged in' : 'Account created'} successfully`);
        setShowAuthModal(false);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error('Auth error:', err);
      alert('Server error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {authType === 'login' ? 'Welcome Back' : 'Join Our Platform'}
          </h3>
          <button
            onClick={() => setShowAuthModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white text-black placeholder-gray-600 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white text-black placeholder-gray-600 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {authType === 'signup' && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white text-black placeholder-gray-600 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold mt-6 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          {authType === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <p className="text-center text-gray-600 mt-4">
          {authType === 'login' ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setAuthType(authType === 'login' ? 'signup' : 'login')}
            className="text-blue-600 font-semibold hover:underline ml-1"
          >
            {authType === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
