import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Role } from '../types';
import axios from 'axios'; // Import axios

export const SignUpPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State for all form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(Role.USER);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam === 'volunteer') {
      setSelectedRole(Role.VOLUNTEER);
    } else {
      setSelectedRole(Role.USER);
    }
  }, [location.search]);

  // Handle the real sign-up process
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Send registration data to the backend
      const { data } = await axios.post(
        'http://localhost:5000/api/users/register',
        {
          name,
          email,
          password,
          role: selectedRole.toUpperCase(), // Match backend 'USER' or 'VOLUNTEER'
        }
      );

      // 2. If successful, use the response data (which includes a token) to log the user in
      login(data); // Assuming login function in useAuth can handle the user object
      
      // 3. Navigate to the dashboard
      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-medium">
      <Card className="max-w-md w-full animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-neutral-dark mb-2">Create an Account</h2>
        <p className="text-center text-gray-500 mb-8">Join SafeHaven to help or get help.</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setSelectedRole(Role.USER)}
            className={`p-4 border-2 rounded-lg text-center transition-all ${selectedRole === Role.USER ? 'border-brand-blue bg-blue-50' : 'border-gray-300'}`}
          >
            <span className="text-3xl">🙋</span>
            <span className="block font-semibold mt-2">I need help</span>
          </button>
          <button
            onClick={() => setSelectedRole(Role.VOLUNTEER)}
            className={`p-4 border-2 rounded-lg text-center transition-all ${selectedRole === Role.VOLUNTEER ? 'border-brand-green bg-green-50' : 'border-gray-300'}`}
          >
            <span className="text-3xl">❤️</span>
            <span className="block font-semibold mt-2">I want to help</span>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSignUp}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="name" name="name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-neutral-dark" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-neutral-dark" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-neutral-dark" />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account? <Link to="/signin" className="font-medium text-brand-blue hover:underline">Sign in</Link>
        </p>
      </Card>
    </div>
  );
};