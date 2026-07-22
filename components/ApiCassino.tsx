import React, { useState } from 'react';
import { Gamepad2, Sparkles, ShoppingCart, Dices, Flame, ShieldAlert, CheckCircle2, Zap, Trophy, ShieldCheck } from 'lucide-react';

const ApiCassino = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'sem-ggr' | 'com-ggr'>('all');

  const handleBuy = () => {
    window.open('https://discord.gg/KJ9KmXay', '_blank');
  };

  const semGgrOptions = [
    {
      title: 'API Sem GGR - PG Soft',
      subtitle: 'Provedor PG Soft (Fortune Tiger, Ox, Rabbit, etc.)',
      desc: 'Integração de jogos PG Soft sem cobrança de porcentagem sobre GGR. Pagamento fixo por requisição/setup.',
      price: 'Consulte no Discord',
      badge: 'Sem Taxa %',
      features: [
        'Fortune Tiger, Rabbit, Ox, Mouse e mais',
        '0% de taxa de Revenue Share (GGR)',
        'Integração rápida via Webhook/Rest API',
        'Suporte técnico e documentação completa'
      ],
      providers: ['Fortune Tiger', 'Fortune Ox', 'Fortune Rabbit', 'Fortune Mouse', 'Dragon Hatch']
    },
    {
      title: 'API Sem GGR - Pragmatic Play (PP)',
      subtitle: 'Provedor Pragmatic Play (Slots & Slots Populares)',
      desc: 'Jogos consagrados da Pragmatic Play integrados diretamente com custo fixo e zero taxa de comissão.',
      price: 'Consulte no Discord',
      badge: 'Sem Taxa %',
      features: [
        'Gates of Olympus, Sweet Bonanza, Starlight Princess',
        'Sem retenção de faturamento/GGR',
        'Alta performance de resposta de API',
        'Atualização contínua de novos títulos'
      ],
      providers: ['Gates of Olympus', 'Sweet Bonanza', 'Starlight Princess', 'Big Bass Splash']
    },
    {
      title: 'API Sem GGR - TaDa Gaming',
      subtitle: 'Provedor TaDa Gaming (Fishing & Slots)',
      desc: 'Acesso completo ao catálogo de jogos de tiro ao peixe e slots da TaDa com integração sem repasse de GGR.',
      price: 'Consulte no Discord',
      badge: 'Sem Taxa %',
      features: [
        'Fishing Games (Ocean King, Fortune Fishing)',
        'Slots e jogos de mesa populares',
        'Integração simples e escalável',
        'Sem taxas adicionais de Revenue Share'
      ],
      providers: ['Fortune Gems', 'Crazy Hunter', 'Mega Fishing', 'Boxing King']
    },
    {
      title: 'API Sem GGR - WG & Outros Provedores',
      subtitle: 'WG Games, Spribe, SmartSoft & Diversos',
      desc: 'Pacote multi-provedores com WG, Spribe (Aviator), SmartSoft e slots variados sem comissão de GGR.',
      price: 'Consulte no Discord',
      badge: 'Combo Premium',
      features: [
        'Aviator, Mines, Spaceman e jogos Crash',
        'WG Games e slots em alta',
        'Ilimitadas requisições com custo fixo',
        'Configuração e auxílio no Discord'
      ],
      providers: ['Aviator', 'Mines', 'Plinko', 'WG Slots']
    }
  ];

  const comGgrOptions = [
    {
      title: 'API com GGR - PG Soft',
      subtitle: 'Provedor PG Soft com Repasse de GGR',
      desc: 'Modo de parceria com % de GGR reduzida e suporte total à infraestrutura e jogos atualizados da PG Soft.',
      price: 'Consulte no Discord',
      badge: 'GGR Reduzido',
      features: [
        'Catálogo PG Soft 100% atualizado',
        'Porcentagem de GGR super competitiva',
        'Sem taxa alta de setup inicial',
        'Painel de controle e relatório de métricas'
      ],
      providers: ['Fortune Tiger', 'Fortune Ox', 'Fortune Rabbit', 'Ganesha Gold']
    },
    {
      title: 'API com GGR - Pragmatic Play (PP)',
      subtitle: 'Provedor Pragmatic Play + Live Slots',
      desc: 'Traga o catálogo da PP para a sua iFrame/API com taxas otimizadas de GGR e estabilidade máxima.',
      price: 'Consulte no Discord',
      badge: 'GGR Otimizado',
      features: [
        'Slots clássicos + Novos lançamentos diários',
        'Métricas de apostas em tempo real',
        'Baixa latência para partidas rápidas',
        'Suporte dedicado 24/7'
      ],
      providers: ['Gates of Olympus', 'Sweet Bonanza', 'Dog House', 'Sugar Rush']
    },
    {
      title: 'API com GGR - TaDa Gaming',
      subtitle: 'Provedor TaDa Gaming + Arcade & Fishing',
      desc: 'Suporte completo para jogos de arcade, slots e fishing da TaDa Gaming sob modelo com porcentagem de GGR.',
      price: 'Consulte no Discord',
      badge: 'Alta Conversão',
      features: [
        'Jogos de peixe com altíssimo engajamento',
        'Modelos flexíveis de comissão GGR',
        'Servidores de alta disponibilidade',
        'Fácil conexão via API Key'
      ],
      providers: ['Fortune Gems 2', 'Jackpot Fishing', 'Golden Empire']
    },
    {
      title: 'API com GGR - Cassino Ao Vivo (Live)',
      subtitle: 'Roletas, Blackjack, Baccarat & Game Shows',
      desc: 'Transmissão ao vivo em alta definição com crupiês reais (Roletas Brasileiras, Blackjack, Mega Wheel e mais).',
      price: 'Consulte no Discord',
      badge: 'Ao Vivo VIP',
      features: [
        'Roleta Brasileira com Crupiê ao vivo',
        'Blackjack, Baccarat e Game Shows',
        'Provedores líderes (Evolution, Pragmatic Live)',
        'Qualidade Full HD e transmissão contínua'
      ],
      providers: ['Roleta Brasileira', 'Speed Baccarat', 'Blackjack VIP', 'Mega Wheel']
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-xs font-semibold mb-3">
            <Sparkles size={12} className="animate-pulse" /> Integrações & Soluções API Cassino
          </div>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">API Cassino</h2>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            Escolha o modelo ideal para a sua plataforma de jogos: **API Sem GGR** (custo fixo sem porcentagem) ou **API Com GGR** (modelo de Revenue Share com catálogos atualizados e Cassino Ao Vivo).
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 bg-[#080808] p-1.5 rounded-2xl border border-white/5 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-neon-green text-black shadow-[0_0_12px_rgba(57,255,20,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setActiveTab('sem-ggr')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sem-ggr'
                ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            API Sem GGR
          </button>
          <button
            onClick={() => setActiveTab('com-ggr')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'com-ggr'
                ? 'bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            API Com GGR
          </button>
        </div>
      </div>

      {/* SECTION 1: API SEM GGR */}
      {(activeTab === 'all' || activeTab === 'sem-ggr') && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Zap size={18} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                APIs Sem GGR <span className="text-xs font-normal text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">Custo Fixo / Zero %</span>
              </h3>
              <p className="text-gray-400 text-xs">Sem cobrança sobre o faturamento do cassino (PG, PP, TaDa, WG, etc.).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {semGgrOptions.map((opt, idx) => (
              <div 
                key={idx} 
                className="glass-panel relative rounded-2xl border border-white/5 bg-[#070707] hover:border-cyan-500/30 transition-all duration-300 p-6 flex flex-col justify-between group overflow-hidden"
              >
                <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-cyan-500/10 blur-3xl transition-all group-hover:scale-125 duration-500" />

                <div>
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {opt.badge}
                    </span>
                    <Gamepad2 className="text-cyan-400 w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>

                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                    {opt.title}
                  </h4>
                  <p className="text-[11px] font-medium text-cyan-300/80 mb-2">{opt.subtitle}</p>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4 min-h-[42px]">
                    {opt.desc}
                  </p>

                  <div className="border-t border-white/5 my-3" />

                  <div className="mb-4">
                    <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1.5">Jogos Inclusos:</span>
                    <div className="flex flex-wrap gap-1">
                      {opt.providers.map((p, pidx) => (
                        <span key={pidx} className="text-[10px] bg-white/5 text-gray-300 px-2 py-0.5 rounded border border-white/5">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {opt.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-2 text-[11px] text-gray-300">
                        <CheckCircle2 size={12} className="text-cyan-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-xs text-gray-500 font-medium">Preço</span>
                    <span className="text-base font-display font-extrabold tracking-tight text-cyan-400">
                      {opt.price}
                    </span>
                  </div>

                  <button
                    onClick={handleBuy}
                    className="w-full font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 bg-cyan-500 text-black border border-transparent hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] text-sm"
                  >
                    <ShoppingCart size={16} />
                    Consultar & Comprar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: API COM GGR */}
      {(activeTab === 'all' || activeTab === 'com-ggr') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Trophy size={18} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                APIs Com GGR <span className="text-xs font-normal text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">Revenue Share / % GGR</span>
              </h3>
              <p className="text-gray-400 text-xs">Modelo com comissão sobre faturamento, incl. Cassino Ao Vivo, PG, PP, TaDa e mais.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {comGgrOptions.map((opt, idx) => (
              <div 
                key={idx} 
                className="glass-panel relative rounded-2xl border border-white/5 bg-[#070707] hover:border-purple-500/30 transition-all duration-300 p-6 flex flex-col justify-between group overflow-hidden"
              >
                <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl transition-all group-hover:scale-125 duration-500" />

                <div>
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {opt.badge}
                    </span>
                    <Dices className="text-purple-400 w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>

                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                    {opt.title}
                  </h4>
                  <p className="text-[11px] font-medium text-purple-300/80 mb-2">{opt.subtitle}</p>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4 min-h-[42px]">
                    {opt.desc}
                  </p>

                  <div className="border-t border-white/5 my-3" />

                  <div className="mb-4">
                    <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1.5">Principais Títulos:</span>
                    <div className="flex flex-wrap gap-1">
                      {opt.providers.map((p, pidx) => (
                        <span key={pidx} className="text-[10px] bg-white/5 text-gray-300 px-2 py-0.5 rounded border border-white/5">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {opt.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-2 text-[11px] text-gray-300">
                        <CheckCircle2 size={12} className="text-purple-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-xs text-gray-500 font-medium">Preço</span>
                    <span className="text-base font-display font-extrabold tracking-tight text-purple-400">
                      {opt.price}
                    </span>
                  </div>

                  <button
                    onClick={handleBuy}
                    className="w-full font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 bg-purple-500 text-white border border-transparent hover:bg-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] text-sm"
                  >
                    <ShoppingCart size={16} />
                    Consultar & Comprar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Information Panel */}
      <div className="glass-panel p-5 rounded-2xl border border-white/5 flex gap-4 items-start bg-white/5">
        <ShieldCheck size={24} className="text-neon-green shrink-0 mt-0.5" />
        <div>
          <h4 className="text-white font-bold text-sm">Informações de Integração & Suporte</h4>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed">
            Todas as nossas soluções de **API Cassino** (Com GGR e Sem GGR) contam com infraestrutura de alta disponibilidade, baixa latência e integração nativa para a sua plataforma. Para consultar tabelas de preços, pacotes de requisições, documentação técnica da API e tirar dúvidas sobre a contratação, entre em contato diretamente com nossa equipe no Discord.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiCassino;
