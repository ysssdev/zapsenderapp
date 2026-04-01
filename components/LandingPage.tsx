import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, MessageSquare, Users, BarChart3, ArrowRight, CheckCircle2, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/app');
    } else {
      navigate('/login');
    }
  };

  const handleWhatsAppRedirect = (planName: string, price: number) => {
    const phoneNumber = '5519984445713';
    const message = `Olá! Gostaria de assinar o plano ${planName} (R$ ${price}/mês).`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
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

        <div className="flex items-center gap-3">
          {user ? (
            <button 
              onClick={() => navigate('/app')}
              className="bg-neon-green text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-neon-green/90 hover:shadow-[0_0_20px_rgba(0,255,0,0.4)] transition-all"
            >
              Acessar Painel
            </button>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')}
                className="text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-white/10 transition-all"
              >
                Entrar
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="bg-neon-green text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-neon-green/90 hover:shadow-[0_0_20px_rgba(0,255,0,0.4)] transition-all"
              >
                Registrar
              </button>
            </>
          )}
        </div>
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
          <a 
            href="https://wa.me/5519984445713"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            Contato
          </a>
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

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">Planos Simples e Transparentes.</h2>
             <p className="text-gray-400 max-w-2xl mx-auto">Escolha o plano ideal para o tamanho do seu negócio. Sem taxas ocultas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Starter Plan */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-neon-green/30 transition-all flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <p className="text-gray-400 text-sm mb-6">Para quem está começando a automatizar.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">R$ 799</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-neon-green shrink-0" /> 1 Conexão WhatsApp
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-neon-green shrink-0" /> 2.000 Disparos/mês
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-neon-green shrink-0" /> Limite de 200/dia
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-neon-green shrink-0" /> Upload CSV
                </li>
              </ul>
              <button onClick={() => handleWhatsAppRedirect('Starter', 799)} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors border border-white/10">
                Assinar Starter
              </button>
            </div>

            {/* Pro Plan */}
            <div className="glass-panel p-8 rounded-3xl border border-neon-green/50 relative transform lg:-translate-y-4 shadow-[0_0_30px_rgba(0,255,0,0.1)] flex flex-col">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neon-green text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Mais Popular
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-gray-400 text-sm mb-6">O poder completo para escalar vendas.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">R$ 1500</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-neon-green shrink-0" /> 3 Conexões WhatsApp
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-neon-green shrink-0" /> 10.000 Disparos/mês
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-neon-green shrink-0" /> Agendamento
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-neon-green shrink-0" /> Suporte Prioritário
                </li>
              </ul>
              <button onClick={() => handleWhatsAppRedirect('Pro', 1500)} className="w-full py-3 rounded-xl bg-neon-green hover:bg-neon-green/90 text-black font-bold transition-colors shadow-[0_0_20px_rgba(0,255,0,0.2)]">
                Assinar Pro
              </button>
            </div>

            {/* Business Plan */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-neon-green/30 transition-all flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">Business</h3>
              <p className="text-gray-400 text-sm mb-6">Para operações de alto volume.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">R$ 2000</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-neon-green shrink-0" /> 10 Conexões WhatsApp
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-neon-green shrink-0" /> 50.000 Disparos/mês
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-neon-green shrink-0" /> API de Integração
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-neon-green shrink-0" /> Gerente de Conta
                </li>
              </ul>
              <button onClick={() => handleWhatsAppRedirect('Business', 2000)} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors border border-white/10">
                Assinar Business
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-neon-green/30 transition-all flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-gray-400 text-sm mb-6">Infraestrutura dedicada e exclusiva.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">R$ 3000</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-neon-green shrink-0" /> 50 Conexões WhatsApp
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-neon-green shrink-0" /> 200.000 Disparos/mês
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-neon-green shrink-0" /> White Label
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 size={18} className="text-neon-green shrink-0" /> SLA Garantido
                </li>
              </ul>
              <button onClick={() => handleWhatsAppRedirect('Enterprise', 3000)} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors border border-white/10">
                Assinar Enterprise
              </button>
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
