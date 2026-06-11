import React from 'react';
import { Shield, Check } from 'lucide-react';

const CLOACKER_PLANS = [
  {
    id: 'plan_1',
    name: 'Plano Básico',
    price: 500,
    features: [
      '100.000 requisições',
      'Campanhas ilimitadas',
      '2 Domínios',
      'Todos os filtros',
      'Encriptador de textos *',
      'Removedor de metadados *',
      '90 dias de histórico de requisições',
      'Suporte via chat',
      'Suporte via Whatsapp'
    ]
  },
  {
    id: 'plan_2',
    name: 'Plano Avançado',
    price: 900,
    popular: true,
    features: [
      'Campanhas ilimitadas',
      '8 Domínios',
      'Todos os filtros',
      'Integrações via PHP, Javascript, Wordpress e Domínio',
      'Encriptador de textos *',
      'Removedor de metadados *',
      'Clonador de páginas *',
      'Gerador de página segura *',
      '120 dias de histórico de requisições',
      'Suporte via chat',
      'Suporte via Whatsapp'
    ]
  }
];

const Cloacker = () => {
  const handleRedirect = () => {
    // Redireciona para o link de suporte/checkout especificado nas tarefas anteriores
    window.open('https://discord.gg/StvH3r4J', '_blank');
  };

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      <div className="text-center max-w-2xl mx-auto mt-4">
        <div className="inline-flex items-center justify-center p-3 bg-neon-green/10 rounded-2xl mb-4">
          <Shield className="text-neon-green" size={32} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Cloacker Pro</h2>
        <p className="text-gray-400">
          Proteja profissionalmente suas campanhas, filtre tráfego de bots e aprimore a segurança
          dos seus links com nossa tecnologia de ponta.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row justify-center gap-8 max-w-5xl mx-auto items-stretch">
        {CLOACKER_PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`glass-panel p-8 rounded-3xl relative flex flex-col flex-1 transition-all duration-300 ${
              plan.popular 
                ? 'border-neon-green/50 shadow-[0_0_40px_rgba(0,255,128,0.15)] bg-gradient-to-b from-[#111111] to-[#0a0a0a] scale-[1.02] z-10' 
                : 'border-white/10 hover:border-emerald-500/30 hover:bg-white/5 bg-[#0a0a0a]/50'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-neon-green to-emerald-500 text-black text-xs font-bold px-5 py-1.5 rounded-full shadow-lg tracking-wider">
                MAIS COMPLETO
              </div>
            )}
            
            <div className="mb-6 flex flex-col gap-2">
              <h3 className={`text-xl font-medium ${plan.popular ? "text-neon-green" : "text-emerald-500"}`}>
                {plan.name}
              </h3>
            </div>
            
            <div className="flex items-baseline mb-8">
              <span className="text-5xl font-black text-white">R$ {plan.price}</span>
              <span className="text-gray-500 ml-2 font-medium">/mês</span>
            </div>

            <div className="flex-1 space-y-4 mb-10">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <Check size={20} className={`shrink-0 mt-0 ${plan.popular ? 'text-neon-green' : 'text-emerald-500/70'}`} />
                  <span className="leading-tight">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={handleRedirect}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                plan.popular
                  ? 'bg-neon-green text-black hover:bg-neon-green/90 shadow-[0_0_20px_rgba(0,255,128,0.2)] hover:scale-[1.02] active:scale-95'
                  : 'bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20'
              }`}
            >
              Adquirir Plano
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cloacker;
