import React from 'react';
import { ShoppingCart } from 'lucide-react';

const MentoradosNeto = () => {
  const handleRedirect = () => {
    window.open('https://discord.gg/KJ9KmXay', '_blank');
  };

  const options = [
    { title: 'Payments D7', desc: 'Opção de pagamento' },
    { title: 'Payments D3', desc: 'Opção de pagamento' },
    { title: 'Payments D5', desc: 'Opção de pagamento' },
    { title: 'Conta Stripe Reino Unido', desc: 'Conta Stripe registrada no Reino Unido para processamento.' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white">Mentorados Neto</h2>
        <p className="text-gray-400 text-sm mt-1">Opções de pagamento para mentorados.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {options.map((opt, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
            <h3 className="text-xl font-bold text-white mb-2">{opt.title}</h3>
            <p className="text-gray-400 text-sm mb-6 flex-1">{opt.desc}</p>
            <button
              onClick={handleRedirect}
              className="w-full bg-neon-green hover:bg-neon-green/90 text-black font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Comprar Agora
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentoradosNeto;
