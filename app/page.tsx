'use client';

import LoginForm from '@/components/login';

export default function LoginPage() {

console.log("Api url", process.env.NEXT_PUBLIC_APP_URL)

  const handleForgotPassword = async () => {
    console.log('Forgot password clicked');
  };

  const handleLoginSubmit = async (email: string, password: string) => {
    console.log('Logging in:', email, password);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });


      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);

      const data = await res.json();
      console.log('Response data:', data);
      
      // Check if response is successful AND no error in data
      if (res.ok && !data.error) {
        console.log('Login successful, redirecting...');
        // Login successful → redirect to dashboard
        window.location.href = '/onboard';
      } else {
        console.error('Login failed:', data.error);
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <LoginForm
      onForgotPassword={handleForgotPassword}
      onLogin={handleLoginSubmit}
    />
  );
}