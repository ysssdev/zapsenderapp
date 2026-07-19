import React from 'react';
import { Target, TrendingUp, ShieldAlert, Sparkles, ShoppingCart } from 'lucide-react';

const TikTokAds = () => {
  const handleBuy = () => {
    window.open('https://discord.gg/KJ9KmXay', '_blank');
  };

  const options = [
    {
      title: 'TikTok Restabelecida 1x',
      desc: 'Conta de anúncio TikTok Ads restabelecida de alto score. Pronta para anunciar de imediato com aquecimento prévio.',
      price: 'Consulte no Discord',
      badge: 'Popular',
      features: ['Conta verificada e restabelecida', 'Alta reputação (Trust Score)', 'Suporte pós-compra', 'Ideal para iniciantes'],
      type: 'restabelecida'
    },
    {
      title: 'TikTok Restabelecida 2x',
      desc: 'Pacote com 2 contas de anúncio restabelecidas. Excelente redundância para suas campanhas de alta escala.',
      price: 'Consulte no Discord',
      badge: 'Melhor Custo-Benefício',
      features: ['Duas contas prontas para uso', 'Aquecimento estratégico individual', 'Suporte prioritário', 'Redundância contra bloqueios'],
      type: 'restabelecida'
    },
    {
      title: 'TikTok Restabelecida 3x',
      desc: 'Super combo com 3 contas restabelecidas de alta resiliência. Estrutura completa de contingência para grandes operações.',
      price: 'Consulte no Discord',
      badge: 'Contingência Máxima',
      features: ['Três contas de alto escalonamento', 'Perfis aquecidos profissionalmente', 'Atendimento VIP', 'Blindagem completa contra contingências'],
      type: 'restabelecida'
    },
    {
      title: 'TikTok BC 30',
      desc: 'Business Center TikTok Ads com limite diário de R$ 30k. Ideal para lançamentos e escalonamento controlado.',
      price: 'Consulte no Discord',
      badge: 'Escala Inicial',
      features: ['Business Center Verificado', 'Limite diário de até R$ 30.000', 'Compartilhamento de pixels', 'Conexão facilitada de novas contas'],
      type: 'bc'
    },
    {
      title: 'TikTok BC 60',
      desc: 'Business Center TikTok Ads com limite diário de R$ 60k. Perfeito para agências e infoprodutores de médio porte.',
      price: 'Consulte no Discord',
      badge: 'Escala Avançada',
      features: ['Business Center de Alta Maturidade', 'Limite diário de até R$ 60.000', 'Acesso a recursos exclusivos', 'Compartilhamento estendido de ativos'],
      type: 'bc'
    },
    {
      title: 'TikTok BC 90',
      desc: 'Business Center TikTok Ads de nível corporativo com limite diário de R$ 90k+. Máxima capacidade de tração.',
      price: 'Consulte no Discord',
      badge: 'Elite Operações',
      features: ['Business Center Corporativo VIP', 'Limite diário de até R$ 90.000 ou ilimitado', 'Suporte exclusivo e direto', 'Máxima imunidade a flutuações de plataforma'],
      type: 'bc'
    },
    {
      title: 'Documentos Europa',
      desc: 'Documentos europeus de alta qualidade para verificação e contingência em plataformas de anúncios.',
      price: 'Consulte no Discord',
      badge: 'Verificação',
      features: ['Documentos completos e consistentes', 'Alta taxa de aprovação nas plataformas', 'Essencial para rodar contas europeias', 'Suporte e dicas de utilização'],
      type: 'docs'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-left max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
          <Sparkles size={12} className="animate-pulse" /> TikTok Ads Contingência & Performance
        </div>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">TikTok Ads</h2>
        <p className="text-gray-400 text-sm mt-2 leading-relaxed">
          Adquira perfis restabelecidos de alto score e Business Centers (BC) blindados para escalar suas campanhas de tráfego pago sem quedas ou interrupções.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((opt, idx) => (
          <div 
            key={idx} 
            className="glass-panel relative rounded-2xl border border-white/5 bg-[#070707] hover:border-cyan-500/30 transition-all duration-300 p-6 flex flex-col justify-between group overflow-hidden"
          >
            {/* Visual background glow for TikTok theme */}
            <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full opacity-10 blur-3xl transition-all group-hover:scale-125 duration-500 ${
              opt.type === 'restabelecida' ? 'bg-cyan-400' : opt.type === 'bc' ? 'bg-pink-500' : 'bg-purple-500'
            }`} />

            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                  opt.type === 'restabelecida' 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : opt.type === 'bc' 
                    ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                }`}>
                  {opt.badge}
                </span>
                {opt.type === 'restabelecida' ? (
                  <TrendingUp className="text-cyan-400 w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
                ) : opt.type === 'bc' ? (
                  <Target className="text-pink-400 w-5 h-5 group-hover:scale-110 transition-transform" />
                ) : (
                  <ShieldAlert className="text-purple-400 w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
              </div>

              {/* Title & Desc */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
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
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      opt.type === 'restabelecida' ? 'bg-cyan-400' : opt.type === 'bc' ? 'bg-pink-400' : 'bg-purple-400'
                    }`} />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price & Buy Button */}
            <div className="mt-auto pt-4 border-t border-white/5">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs text-gray-500 font-medium">Preço</span>
                <span className={`text-base font-display font-extrabold tracking-tight ${
                  opt.type === 'restabelecida' ? 'text-cyan-400' : opt.type === 'bc' ? 'text-pink-400' : 'text-purple-400'
                }`}>
                  {opt.price}
                </span>
              </div>
              
              <button
                onClick={handleBuy}
                className={`w-full font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 border text-sm ${
                  opt.type === 'restabelecida'
                    ? 'bg-cyan-500 text-black border-transparent hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : opt.type === 'bc'
                    ? 'bg-pink-500 text-white border-transparent hover:bg-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                    : 'bg-purple-500 text-white border-transparent hover:bg-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                }`}
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
        <ShieldAlert size={24} className="text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-white font-bold text-sm">Garantia e Regras de Substituição</h4>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed">
            Todas as nossas contas do TikTok Ads possuem garantia total de acesso e primeira atividade. Caso haja qualquer bloqueio antes do primeiro gasto ou problemas de vinculação no BC, garantimos a substituição rápida e gratuita do seu ativo em até 24 horas. Entre em contato diretamente pelo Discord.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TikTokAds;
