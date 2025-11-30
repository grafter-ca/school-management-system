
'use client';

import LoginForm from '@/components/login';

export default function LoginPage() {
  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Add your forgot password logic here
  };

  const handleLoginSubmit = (email: string, password: string) => {
    console.log('Logging in:', email, password);
    // Add your login API call here
  };

  return (
    <LoginForm
      onForgotPassword={handleForgotPassword}
      onLogin={handleLoginSubmit}
    />
  );
}
