import React from 'react';
import { Database, Search, Shield, Car, Building2, Landmark } from 'lucide-react';

const Apis = () => {
  const handleRedirect = () => {
    window.open('https://discord.gg/NKDw4d3P', '_blank');
  };

  const apis = [
    { title: 'API CPF', desc: 'Consulta de dados por CPF', icon: Search },
    { title: 'API CNPJ', desc: 'Consulta de dados empresariais', icon: Building2 },
    { title: 'API Número', desc: 'Consulta por número de telefone', icon: Search },
    { title: 'API Placa', desc: 'Consulta de veículos pela placa', icon: Car },
    { title: 'API Banco XP', desc: 'Integração com Banco XP', icon: Landmark },
    { title: 'API Santander', desc: 'Integração com Banco Santander', icon: Landmark },
    { title: 'API Safra', desc: 'Integração com Banco Safra', icon: Landmark },
    { title: 'API Caixa', desc: 'Integração com Caixa Econômica', icon: Landmark },
    { title: 'API Serasa', desc: 'Consulta Serasa Score / Restrições', icon: Shield },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white">APIs Integradas</h2>
        <p className="text-gray-400 text-sm mt-1">Visão geral das APIs e serviços disponíveis para consulta e integração.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apis.map((api, idx) => {
          const Icon = api.icon;
          return (
            <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col hover:border-white/20 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                <Icon size={24} className="text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{api.title}</h3>
              <p className="text-gray-400 text-sm mb-6 flex-1">{api.desc}</p>
              <button
                onClick={handleRedirect}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 border border-white/5"
              >
                Adicionar Créditos
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Apis;
