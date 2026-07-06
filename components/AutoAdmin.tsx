import React, { useState, useEffect } from 'react';
import { Users, Send, Loader2, Smartphone, CheckCircle2, MessageSquare } from 'lucide-react';
import { Instance } from '../types';
import { useAuth } from '../context/AuthContext';

const AutoAdmin = () => {
  const { user } = useAuth();
  const [selectedInstance, setSelectedInstance] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [instances, setInstances] = useState<Instance[]>([]);

  useEffect(() => {
    const fetchInstances = async () => {
      try {
        setInstances([
          { id: 'inst_1', name: 'Dr. Marcelo Figueira (SELO)', status: 'CONNECTED', provider: 'EVOLUTION', phone: '+55 31 99999-9999', battery: 100 },
          { id: 'inst_2', name: 'Governo Regularização', status: 'CONNECTED', provider: 'EVOLUTION', phone: '+55 31 99999-8888', battery: 100 }
        ]);
      } catch (error) {
        console.error("Error fetching instances:", error);
      }
    };

    fetchInstances();
  }, []);

  const handleFetchGroups = async () => {
    if (!selectedInstance) return;
    setLoading(true);
    try {
      // Mocking group fetch
      setTimeout(() => {
        setGroups([
          { id: 'g1', name: 'Vendas 2024', participants: 156, isAdmin: true },
          { id: 'g2', name: 'Networking SP', participants: 42, isAdmin: true },
          { id: 'g3', name: 'Promoções Black Friday', participants: 230, isAdmin: true },
          { id: 'g4', name: 'Suporte Técnico', participants: 15, isAdmin: true },
          { id: 'g5', name: 'Lançamento Produto X', participants: 89, isAdmin: true },
        ]);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setLoading(false);
    }
  };

  const toggleGroupSelection = (id: string) => {
    setSelectedGroups(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedGroups.length === groups.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(groups.map(g => g.id));
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      alert('Por favor, digite uma mensagem.');
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      alert(`Mensagem enviada com sucesso para ${selectedGroups.length} grupos!`);
      setMessage('');
      setSelectedGroups([]);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Auto ADM</h2>
          <p className="text-gray-400 text-sm mt-1">Envie mensagens como administrador para os seus grupos.</p>
        </div>
        <div className="flex gap-3">
          <a 
            href="https://discord.gg/VPW5SEWK" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-bold transition-colors border border-white/10 text-sm flex items-center justify-center"
          >
            Adquirir ferramenta
          </a>
          <a 
            href="https://discord.gg/VPW5SEWK" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-neon-green hover:bg-neon-green/90 text-black px-4 py-2 rounded-xl font-bold transition-colors text-sm flex items-center justify-center"
          >
            Adquirir grupos
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Smartphone size={20} className="text-neon-green" />
              1. Selecione a Instância
            </h3>
            
            <div className="space-y-4">
              <select
                value={selectedInstance}
                onChange={(e) => setSelectedInstance(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green/50 transition-colors appearance-none"
              >
                <option value="">Selecione uma instância conectada...</option>
                {instances.filter(i => i.status === 'CONNECTED').map(inst => (
                  <option key={inst.id} value={inst.name}>{inst.name}</option>
                ))}
              </select>

              <button
                onClick={handleFetchGroups}
                disabled={!selectedInstance || loading}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Users size={20} />}
                {loading ? 'Buscando grupos...' : 'Carregar Meus Grupos'}
              </button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare size={20} className="text-neon-green" />
              3. Mensagem
            </h3>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite a mensagem que será enviada para os grupos..."
              rows={6}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green/50 transition-colors resize-none"
            />

            <button
              onClick={handleSendMessage}
              disabled={selectedGroups.length === 0 || !message.trim() || sending}
              className="w-full bg-neon-green text-black px-4 py-3 rounded-xl font-bold hover:bg-neon-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              {sending ? 'Enviando...' : `Enviar para ${selectedGroups.length} grupos`}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users size={20} className="text-neon-green" />
                2. Selecione os Grupos
              </h3>
              {groups.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-neon-green hover:text-neon-green/80 transition-colors"
                >
                  {selectedGroups.length === groups.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                </button>
              )}
            </div>

            {groups.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 py-12">
                <Users size={48} className="mb-4 opacity-20" />
                <p>Selecione uma instância e carregue os grupos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {groups.map((group) => (
                  <div 
                    key={group.id}
                    onClick={() => toggleGroupSelection(group.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedGroups.includes(group.id)
                        ? 'bg-neon-green/10 border-neon-green/50'
                        : 'bg-black/40 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-white">{group.name}</h4>
                      <p className="text-xs text-gray-400 mt-1">{group.participants} participantes</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                      selectedGroups.includes(group.id)
                        ? 'bg-neon-green border-neon-green text-black'
                        : 'border-gray-600 text-transparent'
                    }`}>
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoAdmin;
