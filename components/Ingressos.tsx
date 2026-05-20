import React, { useState } from 'react';
import { Ticket, Link as LinkIcon, Users, CreditCard, PlayCircle, QrCode } from 'lucide-react';

const Ingressos = () => {
  const [ticketLink, setTicketLink] = useState('');
  const [logins, setLogins] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao'>('pix');
  const [isProcessing, setIsProcessing] = useState(false);
  const [monitorSoldOut, setMonitorSoldOut] = useState(false);
  const [results, setResults] = useState<{email: string, status: string}[]>([]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const loginList = logins.split('\n').filter(l => l.trim() !== '');
    if (loginList.length === 0) {
      alert('Por favor, insira pelo menos um login.');
      return;
    }
    if (loginList.length > 35) {
      alert('O limite máximo é de 35 logins por execução.');
      return;
    }
    
    setIsProcessing(true);
    setResults([]);
    
    const emails = loginList.map(l => l.split(':')[0] || l);

    // Simula inicialização do processo
    emails.forEach((email, index) => {
      setTimeout(() => {
        setResults(prev => [...prev, {
          email,
          status: monitorSoldOut
            ? 'aguardando ingresso disponivel, avisaremos no seu whatsapp'
            : paymentMethod === 'pix' 
              ? 'Ingresso reservado, entre na sua conta e pague o pix' 
              : 'Compra efetuada com sucesso no cartão'
        }]);
        
        if (index === emails.length - 1) {
          setIsProcessing(false);
        }
      }, (index + 1) * 1200);
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-neon-purple/20 border border-neon-purple/50 rounded-2xl flex items-center justify-center mx-auto mb-4 neon-glow text-neon-purple">
          <Ticket className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-2">Automação de Ingressos</h1>
        <p className="text-gray-400">Automatize a compra de ingressos em lote utilizando múltiplas contas simultâneas.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-lg">
        <form onSubmit={handleStart} className="space-y-8">
          
          {/* Link do Evento */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
              <LinkIcon size={16} /> Link de Venda de Ingressos
            </label>
            <input
              type="url"
              required
              value={ticketLink}
              onChange={(e) => setTicketLink(e.target.value)}
              placeholder="https://site-de-ingressos.com/evento-xyz"
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors"
            />
          </div>

          {/* Logins */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2"><Users size={16} /> Contas do Site (1 a 35)</span>
              <span className="text-xs font-bold px-2 py-1 rounded-md bg-neon-purple/10 text-neon-purple">
                {logins.split('\n').filter(l => l.trim() !== '').length} / 35
              </span>
            </label>
            <textarea
              required
              value={logins}
              onChange={(e) => setLogins(e.target.value)}
              placeholder="usuario1@email.com:senha1&#10;usuario2@email.com:senha2"
              rows={8}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple transition-colors font-mono text-sm resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">Insira um login por linha. Ex: email@dominio.com:senha. Máximo de 35 logins.</p>
          </div>

          {/* Método de Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Método de Pagamento Preferencial</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`py-4 px-4 rounded-xl border font-bold flex flex-col items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'pix' 
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <QrCode size={24} />
                PIX
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cartao')}
                className={`py-4 px-4 rounded-xl border font-bold flex flex-col items-center justify-center gap-2 transition-all ${
                  paymentMethod === 'cartao' 
                    ? 'bg-blue-500/10 border-blue-500 text-blue-400' 
                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <CreditCard size={24} />
                Cartão de Crédito
              </button>
            </div>
          </div>

          {/* Monitorar Esgotados */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold mb-1">Ingressos Esgotados</h3>
              <p className="text-sm text-gray-400">Reservar automaticamente assim que alguém desistir da compra.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={monitorSoldOut}
                onChange={(e) => setMonitorSoldOut(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-purple"></div>
            </label>
          </div>

          <div className="pt-6 border-t border-white/5">
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-lg
                ${isProcessing 
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                  : 'bg-neon-purple hover:bg-neon-purple/90 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Robôs em Ação...
                </>
              ) : (
                <>
                  <PlayCircle size={24} />
                  Iniciar Compras Automáticas
                </>
              )}
            </button>
          </div>

          {results.length > 0 && (
            <div className="mt-8 space-y-3">
              <h3 className="text-white font-bold text-lg border-b border-white/10 pb-2 mb-4">Status das Reservas</h3>
              {results.map((result, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                  <div className="font-mono text-neon-purple">{result.email}</div>
                  <div className="text-emerald-400 font-medium flex items-center gap-2 text-sm text-right">
                     {result.status}
                  </div>
                </div>
              ))}
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default Ingressos;
