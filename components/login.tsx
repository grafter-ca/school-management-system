"use client";

import { useState, useEffect } from "react";
import { Mail, ArrowLeft, CheckCircle, Lock, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

 function Login() {
  const route = useRouter();
  const { login, user } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Invalid credentials");
        return;
      }

      // Save user + token to context & localStorage
      login(data);

      toast.success("Logged in successfully!");
      console.log("user data", user);
      // redirect user after login
      const userRole = data.user.sms_role;

      if (userRole === "ONBOARDING") {
        route.push("/onboard");
      } else if (userRole === "COMPLIANCE") {
        route.push("/compliance");
      } else {
        route.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed!");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {showForgotPassword ? (
          <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
        ) : (
          <LoginForm
            onForgotPassword={() => setShowForgotPassword(true)}
            onLogin={handleLogin}
          />
        )}
      </div>
    </div>
  );
}

function LoginForm({
  onForgotPassword,
  onLogin,
}: {
  onForgotPassword: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await onLogin(email, password);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to EDUFLOW
        </h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 
            bg-linear-to-r from-blue-500 to-indigo-600 
            text-white py-3 rounded-lg font-medium 
            transition-all shadow-lg hover:shadow-xl
            ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:from-blue-600 hover:to-indigo-700"
            }
          `}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
                ></path>
              </svg>
              <span>Signing In...</span>
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </div>
    </div>
  );
}

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    console.log("Password reset request for:", email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to{" "}
            <span className="font-medium text-gray-900">{email}</span>
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Forgot Password?
        </h2>
        <p className="text-gray-600">
          No worries! Enter your email and we'll send you reset instructions.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="reset-email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
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
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
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


export default Login
