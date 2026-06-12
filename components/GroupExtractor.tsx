import React, { useState, useEffect } from 'react';
import { Users, Download, Search, CheckCircle2, Loader2, Smartphone, Save } from 'lucide-react';
import { Instance } from '../types';
import { db } from '../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const GroupExtractor = () => {
  const { user } = useAuth();
  const [selectedInstance, setSelectedInstance] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [extractedContacts, setExtractedContacts] = useState<any[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [instances, setInstances] = useState<Instance[]>([]);

  useEffect(() => {
    const fetchInstances = async () => {
      try {
        // In a real scenario, you'd have an endpoint to list instances.
        // For now, we'll keep the initial state, 
        // but you should replace this with a real API call when available.
        setInstances([
          { id: 'inst_1', name: 'Dr. Marcelo Figueira (SELO)', status: 'CONNECTED', provider: 'EVOLUTION', phone: '+55 31 99999-9999', battery: 100 }
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
      // In a real app, you would call an endpoint like:
      // const response = await axios.get(`/api/instances/${selectedInstance}/groups`);
      // setGroups(response.data);
      
      // For now, we simulate the API call delay but keep the data
      // until the backend endpoint is implemented.
      setTimeout(() => {
        setGroups([
          { id: 'g1', name: 'Vendas 2024', participants: 156 },
          { id: 'g2', name: 'Networking SP', participants: 42 },
          { id: 'g3', name: 'Promoções Black Friday', participants: 230 },
          { id: 'g4', name: 'Suporte Técnico', participants: 15 },
          { id: 'g5', name: 'Lançamento Produto X', participants: 89 },
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

  const handleExtract = () => {
    setExtracting(true);
    setTimeout(() => {
      const newContacts = selectedGroups.flatMap(groupId => {
        const group = groups.find(g => g.id === groupId);
        return Array.from({ length: Math.floor(Math.random() * 10) + 5 }).map((_, i) => ({
          id: `ext_${groupId}_${i}`,
          name: `Lead ${group?.name} ${i + 1}`,
          phone: `+55 11 9${Math.floor(Math.random() * 90000000 + 10000000)}`,
          origin: group?.name
        }));
      });
      setExtractedContacts(newContacts);
      setExtracting(false);
    }, 2000);
  };

  const handleSaveContacts = async () => {
    if (!user) return;
    
    let savedCount = 0;
    for (const contact of extractedContacts) {
      try {
        const newDocRef = doc(collection(db, 'contacts'));
        await setDoc(newDocRef, {
          id: newDocRef.id,
          userId: user.uid,
          name: contact.name,
          phone: contact.phone,
          tags: [contact.origin, 'Extrator de Grupos'],
          status: 'VALID',
          createdAt: new Date().toISOString()
        });
        savedCount++;
      } catch (error) {
        console.error("Error saving extracted contact:", error);
      }
    }
    
    alert(`${savedCount} contatos salvos com sucesso na sua base!`);
    setExtractedContacts([]);
    setSelectedGroups([]);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white">Extrator de Grupos</h2>
        <p className="text-gray-400">Extraia leads qualificados diretamente dos seus grupos de WhatsApp.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Instance & Groups */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <label className="block text-sm font-medium text-gray-300 mb-2">Selecione a Instância</label>
            <div className="space-y-3">
              <select 
                value={selectedInstance}
                onChange={(e) => setSelectedInstance(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green-500 transition-colors"
              >
                <option value="">Selecione...</option>
                {instances.filter(i => i.status === 'CONNECTED').map(inst => (
                  <option key={inst.id} value={inst.name}>{inst.name}</option>
                ))}
              </select>
              
              <button 
                onClick={handleFetchGroups}
                disabled={!selectedInstance || loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                Buscar Grupos
              </button>
            </div>
          </div>

          {groups.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white">Grupos Encontrados</h3>
                <span className="text-xs bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full">{groups.length}</span>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {groups.map(group => (
                  <div 
                    key={group.id}
                    onClick={() => toggleGroupSelection(group.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedGroups.includes(group.id) 
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 dark:border-emerald-500/50' 
                        : 'bg-[#0a0a0a] border-white/5 border-white/10 hover:border-emerald-300 dark:hover:border-emerald-500/30'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-sm text-white">{group.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Users size={12} /> {group.participants} participantes
                      </p>
                    </div>
                    {selectedGroups.includes(group.id) && (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    )}
                  </div>
                ))}
              </div>
              
              <button 
                onClick={handleExtract}
                disabled={selectedGroups.length === 0 || extracting}
                className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-neon-cyan-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-900/20 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {extracting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                Extrair Contatos
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Extracted Contacts */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-6 rounded-2xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Contatos Extraídos</h3>
              {extractedContacts.length > 0 && (
                <button 
                  onClick={handleSaveContacts}
                  className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Salvar na Base
                </button>
              )}
            </div>

            {extractedContacts.length > 0 ? (
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0a0a0a]/50 text-gray-400 font-medium sticky top-0">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Nome</th>
                      <th className="px-4 py-3">Telefone</th>
                      <th className="px-4 py-3 rounded-tr-lg">Origem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {extractedContacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-white/5">
                        <td className="px-4 py-3 text-white">{contact.name}</td>
                        <td className="px-4 py-3 text-gray-400 font-mono">{contact.phone}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          <span className="bg-white/10 px-2 py-1 rounded border border-white/10">
                            {contact.origin}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                <Users size={48} className="mb-4 opacity-50" />
                <p>Selecione grupos e clique em extrair para ver os contatos aqui.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupExtractor;
