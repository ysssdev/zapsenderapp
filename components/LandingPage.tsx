import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, MessageSquare, Users, BarChart3, ArrowRight, CheckCircle2, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const handleGetStarted = async () => {
    if (user) {
      navigate('/app');
    } else {
      try {
        await login();
        navigate('/app');
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 font-sans selection:bg-neon-green/30 selection:text-neon-green overflow-x-hidden">
      
      {/* Floating Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neon-green/20 flex items-center justify-center border border-neon-green/50 neon-glow">
            <Zap size={18} className="text-neon-green" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">ZapSender</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-neon-green transition-colors">Recursos</a>
          <a href="#how-it-works" className="hover:text-neon-green transition-colors">Como Funciona</a>
          <a href="#pricing" className="hover:text-neon-green transition-colors">Planos</a>
        </div>

        <button 
          onClick={handleGetStarted}
          className="bg-neon-green text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-neon-green/90 hover:shadow-[0_0_20px_rgba(0,255,0,0.4)] transition-all"
        >
          {user ? 'Acessar Painel' : 'Entrar'}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 flex flex-col items-center justify-center text-center min-h-[90vh]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-hero-glow opacity-20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-xs font-mono mb-8 neon-border">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          V2.0 DISPONÍVEL AGORA
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] max-w-4xl mb-6">
          Automação de WhatsApp <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple neon-text">
            Elevada ao Máximo.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
          Escale suas vendas, extraia leads de grupos e envie campanhas em massa com a plataforma mais tecnológica e segura do mercado.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={handleGetStarted}
            className="w-full sm:w-auto bg-neon-green text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-neon-green/90 hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] transition-all flex items-center justify-center gap-2"
          >
            Começar Agora <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            Ver Demonstração
          </button>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-20 relative w-full max-w-5xl mx-auto perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
          <div className="glass-panel rounded-t-2xl border-b-0 overflow-hidden transform rotate-x-12 scale-105 shadow-[0_-20px_50px_rgba(0,255,0,0.1)]">
            <div className="h-8 bg-black/50 border-b border-white/10 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="p-4 grid grid-cols-4 gap-4 opacity-50">
               <div className="h-24 bg-white/5 rounded-xl border border-white/10" />
               <div className="h-24 bg-white/5 rounded-xl border border-white/10" />
               <div className="h-24 bg-white/5 rounded-xl border border-white/10" />
               <div className="h-24 bg-white/5 rounded-xl border border-white/10" />
               <div className="col-span-3 h-64 bg-white/5 rounded-xl border border-white/10" />
               <div className="col-span-1 h-64 bg-white/5 rounded-xl border border-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">Poder Absoluto.</h2>
             <p className="text-gray-400 max-w-2xl mx-auto">Tudo que você precisa para dominar o WhatsApp Marketing em uma única interface futurista.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-8 rounded-3xl hover:border-neon-cyan/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-neon-cyan/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare size={28} className="text-neon-cyan" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Disparos em Massa</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Envie milhares de mensagens com delay inteligente, variáveis personalizadas e simulação de digitação para evitar bloqueios.</p>
            </div>

            <div className="glass-panel p-8 rounded-3xl hover:border-neon-purple/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-neon-purple/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} className="text-neon-purple" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Extrator de Grupos</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Capture leads altamente qualificados dos seus grupos com um clique e salve diretamente no seu CRM integrado.</p>
            </div>

            <div className="glass-panel p-8 rounded-3xl hover:border-neon-green/50 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-neon-green/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone size={28} className="text-neon-green" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Multi-Instâncias</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Conecte múltiplos números de WhatsApp simultaneamente via QR Code ou API Oficial da Meta.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-neon-green" />
            <span className="font-display font-bold text-xl text-white">ZapSender</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 ZapSender. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
