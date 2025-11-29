'use client';
import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export default function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log('Password reset request for:', email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <button
            onClick={onBack}
            className="w-full bg-linear-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Login
      </button>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg--to-br from-blue-500 to-indigo-600 rounded-full mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
        <p className="text-gray-600">
          No worries! Enter your email and we'll send you reset instructions.
        </p>
      </div>
      <div className="space-y-6">
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="reset-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-linear-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}