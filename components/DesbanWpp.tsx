import React from 'react';
import { Smartphone, ShieldAlert, Sparkles, ShoppingCart, Clock, CheckCircle2, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';

const DesbanWpp = () => {
  const handleRedirect = () => {
    window.open('https://discord.gg/pxPcmgVg', '_blank');
  };

  const services = [
    {
      title: 'Desbanimento WhatsApp 24H',
      subtitle: 'Recuperação de Número Banido Recente',
      desc: 'Análise e processo de desbanimento especializado para números com bloqueio recente. Atendimento direto e suporte especializado.',
      badge: 'Atendimento 24H',
      features: [
        'Análise especializada do tipo de bloqueio',
        'Prioridade alta no atendimento via Discord',
        'Acompanhamento do status de liberação',
        'Orientação técnica pós-recuperação'
      ]
    },
    {
      title: 'Análise & Consultoria de Contingência',
      subtitle: 'Suporte Técnico e Proteção de Instâncias',
      desc: 'Aprenda e configure sua estrutura para mitigar novos banimentos em disparos de mensagens e campanhas.',
      badge: 'Consultoria',
      features: [
        'Boas práticas de aquecimento de chips',
        'Análise de qualidade de instâncias',
        'Dicas de rotatividade de números',
        'Suporte direto no servidor do Discord'
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-left max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-xs font-semibold mb-3">
          <Sparkles size={12} className="animate-pulse" /> Serviço Especializado
        </div>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">DesBan Wpp</h2>
        <p className="text-gray-400 text-sm mt-2 leading-relaxed">
          Serviço de recuperação e consultoria para números de WhatsApp banidos. Entre em contato no nosso servidor oficial no Discord para consultar valores, viabilidade e iniciar o procedimento.
        </p>
      </div>

      {/* Critical Alert Banner requested by user */}
      <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Clock size={22} className="animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
              Requisito Obrigatório
            </span>
            <h3 className="text-lg font-bold text-white">
              Apenas números que estão nas 24Horas
            </h3>
            <p className="text-gray-300 text-xs mt-0.5">
              Aceitamos apenas solicitações de números cujo bloqueio ocorreu dentro das últimas 24 horas.
            </p>
          </div>
        </div>

        <button
          onClick={handleRedirect}
          className="shrink-0 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-2"
        >
          <MessageSquare size={16} />
          Consultar no Discord
        </button>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, idx) => (
          <div 
            key={idx}
            className="glass-panel relative rounded-2xl border border-white/5 bg-[#070707] hover:border-neon-green/30 transition-all duration-300 p-6 flex flex-col justify-between group overflow-hidden"
          >
            <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-neon-green/10 blur-3xl transition-all group-hover:scale-125 duration-500" />

            <div>
              <div className="flex items-start justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-neon-green/10 text-neon-green border border-neon-green/20">
                  {service.badge}
                </span>
                <Smartphone className="text-neon-green w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>

              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-neon-green transition-colors">
                {service.title}
              </h3>
              <p className="text-xs font-medium text-emerald-400 mb-2">{service.subtitle}</p>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">
                {service.desc}
              </p>

              <div className="border-t border-white/5 my-4" />

              <ul className="space-y-2 mb-6">
                {service.features.map((feat, fidx) => (
                  <li key={fidx} className="flex items-center gap-2 text-[11px] text-gray-300">
                    <CheckCircle2 size={13} className="text-neon-green shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs text-gray-500 font-medium">Valor / Informações</span>
                <span className="text-sm font-display font-bold text-neon-green">
                  Consulte no Discord
                </span>
              </div>

              <button
                onClick={handleRedirect}
                className="w-full font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 bg-neon-green text-black border border-transparent hover:bg-neon-green/90 hover:shadow-[0_0_15px_rgba(57,255,20,0.4)] text-sm"
              >
                <ShoppingCart size={16} />
                Comprar & Consultar no Discord
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="glass-panel p-5 rounded-2xl border border-white/5 flex gap-4 items-start bg-white/5">
        <ShieldCheck size={24} className="text-neon-green shrink-0 mt-0.5" />
        <div>
          <h4 className="text-white font-bold text-sm">Como funciona o atendimento?</h4>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed">
            Ao clicar no botão de consulta, você será redirecionado para a comunidade e suporte no Discord. Informe o seu número banido (respeitando o limite de até 24 horas de bloqueio) e nossa equipe fornecerá todas as instruções e informações necessárias para o procedimento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesbanWpp;
