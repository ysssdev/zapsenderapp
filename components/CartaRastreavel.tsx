import React, { useState } from 'react';
import { Mail, Globe2, PlusCircle, CreditCard } from 'lucide-react';

const CartaRastreavel = () => {
  const [region, setRegion] = useState('europa');
  const [formData, setFormData] = useState({
    nome: '',
    peso: '',
    dataEntrega: ''
  });

  const handleRedirect = () => {
    window.open('https://discord.gg/24RFe9nv', '_blank');
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    // Simula a tentativa de gerar, mas redireciona para comprar créditos.
    alert('Créditos insuficientes! Você precisa de 1 crédito para gerar um rastreio.');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-neon-cyan/20 border border-neon-cyan/50 rounded-2xl flex items-center justify-center mx-auto mb-4 neon-glow">
          <Mail className="text-neon-cyan w-8 h-8" />
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-2">Carta Rastreável</h1>
        <p className="text-gray-400">Gere códigos de rastreio internacionais (Europa e América do Norte).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-3xl border border-white/5">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Globe2 className="text-neon-cyan" />
              Detalhes do Rastreio
            </h2>

            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Região Base</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setRegion('europa')}
                      className={`flex-1 py-3 px-4 rounded-xl border font-medium transition-all ${
                        region === 'europa' 
                          ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan' 
                          : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Europa
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegion('america_norte')}
                      className={`flex-1 py-3 px-4 rounded-xl border font-medium transition-all ${
                        region === 'america_norte' 
                          ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan' 
                          : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      América do Norte
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Nome do Destinatário</label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Ex: John Doe"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.peso}
                      onChange={(e) => setFormData({...formData, peso: e.target.value})}
                      placeholder="Ex: 0.5"
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Data de Entrega</label>
                    <input
                      type="date"
                      required
                      value={formData.dataEntrega}
                      onChange={(e) => setFormData({...formData, dataEntrega: e.target.value})}
                      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-6 border-t border-white/5 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-neon-cyan hover:bg-neon-cyan/90 text-black font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                >
                  <PlusCircle size={20} />
                  Gerar Código (1 Crédito)
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 select-none">
            <h3 className="text-lg font-bold text-white mb-4">Seus Créditos</h3>
            <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-white/5 flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Saldo Atual</p>
                <div className="text-3xl font-bold text-white leading-none">0</div>
              </div>
              <div className="w-12 h-12 bg-neon-cyan/10 rounded-full flex items-center justify-center text-neon-cyan">
                <CreditCard size={24} />
              </div>
            </div>
            
            <button
              onClick={handleRedirect}
              className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Adicionar Créditos
            </button>
          </div>
          
          <div className="glass-panel p-6 rounded-3xl border border-neon-cyan/20 bg-neon-cyan/5">
            <h4 className="font-bold text-neon-cyan mb-2">Como funciona?</h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              O sistema gera um código de rastreamento internacional realista baseado na região selecionada. O consumo é de 1 crédito por cada código único gerado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartaRastreavel;
