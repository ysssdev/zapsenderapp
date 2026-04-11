import React, { useState } from 'react';
import { PLANS } from '../constants';
import { Check, Zap, ShoppingCart } from 'lucide-react';

const CREDIT_PACKAGES = [
  { id: 1, credits: 5000, price: 150 },
  { id: 2, credits: 20000, price: 450, popular: true },
  { id: 3, credits: 100000, price: 900 },
];

const Billing = () => {
  const [selectedPackageId, setSelectedPackageId] = useState<number>(2);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('PRO');

  const selectedPackage = CREDIT_PACKAGES.find(p => p.id === selectedPackageId) || CREDIT_PACKAGES[1];

  const handleWhatsAppRedirect = (type: 'plan' | 'credits', details: any) => {
    window.open(`https://discord.gg/DNk4T4KT`, '_blank');
  };

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-4">Escolha o plano ideal para escalar</h2>
        <p className="text-gray-400">Upgrade instantâneo. Cancele a qualquer momento. Preços transparentes.</p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {Object.values(PLANS).map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          
          return (
            <div 
              key={plan.id} 
              onClick={() => setSelectedPlanId(plan.id)}
              className={`glass-panel p-6 rounded-2xl relative flex flex-col transition-all duration-300 cursor-pointer ${
                isSelected 
                  ? 'border-neon-green-500 shadow-[0_0_30px_rgba(16,185,129,0.15)] scale-[1.02] z-10 bg-[#0a0a0a] border-white/5' 
                  : 'border-white/10 hover:border-emerald-200 dark:hover:border-emerald-500/50 hover:bg-white/5'
              }`}
            >
              {plan.id === 'PRO' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-neon-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  MAIS POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-lg font-medium ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>{plan.name}</h3>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold text-white">R$ {plan.price}</span>
                  <span className="text-gray-400 ml-2">/mês</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className={`p-1 rounded ${isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}><Zap size={14} /></div>
                  <span><strong className="text-white">{plan.monthlyCredits.toLocaleString()}</strong> créditos/mês</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className={`p-1 rounded ${isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}><Zap size={14} /></div>
                  <span><strong className="text-white">{plan.dailyLimit.toLocaleString()}</strong> envios/dia</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className={`p-1 rounded ${isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}><Zap size={14} /></div>
                  <span><strong className="text-white">{plan.instances}</strong> instâncias</span>
                </div>
                
                <div className="h-px bg-white/20 my-4" />
                
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
                    <Check size={16} className={isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-500/70 dark:text-emerald-400/70'} />
                    {feature}
                  </div>
                ))}
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (isSelected) {
                    handleWhatsAppRedirect('plan', plan);
                  } else {
                    setSelectedPlanId(plan.id);
                  }
                }}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-900/20' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}>
                {isSelected ? 'Assinar Agora' : 'Selecionar'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Extra Credits */}
      <div className="glass-panel p-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-900/5 to-teal-900/5 dark:from-emerald-900/20 dark:to-teal-900/20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">Precisa de mais créditos?</h3>
            <p className="text-gray-400 mb-6 max-w-lg">
              Adicione pacotes avulsos sem alterar seu plano mensal. Os créditos nunca expiram e são utilizados apenas quando sua cota mensal acaba.
            </p>
            
            <button 
              onClick={() => handleWhatsAppRedirect('credits', selectedPackage)}
              className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-700 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center gap-2 mx-auto lg:mx-0 transform hover:scale-[1.02] active:scale-95">
               <ShoppingCart size={18} />
               Comprar {selectedPackage.credits.toLocaleString()} por R$ {selectedPackage.price.toFixed(2).replace('.', ',')}
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
             {CREDIT_PACKAGES.map((pkg) => (
               <div 
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`bg-\[#0a0a0a\] border rounded-xl p-5 min-w-[160px] text-center cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                    selectedPackageId === pkg.id 
                      ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-105 z-10' 
                      : 'border-white/10 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:bg-white/5 opacity-70 hover:opacity-100'
                  }`}
               >
                  {selectedPackageId === pkg.id && (
                    <div className="absolute inset-0 bg-emerald-500/10 animate-pulse pointer-events-none" />
                  )}
                  <div className="relative z-10 pointer-events-none">
                    <div className="text-2xl font-bold text-white mb-1">{pkg.credits.toLocaleString()}</div>
                    <div className={`text-sm font-bold ${selectedPackageId === pkg.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-emerald-600 dark:text-emerald-500'}`}>
                      R$ {pkg.price.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;