import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useLanguage } from '../hooks/useLanguage';
import axios from 'axios'; // Import axios

export const SignInPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // State for all form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

   const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/users/login',
        { email, password }
      );

      // ADD THIS LINE TO DEBUG
      console.log('API Response Data:', data); 
      
      login(data);
      
      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Sign in failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-medium">
      <Card className="max-w-md w-full animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-neutral-dark mb-2">{t('welcomeBack')}</h2>
        <p className="text-center text-gray-500 mb-8">{t('signInContinue')}</p>
        
        {/* The form now uses a single onSubmit handler */}
        <form className="space-y-6" onSubmit={handleSignIn}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('emailAddress')}</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue bg-white text-neutral-dark" 
              placeholder="you@example.com" 
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">{t('password')}</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue bg-white text-neutral-dark" placeholder="••••••••" 
            />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('signingIn') : t('signIn')}
          </Button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-600">
          {t('dontHaveAccount')} <Link to="/signup" className="font-medium text-brand-blue hover:underline">{t('signUp')}</Link>
        </p>
      </Card>
    </div>
  );
};