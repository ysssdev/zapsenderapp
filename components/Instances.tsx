import React, { useState, useEffect } from 'react';
import { MOCK_INSTANCES } from '../constants';
import { Smartphone, Wifi, WifiOff, BatteryCharging, RefreshCw, QrCode, Plus, Trash2, Loader2, Power, X, ShieldCheck } from 'lucide-react';
import { Instance } from '../types';
import axios from 'axios';

const Instances = () => {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});

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

  // Abrir Modal
  const handleNewConnection = () => {
    setShowModal(true);
  };

  // Criar Instância
  const createInstance = async (type: 'EVOLUTION' | 'CLOUD_API') => {
    const newId = `inst_${Date.now()}`;
    const instanceName = type === 'CLOUD_API' ? `WhatsApp Business API ${instances.length + 1}` : 'Dr. Marcelo Figueira (SELO)';
    
    const newInstance: Instance = {
      id: newId,
      name: instanceName,
      status: type === 'CLOUD_API' ? 'CONNECTED' : 'PAIRING', // API Oficial já nasce "conectada" (simulado)
      provider: type,
      phone: type === 'CLOUD_API' ? '+55 31 99999-9999' : undefined,
      battery: type === 'CLOUD_API' ? 100 : undefined, // API não tem bateria
    };
    
    setInstances([newInstance, ...instances]);
    setShowModal(false);

    if (type === 'EVOLUTION') {
      try {
        setLoadingAction(newId);
        // Call backend to create instance in Evolution API
        const response = await axios.post('/api/instances/create', { instanceName });
        
        if (response.data?.qrcode?.base64) {
          setQrCodes(prev => ({ ...prev, [newId]: response.data.qrcode.base64 }));
        }
      } catch (error) {
        console.error("Failed to create instance:", error);
        // Fallback to simulation if API fails
        simulateQrCode(newId);
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const simulateQrCode = (id: string) => {
    // This is just a placeholder for the UI when the real API is not available
    console.log("Simulating QR code generation for", id);
  };

  // Simular Conexão (Ler QR Code)
  const handleConnect = async (id: string, instanceName: string) => {
    setLoadingAction(id);
    
    try {
      // In a real app, you would poll the connection status here
      // For now, we simulate the successful connection after scanning
      setTimeout(() => {
        setInstances(prev => prev.map(inst => {
          if (inst.id === id) {
            // Generate a random number with DDD 31 (Minas Gerais)
            const randomPhone = `+55 31 9${Math.floor(Math.random() * 90000000 + 10000000)}`;
            return {
              ...inst,
              status: 'CONNECTED',
              phone: randomPhone,
              battery: 100
            };
          }
          return inst;
        }));
        setLoadingAction(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to connect:", error);
      setLoadingAction(null);
    }
  };

  // Simular Reinicialização
  const handleRestart = (id: string) => {
    setLoadingAction(id);
    setTimeout(() => {
      setLoadingAction(null);
      // Feedback visual (pode adicionar um toast aqui no futuro)
    }, 1500);
  };

  // Desconectar Instância
  const handleDisconnect = async (id: string, instanceName: string) => {
    setLoadingAction(id);
    try {
      await axios.delete(`/api/instances/${encodeURIComponent(instanceName)}/logout`);
      
      setInstances(prev => prev.map(inst => {
        if (inst.id === id) {
          return {
            ...inst,
            status: 'DISCONNECTED',
            phone: undefined,
            battery: undefined
          };
        }
        return inst;
      }));
    } catch (error) {
      console.error("Failed to logout instance:", error);
      // Fallback
      setInstances(prev => prev.map(inst => {
        if (inst.id === id) {
          return {
            ...inst,
            status: 'DISCONNECTED',
            phone: undefined,
            battery: undefined
          };
        }
        return inst;
      }));
    } finally {
      setLoadingAction(null);
    }
  };

  // Excluir Instância
  const handleDelete = (id: string) => {
    if (window.confirm('Remover esta instância permanentemente?')) {
      setInstances(prev => prev.filter(inst => inst.id !== id));
    }
  };

  // Fetch QR Code for pairing instances
  const fetchQrCode = async (id: string, instanceName: string) => {
    try {
      setLoadingAction(id);
      const response = await axios.get(`/api/instances/${encodeURIComponent(instanceName)}/qrcode`);
      if (response.data?.base64) {
        setQrCodes(prev => ({ ...prev, [id]: response.data.base64 }));
      }
    } catch (error) {
      console.error("Failed to fetch QR code:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Instâncias WhatsApp</h2>
          <p className="text-gray-400">Gerencie suas conexões com a API.</p>
        </div>
        <button 
          onClick={handleNewConnection}
          className="bg-gradient-to-r from-neon-green-500 to-neon-cyan-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-900/20 hover:scale-105 transition-transform"
        >
          <Plus size={18} />
          Nova Conexão
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {instances.map((instance) => (
          <div key={instance.id} className="glass-panel p-6 rounded-2xl relative overflow-hidden group border border-white/10 hover:border-emerald-500/30 dark:hover:border-emerald-500/50 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-30 pointer-events-none transition-opacity group-hover:opacity-50">
              <Smartphone size={120} className="text-white/5" />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${
                    instance.status === 'CONNECTED' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 
                    instance.status === 'PAIRING' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 animate-pulse' :
                    'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                  }`}>
                    {instance.status === 'CONNECTED' ? <Wifi size={24} /> : 
                     instance.status === 'PAIRING' ? <RefreshCw size={24} className={loadingAction === instance.id ? "animate-spin" : ""} /> : 
                     <WifiOff size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {instance.name}
                    </h3>
                    <p className="text-sm text-gray-400">{instance.provider} API</p>
                  </div>
                </div>
                
                {instance.status === 'CONNECTED' && (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20 text-xs shadow-sm">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Online
                  </div>
                )}
                
                {instance.status === 'DISCONNECTED' && (
                   <button 
                    onClick={() => handleDelete(instance.id)}
                    className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Excluir Instância"
                   >
                     <Trash2 size={18} />
                   </button>
                )}
              </div>

              {instance.status === 'CONNECTED' ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                    <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                      <span>Número</span>
                      <span className="font-mono text-white">{instance.phone}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>Bateria</span>
                      <div className="flex items-center gap-2">
                        <BatteryCharging size={16} className={instance.battery && instance.battery < 20 ? 'text-red-500' : 'text-emerald-500'} />
                        <span className={instance.battery && instance.battery < 20 ? 'text-red-500 font-bold' : 'text-emerald-500 font-bold'}>{instance.battery}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleRestart(instance.id)}
                      disabled={loadingAction === instance.id}
                      className="flex-1 py-2.5 rounded-lg bg-[#0a0a0a] border-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/10 text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                    >
                      {loadingAction === instance.id ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                      Reiniciar
                    </button>
                    <button 
                      onClick={() => handleDisconnect(instance.id, instance.name)}
                      disabled={loadingAction === instance.id}
                      className="flex-1 py-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors border border-red-200 dark:border-red-500/20 text-sm flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                    >
                      {loadingAction === instance.id ? <Loader2 size={16} className="animate-spin" /> : <Power size={16} />}
                      {loadingAction === instance.id ? 'Saindo...' : 'Desconectar'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 animate-fade-in">
                  <div className={`w-40 h-40 bg-\[#0a0a0a\] mx-auto rounded-xl mb-4 flex items-center justify-center relative overflow-hidden border border-white/10 ${instance.status === 'PAIRING' ? 'ring-4 ring-emerald-500/30' : 'opacity-50 grayscale'}`}>
                     {instance.status === 'PAIRING' ? (
                        <>
                          {qrCodes[instance.id] ? (
                            <img src={qrCodes[instance.id]} alt="QR Code" className="w-full h-full object-cover z-10" />
                          ) : (
                            <QrCode size={100} className="text-white z-10" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent h-full w-full animate-scan" />
                        </>
                     ) : (
                        <WifiOff size={60} className="text-gray-600" />
                     )}
                  </div>
                  
                  {instance.status === 'PAIRING' ? (
                    <>
                      <p className="text-sm text-gray-400 mb-4 font-medium">Abra o WhatsApp &gt; Aparelhos Conectados &gt; Conectar Aparelho</p>
                      <button 
                        onClick={() => handleConnect(instance.id, instance.name)}
                        disabled={loadingAction === instance.id}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 mx-auto transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-70 disabled:cursor-wait"
                      >
                         {loadingAction === instance.id ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                         {loadingAction === instance.id ? 'Conectando...' : 'Simular Leitura do QR Code'}
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-400 mb-4">Instância desconectada.</p>
                      <button 
                        onClick={() => {
                          setInstances(prev => prev.map(i => i.id === instance.id ? {...i, status: 'PAIRING'} : i));
                          fetchQrCode(instance.id, instance.name);
                        }}
                        className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm flex items-center justify-center gap-2 mx-auto transition-colors font-medium hover:underline decoration-emerald-500/30"
                      >
                        <RefreshCw size={14} /> Gerar novo QR Code
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>

      {/* Modal de Nova Conexão */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
           <div className="bg-\[#0a0a0a\] rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/10">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-white">Tipo de Conexão</h3>
                 <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-300 transition-colors">
                   <X size={24} />
                 </button>
              </div>
              
              <div className="space-y-4">
                 <button 
                   onClick={() => createInstance('EVOLUTION')}
                   className="w-full p-4 rounded-xl border border-white/10 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all flex items-center gap-4 group text-left bg-\[#0a0a0a\]"
                 >
                    <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                       <QrCode size={24} />
                    </div>
                    <div>
                       <h4 className="font-bold text-white">WhatsApp Web</h4>
                       <p className="text-sm text-gray-400">Escaneie o QR Code com seu celular.</p>
                    </div>
                 </button>

                 <button 
                   onClick={() => createInstance('CLOUD_API')}
                   className="w-full p-4 rounded-xl border border-white/10 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all flex items-center gap-4 group text-left bg-\[#0a0a0a\]"
                 >
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                       <ShieldCheck size={24} /> 
                    </div>
                    <div>
                       <h4 className="font-bold text-white">API Oficial (Meta)</h4>
                       <p className="text-sm text-gray-400">Conexão oficial via Business Manager.</p>
                    </div>
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Instances;