import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Lock, Mail, ArrowRight, Loader2, AlertCircle, Activity, Globe, Shield, User as UserIcon } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithEmail, signupWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login();
      navigate('/');
    } catch (err) {
      setError('Erro ao fazer login com o Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        if (!name) {
          throw new Error('Nome é obrigatório');
        }
        await signupWithEmail(email, password, name);
      }
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.message === 'Nome é obrigatório') {
        setError('Por favor, preencha seu nome.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError(isLogin ? 'Erro ao fazer login. Verifique suas credenciais.' : 'Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex w-full overflow-hidden font-sans">
      {/* Left Side - Visual / Marketing (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-neon-green-950">
        {/* Ambient Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#022c22] to-[#000] z-0 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-[1]" />
        
        {/* Content Layer */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-neon-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              <Zap className="text-white w-6 h-6" fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Disp<span className="font-light text-emerald-200">Zap</span>
            </h1>
          </div>
        </div>

        {/* 3D Dashboard Preview Effect */}
        <div className="relative z-10 flex-1 flex items-center justify-center perspective-1000">
           <div className="relative w-full max-w-lg aspect-video bg-[#0f1115] rounded-xl border border-white/10 shadow-2xl transform rotate-y-12 rotate-x-6 hover:rotate-y-6 hover:rotate-x-3 transition-transform duration-700 ease-out group">
              {/* Fake Dashboard UI */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div className="p-4 border-b border-white/5 flex items-center gap-4">
                 <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                 </div>
                 <div className="h-2 w-32 bg-white/10 rounded-full" />
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                 <div className="bg-white/5 rounded-lg p-4 h-24 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 text-emerald-500"><Activity size={16} /></div>
                    <div className="mt-8 h-2 w-16 bg-emerald-500/50 rounded-full" />
                    <div className="mt-2 h-2 w-24 bg-white/10 rounded-full" />
                 </div>
                 <div className="bg-white/5 rounded-lg p-4 h-24 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 text-teal-500"><Globe size={16} /></div>
                    <div className="mt-8 h-2 w-12 bg-teal-500/50 rounded-full" />
                    <div className="mt-2 h-2 w-20 bg-white/10 rounded-full" />
                 </div>
                 <div className="col-span-2 bg-white/5 rounded-lg h-32 border border-white/5 flex items-end p-4 gap-2">
                    {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-emerald-600/50 to-teal-600/50 rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                 </div>
              </div>
              
              {/* Glow Effect behind the card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur-2xl opacity-20 -z-10 group-hover:opacity-40 transition-opacity" />
           </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Não fique no <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">escuro</span>.
          </h2>
          <p className="text-emerald-100 text-lg max-w-md">
            A plataforma de automação que ilumina seus resultados com inteligência e escala.
          </p>
          
          <div className="flex gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm text-emerald-200">
               <Shield size={16} className="text-emerald-500" />
               Criptografia E2E
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-200">
               <Activity size={16} className="text-teal-500" />
               99.9% Uptime
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#050505] relative overflow-y-auto">
        <div className="w-full max-w-md space-y-8 relative z-10 animate-fade-in my-auto">
          
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4">
              <Zap className="text-white w-6 h-6" fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold text-white">DispZap</h1>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </h2>
            <p className="text-gray-400">
              {isLogin ? 'Insira suas credenciais para acessar o painel.' : 'Preencha os dados abaixo para começar.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nome Completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                    placeholder="Seu nome"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-900/20 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  {isLogin ? 'Entrar' : 'Criar Conta'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#050505] text-gray-500">Ou continue com</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-white/10 rounded-xl shadow-sm text-sm font-medium text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
            </button>
          </div>
        </div>

        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-600/10 rounded-full blur-[100px] pointer-events-none" />
      </div>
    </div>
  );
};

export default Login;