import React from 'react';
import { Car, ShieldAlert, Sparkles, ShoppingCart, Landmark, DollarSign, CheckCircle2 } from 'lucide-react';

const GringoApp = () => {
  const handleBuy = () => {
    window.open('https://discord.gg/NKDw4d3P', '_blank');
  };

  const options = [
    {
      title: 'GringoApp Saldo 5k a 10k',
      desc: 'Conta GringoApp com saldo garantido entre R$ 5.000 e R$ 10.000. Perfeita para pagamentos de licenciamento anual e multas leves/médias.',
      price: 'Consulte no Discord',
      badge: 'Essencial',
      features: [
        'Saldo garantido de R$ 5.000 a R$ 10.000',
        'Pagamento de IPVA, Licenciamento e Multas',
        'Acesso imediato e seguro à conta',
        'Suporte dedicado via Discord'
      ],
      colorTheme: 'green'
    },
    {
      title: 'GringoApp Saldo 10k a 20k',
      desc: 'Conta GringoApp com saldo garantido entre R$ 10.000 e R$ 20.000. Excelente para frotas leves ou veículos com IPVA e multas acumuladas de alto valor.',
      price: 'Consulte no Discord',
      badge: 'Recomendado',
      features: [
        'Saldo garantido de R$ 10.000 a R$ 20.000',
        'Suporta parcelamentos e taxas estaduais',
        'Garantia de aprovação de pagamentos',
        'Suporte prioritário 24/7'
      ],
      colorTheme: 'blue'
    },
    {
      title: 'GringoApp Saldo 20k a 30k',
      desc: 'Nossa maior conta GringoApp com saldo garantido entre R$ 20.000 e R$ 30.000. Ideal para frotas completas, revendedores ou quitação integral de débitos de luxo.',
      price: 'Consulte no Discord',
      badge: 'Premium Elite',
      features: [
        'Saldo garantido de R$ 20.000 a R$ 30.000',
        'Quitação de múltiplos veículos simultaneamente',
        'Acompanhamento VIP na compensação',
        'Garantia estendida de funcionamento'
      ],
      colorTheme: 'purple'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-left max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-xs font-semibold mb-3">
          <Sparkles size={12} className="animate-pulse" /> Contas GringoApp Premium
        </div>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">Contas GringoApp</h2>
        <p className="text-gray-400 text-sm mt-2 leading-relaxed">
          Adquira contas GringoApp com saldos pré-carregados para pagamento facilitado de IPVA, multas de trânsito, taxas de licenciamento e regularização de veículos de forma 100% prática.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((opt, idx) => (
          <div 
            key={idx} 
            className="glass-panel relative rounded-2xl border border-white/5 bg-[#070707] hover:border-neon-green/30 transition-all duration-300 p-6 flex flex-col justify-between group overflow-hidden"
          >
            {/* Visual background glow based on package type */}
            <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full opacity-10 blur-3xl transition-all group-hover:scale-125 duration-500 ${
              opt.colorTheme === 'green' ? 'bg-emerald-400' : opt.colorTheme === 'blue' ? 'bg-cyan-400' : 'bg-purple-500'
            }`} />

            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                  opt.colorTheme === 'green' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : opt.colorTheme === 'blue'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                }`}>
                  {opt.badge}
                </span>
                {opt.colorTheme === 'green' ? (
                  <Car className="text-emerald-400 w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
                ) : opt.colorTheme === 'blue' ? (
                  <Landmark className="text-cyan-400 w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
                ) : (
                  <DollarSign className="text-purple-400 w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
                )}
              </div>

              {/* Title & Desc */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-green transition-colors">
                {opt.title}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-4 min-h-[48px]">
                {opt.desc}
              </p>

              {/* Divider */}
              <div className="border-t border-white/5 my-4" />

              {/* Features list */}
              <ul className="space-y-2 mb-6">
                {opt.features.map((feat, fidx) => (
                  <li key={fidx} className="flex items-center gap-2 text-[11px] text-gray-300">
                    <CheckCircle2 size={12} className={
                      opt.colorTheme === 'green' ? 'text-emerald-400' : opt.colorTheme === 'blue' ? 'text-cyan-400' : 'text-purple-400'
                    } />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price & Buy Button */}
            <div className="mt-auto pt-4 border-t border-white/5">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs text-gray-500 font-medium">Preço</span>
                <span className="text-base font-display font-extrabold tracking-tight text-neon-green">
                  {opt.price}
                </span>
              </div>
              
              <button
                onClick={handleBuy}
                className="w-full font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 border bg-neon-green text-black border-transparent hover:bg-neon-green/90 hover:shadow-[0_0_15px_rgba(57,255,20,0.4)] text-sm"
              >
                <ShoppingCart size={16} />
                Comprar no Discord
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Notice */}
      <div className="glass-panel p-5 rounded-2xl border border-white/5 flex gap-4 items-start bg-white/5">
        <ShieldAlert size={24} className="text-neon-green shrink-0 mt-0.5" />
        <div>
          <h4 className="text-white font-bold text-sm">Informações Importantes & Instruções de Uso</h4>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed">
            Todas as contas GringoApp são enviadas com os dados de acesso completos e validados. Os saldos fornecidos nas contas são garantidos para a finalidade de abatimento e pagamento de taxas estaduais (IPVA, Licenciamento e Multas registradas na plataforma). A compensação dos débitos ocorre no prazo oficial do órgão de trânsito competente (geralmente entre 24h e 72h úteis). Em caso de qualquer dúvida operacional, oferecemos suporte integral direto no nosso canal de atendimento no Discord.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GringoApp;
