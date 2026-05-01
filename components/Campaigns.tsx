import React, { useState, useEffect } from 'react';
import { Play, Pause, Trash2, Edit3, Calendar, Plus, Clock, Users, X, Save, Smartphone } from 'lucide-react';
import { Campaign, CampaignStatus, Instance } from '../types';
import { useSearchParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, orderBy, getDocs, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Campaigns = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const isCreateMode = searchParams.get('create') === 'true';

  // State for the list of campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [approvedTemplates, setApprovedTemplates] = useState<any[]>([]);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [delayMin, setDelayMin] = useState(30);
  const [delayMax, setDelayMax] = useState(60);
  const [selectedInstance, setSelectedInstance] = useState<string>('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'campaigns'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const camps: Campaign[] = [];
      snapshot.forEach((doc) => {
        camps.push({ id: doc.id, ...doc.data() } as Campaign);
      });
      setCampaigns(camps);
    }, (error) => {
      console.error("Error fetching campaigns:", error);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'templates'),
      where('userId', '==', user.uid),
      where('status', '==', 'APPROVED')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tmpls: any[] = [];
      snapshot.forEach((doc) => {
        tmpls.push({ id: doc.id, ...doc.data() });
      });
      setApprovedTemplates(tmpls);
    }, (error) => {
      console.error("Error fetching templates:", error);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const fetchInstances = async () => {
      try {
        // In a real scenario, you'd have an endpoint to list instances.
        // For now, we'll keep the initial state, 
        // but you should replace this with a real API call when available.
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

  // Poll backend for progress of RUNNING campaigns
  useEffect(() => {
    const runningCampaigns = campaigns.filter(c => c.status === 'RUNNING');
    if (runningCampaigns.length === 0) return;

    const interval = setInterval(async () => {
      for (const campaign of runningCampaigns) {
        try {
          const res = await fetch(`/api/campaigns/${campaign.id}/progress`);
          if (res.ok) {
            const progress = await res.json();
            
            // Only update if there's a change
            if (progress.sent !== campaign.sent || progress.failed !== campaign.failed) {
              
              // Check if completed
              const isCompleted = (progress.sent + progress.failed) >= campaign.total;
              
              await updateDoc(doc(db, 'campaigns', campaign.id), {
                sent: progress.sent,
                failed: progress.failed,
                status: isCompleted ? 'COMPLETED' : 'RUNNING'
              });
            }
          }
        } catch (error) {
          console.error(`Error polling progress for campaign ${campaign.id}:`, error);
        }
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [campaigns]);

  const resetForm = () => {
    setName('');
    setMessage('');
    setScheduledFor('');
    setEditingId(null);
    setDelayMin(30);
    setDelayMax(60);
    setSelectedInstance('');
  };

  const closeEditor = () => {
    resetForm();
    setSearchParams({});
  };

  const insertVariable = (variable: string) => {
    setMessage(prev => prev + ` {{${variable}}} `);
  };

  // Actions
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'campaigns', id));
    } catch (error) {
      console.error("Error deleting campaign:", error);
      alert("Erro ao excluir campanha.");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: CampaignStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    
    let newStatus: CampaignStatus = currentStatus === 'RUNNING' ? 'PAUSED' : 'RUNNING';
    
    try {
      if (newStatus === 'RUNNING') {
        // Prompt for instance selection if not set (simplified for prototype)
        const instanceToUse = selectedInstance || instances[0]?.name;
        
        if (!instanceToUse) {
          alert("Por favor, conecte uma instância do WhatsApp primeiro.");
          return;
        }

        await updateDoc(doc(db, 'campaigns', id), {
          status: newStatus
        });

        const campaign = campaigns.find(c => c.id === id);
        if (campaign) {
          // Fetch contacts from Firestore
          const contactsRef = collection(db, 'contacts');
          const q = query(contactsRef, where('userId', '==', user?.uid));
          const querySnapshot = await getDocs(q);
          
          const dbContacts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as any[];

          if (dbContacts.length === 0) {
            alert("Você não possui contatos na sua base para enviar a campanha.");
            await updateDoc(doc(db, 'campaigns', id), { status: 'DRAFT' });
            return;
          }

          // Update total contacts in DB
          await updateDoc(doc(db, 'campaigns', id), {
            total: dbContacts.length,
            sent: 0,
            failed: 0,
            progress: 0
          });

          // Call backend
          const response = await fetch('/api/campaigns/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              campaignId: id,
              contacts: dbContacts,
              message: campaign.message,
              delayMin: 2, // Using small delays for testing
              delayMax: 5,
              instanceName: instanceToUse
            })
          });

          if (!response.ok) {
            throw new Error('Failed to start campaign on backend');
          }
        }
      } else {
        await updateDoc(doc(db, 'campaigns', id), {
          status: newStatus
        });
      }
    } catch (error) {
      console.error("Error toggling campaign status:", error);
      alert("Erro ao alterar status da campanha.");
    }
  };

  const handleEdit = (campaign: Campaign, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(campaign.id);
    setName(campaign.name);
    setMessage(campaign.message);
    setScheduledFor(campaign.scheduledFor ? new Date(campaign.scheduledFor).toISOString().slice(0, 16) : '');
    setSearchParams({ create: 'true' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    if (!name || !message) return alert('Preencha os campos obrigatórios');
    if (!user) return;

    try {
      if (editingId) {
        // Update existing
        const updateData: any = {
          name,
          message,
          status: scheduledFor ? 'SCHEDULED' : 'DRAFT'
        };
        if (scheduledFor) {
          updateData.scheduledFor = scheduledFor;
        } else {
          // If clearing scheduledFor, we could delete it, but simplest is to just omit or use deleteField(). We'll just update status to DRAFT.
        }
        await updateDoc(doc(db, 'campaigns', editingId), updateData);
      } else {
        // Create new
        const newDocRef = doc(collection(db, 'campaigns'));
        const newData: any = {
          id: newDocRef.id,
          userId: user.uid,
          name,
          message,
          createdAt: new Date().toISOString(),
          status: scheduledFor ? 'SCHEDULED' : 'DRAFT',
          total: 0,
          sent: 0,
          failed: 0,
          progress: 0,
          tags: []
        };
        if (scheduledFor) {
          newData.scheduledFor = scheduledFor;
        }
        await setDoc(newDocRef, newData);
      }
      closeEditor();
    } catch (error) {
      console.error("Error saving campaign:", error);
      alert("Erro ao salvar campanha.");
    }
  };

    if (isCreateMode) {
    return (
      <div className="animate-fade-in max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">{editingId ? 'Editar Campanha' : 'Nova Campanha'}</h2>
            <p className="text-neon-green/80 text-sm mt-1">Limite: 2.000 disparos simultâneos por campanha</p>
          </div>
          <button 
            onClick={closeEditor}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nome da Campanha</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Promoção de Natal"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Instância de Envio</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedInstance}
                    onChange={(e) => setSelectedInstance(e.target.value)}
                    className="w-full bg-[#0a0a0a]/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                  >
                    <option value="">Selecione uma instância...</option>
                    {instances.filter(i => i.status === 'CONNECTED').map(inst => (
                      <option key={inst.id} value={inst.name}>{inst.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Mensagem</label>
                <div className="relative">
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-colors resize-none font-mono text-sm leading-relaxed"
                    placeholder="Digite sua mensagem aqui..."
                  />
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    {['nome', 'empresa', 'cidade'].map(v => (
                      <button 
                        key={v}
                        onClick={() => insertVariable(v)}
                        className="text-xs bg-emerald-500/10 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-500/20 transition-colors border border-emerald-500/30"
                      >
                        {`{{${v}}}`}
                      </button>
                    ))}
                  </div>
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {message.length} caracteres
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Anexo (Opcional)</label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-emerald-500/50 transition-colors cursor-pointer bg-white/5">
                  <p className="text-gray-400 text-sm">Arraste uma imagem, vídeo ou PDF</p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">Agendamento & Envio</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Data de Início</label>
                  <input 
                    type="datetime-local" 
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Delay entre msgs (seg)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={delayMin}
                      onChange={(e) => setDelayMin(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" 
                    />
                    <span className="text-gray-400 text-sm">a</span>
                    <input 
                      type="number" 
                      value={delayMax}
                      onChange={(e) => setDelayMax(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Column */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
              <div className="bg-[#e5ddd5] dark:bg-[#0b141a] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 h-[500px] flex flex-col relative">
                <div className="bg-[#008069] dark:bg-[#202c33] p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10" />
                  <div className="text-sm text-white font-medium">Sua Empresa</div>
                </div>
                <div className="flex-1 p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-10 dark:opacity-5 opacity-80">
                  {message && (
                    <div className="bg-[#005c4b] text-white p-3 rounded-lg rounded-tr-none max-w-[85%] self-end ml-auto text-sm shadow-sm border border-transparent">
                      {message.replace(/{{nome}}/g, 'João').replace(/{{empresa}}/g, 'ACME Ltda')}
                      <div className="text-[10px] text-gray-300 text-right mt-1 flex items-center justify-end gap-1">
                        14:32 <span className="text-blue-400">✓✓</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <button 
                onClick={handleSave}
                className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-neon-cyan-500 py-3 rounded-xl font-bold text-white shadow-lg shadow-emerald-900/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {editingId ? 'Salvar Alterações' : 'Lançar Campanha'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Minhas Campanhas</h2>
          <p className="text-gray-400">Gerencie seus disparos em massa.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setSearchParams({ create: 'true' }); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-md shadow-emerald-900/10"
        >
          <Plus size={18} />
          Criar Campanha
        </button>
      </div>

      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-emerald-500/30 dark:hover:border-emerald-500/50 transition-colors group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-white truncate">{campaign.name}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                  campaign.status === 'RUNNING' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                  campaign.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                  'bg-[#0a0a0a] text-gray-400 border-white/10'
                }`}>
                  {campaign.status}
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-1"><Users size={14}/> {campaign.total || 0} Contatos</span>
                <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(campaign.createdAt).toLocaleDateString()}</span>
                {campaign.scheduledFor && <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><Clock size={14}/> {new Date(campaign.scheduledFor).toLocaleDateString()}</span>}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full md:w-48">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progresso</span>
                <span>{campaign.total > 0 ? Math.round((campaign.sent / campaign.total) * 100) : 0}%</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" 
                  style={{ width: `${campaign.total > 0 ? (campaign.sent / campaign.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
              {campaign.status === 'RUNNING' ? (
                <button 
                  onClick={(e) => handleToggleStatus(campaign.id, campaign.status, e)}
                  className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 rounded-lg transition-colors" 
                  title="Pausar"
                >
                  <Pause size={18} />
                </button>
              ) : (
                <button 
                  onClick={(e) => handleToggleStatus(campaign.id, campaign.status, e)}
                  className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors" 
                  title="Iniciar"
                >
                  <Play size={18} />
                </button>
              )}
              
              <button 
                onClick={(e) => handleEdit(campaign, e)}
                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg transition-colors" 
                title="Editar"
              >
                <Edit3 size={18} />
              </button>
              
              <button 
                onClick={(e) => handleDelete(campaign.id, e)}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg transition-colors" 
                title="Excluir"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        
        {campaigns.length === 0 && (
          <div className="text-center py-12 text-gray-400 glass-panel rounded-2xl">
            Nenhuma campanha encontrada.
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;