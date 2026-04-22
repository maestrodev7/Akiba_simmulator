import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { login } from '../../services/loginService.ts';
import logo from '../../assets/logo.svg';

export default function Login() {
  const [email, setEmail] = useState('admin@akiba.com');
  const [password, setPassword] = useState('AdminPass123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await login({ email, password });
      if (response.success) {
        navigate('/demand');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'Unable to connect to service. Please check your credentials and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_right,_var(--color-akiba-gold),_#4A3728,_#1A1208)] bg-[length:400%_400%] animate-gradient-slow p-5 font-sans">
      <div className="w-full max-w-[450px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl text-white flex flex-col gap-6">
        <header className="text-center flex flex-col items-center gap-4">
          <div className="bg-white/10 p-3 rounded-2xl shadow-sm border border-white/5">
            <img src={logo} width={60} height={60} alt="Akiba Logo" className="filter drop-shadow-sm" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Akiba Simulator</h1>
          <p className="text-white/70 text-[0.95rem]">Sign in to access your dashboard</p>
        </header>

        {error && (
          <div className="bg-red-500/15 border-l-4 border-red-500 p-3 px-4 rounded-lg text-red-200 text-sm flex items-start gap-3 animate-shake">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/90" htmlFor="email">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-white/50" size={20} />
              <input
                id="email"
                type="email"
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 pl-12 text-white text-base transition-all outline-none placeholder:text-white/30 focus:bg-black/30 focus:border-akiba-brown/50 focus:ring-4 focus:ring-akiba-brown/10"
                placeholder="admin@akiba.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/90" htmlFor="password">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-white/50" size={20} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 pl-12 text-white text-base transition-all outline-none placeholder:text-white/30 focus:bg-black/30 focus:border-akiba-brown/50 focus:ring-4 focus:ring-akiba-brown/10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="absolute right-3 bg-transparent border-none text-white/50 cursor-pointer flex items-center justify-center p-1.5 rounded-md transition-all hover:text-white/90 hover:bg-white/5" 
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-br from-akiba-brown to-akiba-brown-dark border-none rounded-xl p-3.5 text-white font-bold text-base cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-3px_rgba(187,122,68,0.4)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <LogIn size={20} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <footer className="text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} Akiba Group. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

