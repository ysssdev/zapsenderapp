import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Smartphone, 
  Send, 
  Upload, 
  X, 
  Check, 
  Calendar, 
  FileText, 
  Layers, 
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Community, CommunityMember, Instance } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

export default function Communities() {
  const { user } = useAuth();
  
  // Data state
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [instances, setInstances] = useState<Instance[]>([]);
  const [isImportMode, setIsImportMode] = useState(false);

  // Modals / forms state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommName, setNewCommName] = useState('');
  const [newCommDesc, setNewCommDesc] = useState('');
  const [newCommJid, setNewCommJid] = useState('');

  // Single member add
  const [singleName, setSingleName] = useState('');
  const [singlePhone, setSinglePhone] = useState('');

  // Bulk import state
  const [bulkInput, setBulkInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Dispatch Tab State
  const [message, setMessage] = useState('');
  const [selectedInstance, setSelectedInstance] = useState('');
  const [delayMin, setDelayMin] = useState(3);
  const [delayMax, setDelayMax] = useState(8);
  const [isSending, setIsSending] = useState(false);

  // File attachments state
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [mediaName, setMediaName] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Firestore standard error handler
  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: user?.uid,
        email: user?.email,
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    alert(`Erro de banco de dados (${operationType}): ` + (error instanceof Error ? error.message : 'Acesso recusado.'));
  };

  // 1. Fetch user's communities
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'communities'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comms: Community[] = [];
      snapshot.forEach((doc) => {
        comms.push({ id: doc.id, ...doc.data() } as Community);
      });
      setCommunities(comms);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'communities');
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Fetch members of selected community
  useEffect(() => {
    if (!user || !selectedCommunity) {
      setMembers([]);
      return;
    }

    const q = query(
      collection(db, 'community_members'),
      where('communityId', '==', selectedCommunity.id),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mems: CommunityMember[] = [];
      snapshot.forEach((doc) => {
        mems.push({ id: doc.id, ...doc.data() } as CommunityMember);
      });
      setMembers(mems);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `community_members/${selectedCommunity.id}`);
    });

    return () => unsubscribe();
  }, [user, selectedCommunity]);

  // 3. Fetch list of connected instances
  useEffect(() => {
    const fetchInstances = async () => {
      try {
        // Mock instances derived from system state
        setInstances([
          { id: 'inst_1', name: 'Dr. Marcelo Figueira (SELO)', status: 'CONNECTED', provider: 'EVOLUTION', phone: '+55 31 99999-9999', battery: 100 },
          { id: 'inst_2', name: 'Governo Regularização', status: 'CONNECTED', provider: 'EVOLUTION', phone: '+55 31 99999-8888', battery: 100 }
        ]);
        setSelectedInstance('Dr. Marcelo Figueira (SELO)');
      } catch (error) {
        console.error("Error fetching instances:", error);
      }
    };
    fetchInstances();
  }, []);

  // Normalize phone helper
  const normalizePhone = (raw: string): string => {
    let clean = raw.replace(/\D/g, '');
    if (!clean) return '';
    // If it has no country code and has 10/11 digits, add Brazil code (55)
    if (clean.length === 10 || clean.length === 11) {
      clean = '55' + clean;
    }
    return clean;
  };

  // Create Community Action
  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommName.trim()) return;

    try {
      const pathWith = 'communities';
      const newId = doc(collection(db, pathWith)).id;
      const payload: Community = {
        id: newId,
        userId: user!.uid,
        name: newCommName.trim(),
        description: newCommDesc.trim(),
        whatsappJid: newCommJid.trim() || undefined,
        createdAt: new Date().toISOString(),
        membersCount: 0
      };

      await addDoc(collection(db, pathWith), payload);
      setNewCommName('');
      setNewCommDesc('');
      setNewCommJid('');
      setShowCreateModal(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'communities');
    }
  };

  // Delete Community Action
  const handleDeleteCommunity = async (comm: Community, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Tem certeza que deseja excluir a comunidade "${comm.name}"? Isso não apagará os leads individualmente no banco de contatos geral, mas removerá o grupo daqui.`)) {
      return;
    }

    try {
      if (selectedCommunity?.id === comm.id) {
        setSelectedCommunity(null);
      }
      // Delete community doc
      await deleteDoc(doc(db, 'communities', comm.id));

      // Quick clean up of members (could run on server, but let's delete them in batches)
      const q = query(
        collection(db, 'community_members'),
        where('communityId', '==', comm.id),
        where('userId', '==', user!.uid)
      );
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `communities/${comm.id}`);
    }
  };

  // Add individual member manually
  const handleAddSingleMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommunity || !singlePhone.trim()) return;

    const normalized = normalizePhone(singlePhone);
    if (!normalized) {
      alert("Por favor, digite um número de WhatsApp válido.");
      return;
    }

    try {
      const nameVal = singleName.trim() || `Lead ${normalized}`;
      const pathWith = 'community_members';
      const mId = doc(collection(db, pathWith)).id;
      const payload: CommunityMember = {
        id: mId,
        userId: user!.uid,
        communityId: selectedCommunity.id,
        name: nameVal,
        phone: normalized,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, pathWith), payload);
      
      // Increment membersCount
      const currentCount = selectedCommunity.membersCount || 0;
      await updateDoc(doc(db, 'communities', selectedCommunity.id), {
        membersCount: currentCount + 1
      });

      // Update selectedCommunity ref
      setSelectedCommunity(prev => prev ? { ...prev, membersCount: currentCount + 1 } : null);

      setSingleName('');
      setSinglePhone('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'community_members');
    }
  };

  // Delete single member
  const handleDeleteMember = async (member: CommunityMember) => {
    if (!selectedCommunity) return;

    try {
      await deleteDoc(doc(db, 'community_members', member.id));

      // Decrement count
      const currentCount = selectedCommunity.membersCount || 0;
      const newCount = Math.max(0, currentCount - 1);
      await updateDoc(doc(db, 'communities', selectedCommunity.id), {
        membersCount: newCount
      });

      setSelectedCommunity(prev => prev ? { ...prev, membersCount: newCount } : null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `community_members/${member.id}`);
    }
  };

  // Delete ALL members of current community
  const handleDeleteAllMembers = async () => {
    if (!selectedCommunity || members.length === 0) return;

    if (!window.confirm(`Tem certeza que deseja apagar TODOS os ${members.length} leads desta comunidade?`)) {
      return;
    }

    try {
      setIsImporting(true);
      const batchSize = 100;
      let count = 0;
      while (count < members.length) {
        const batch = writeBatch(db);
        const subList = members.slice(count, count + batchSize);
        subList.forEach((m) => {
          batch.delete(doc(db, 'community_members', m.id));
        });
        await batch.commit();
        count += batchSize;
      }

      await updateDoc(doc(db, 'communities', selectedCommunity.id), {
        membersCount: 0
      });

      setSelectedCommunity(prev => prev ? { ...prev, membersCount: 0 } : null);
      alert("Todos os membros foram removidos com sucesso.");
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'community_members');
    } finally {
      setIsImporting(false);
    }
  };

  // Import Leads Bulk Action
  const handleBulkImport = async () => {
    if (!selectedCommunity || !bulkInput.trim()) return;

    setIsImporting(true);
    setImportStatus("Processando números...");

    try {
      const lines = bulkInput.split('\n');
      const addedMembers: { name: string, phone: string }[] = [];

      for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        let name = '';
        let phone = '';

        // Match patterns like "Name;Phone", "Name,Phone", "Phone"
        if (line.includes(';') || line.includes(',')) {
          const splitChar = line.includes(';') ? ';' : ',';
          const parts = line.split(splitChar);
          name = parts[0] ? parts[0].trim() : '';
          phone = parts[1] ? parts[1].trim() : '';
        } else {
          phone = line;
        }

        const normalizedPhone = normalizePhone(phone);
        if (normalizedPhone) {
          addedMembers.push({
            name: name || `Lead ${normalizedPhone}`,
            phone: normalizedPhone
          });
        }
      }

      if (addedMembers.length === 0) {
        setImportStatus("Nenhum número válido encontrado.");
        setIsImporting(false);
        return;
      }

      setImportStatus(`Salvando ${addedMembers.length} leads em lotes na nuvem...`);

      // Write in batches of 200
      const batchSize = 250;
      let index = 0;
      while (index < addedMembers.length) {
        const batch = writeBatch(db);
        const chunk = addedMembers.slice(index, index + batchSize);

        for (const item of chunk) {
          const mId = doc(collection(db, 'community_members')).id;
          const payload: CommunityMember = {
            id: mId,
            userId: user!.uid,
            communityId: selectedCommunity.id,
            name: item.name,
            phone: item.phone,
            createdAt: new Date().toISOString()
          };
          batch.set(doc(db, 'community_members', mId), payload);
        }

        await batch.commit();
        index += batchSize;
      }

      // Update total count
      const updatedTotal = (selectedCommunity.membersCount || 0) + addedMembers.length;
      await updateDoc(doc(db, 'communities', selectedCommunity.id), {
        membersCount: updatedTotal
      });

      setSelectedCommunity(prev => prev ? { ...prev, membersCount: updatedTotal } : null);

      setBulkInput('');
      setIsImportMode(false);
      setImportStatus(null);
      alert(`${addedMembers.length} leads importados com sucesso!`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'community_members_import');
    } finally {
      setIsImporting(false);
    }
  };

  // Base64 file parser (matches Campaigns.tsx)
  const processFile = (file: File) => {
    if (file.size > 1024 * 1024) {
      setFileError('O arquivo é muito grande. Escolha um arquivo de até 1MB.');
      return;
    }

    let detectedType = 'document';
    if (file.type.startsWith('image/')) {
      detectedType = 'image';
    } else if (file.type.startsWith('video/')) {
      detectedType = 'video';
    } else if (file.type.startsWith('audio/')) {
      detectedType = 'audio';
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === 'string') {
        setMediaUrl(event.target.result);
        setMediaType(detectedType);
        setMediaName(file.name);
        setFileError(null);
      }
    };
    reader.onerror = () => {
      setFileError('Ocorreu um erro ao carregar o arquivo.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setMediaUrl('');
    setMediaType('');
    setMediaName('');
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Dispatch message to all community members
  const handleStartDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommunity) return;
    if (members.length === 0) {
      alert("Adicione membros à comunidade antes de disparar!");
      return;
    }
    if (!message.trim()) {
      alert("Por favor, digite a mensagem de disparo.");
      return;
    }

    const instanceToUse = selectedInstance || instances[0]?.name;
    if (!instanceToUse) {
      alert("Por favor, conecte uma instância do WhatsApp primeiro.");
      return;
    }

    try {
      setIsSending(true);

      // Create a background Campaign record
      const campId = doc(collection(db, 'campaigns')).id;
      const campaignName = `[Comunidade] ${selectedCommunity.name} - ${new Date().toLocaleDateString('pt-BR')}`;
      
      const campaignPayload = {
        id: campId,
        userId: user!.uid,
        name: campaignName,
        message: message.trim(),
        createdAt: new Date().toISOString(),
        status: 'RUNNING',
        total: members.length,
        sent: 0,
        failed: 0,
        progress: 0,
        mediaUrl: mediaUrl || undefined,
        mediaType: mediaType || undefined,
        mediaName: mediaName || undefined
      };

      await addDoc(collection(db, 'campaigns'), campaignPayload);

      // Format contact list standard for campaigns
      // The API endpoint accepts standard { id, name, phone } format matching db schema
      const mappedContacts = members.map(m => ({
        id: m.id,
        name: m.name,
        phone: m.phone,
        status: 'VALID',
        tags: []
      }));

      // Post trigger campaign request to backend
      const response = await fetch('/api/campaigns/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campId,
          contacts: mappedContacts,
          message: message.trim(),
          delayMin: delayMin || 3,
          delayMax: delayMax || 8,
          instanceName: instanceToUse,
          mediaUrl: mediaUrl || '',
          mediaType: mediaType || '',
          mediaName: mediaName || ''
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao acionar servidor de disparos de comunidades');
      }

      alert(`Disparos para a comunidade "${selectedCommunity.name}" iniciado com sucesso!\nVocê pode acompanhar o progresso em detalhes no menu Campanhas.`);
      
      // Clear message field after launch
      setMessage('');
      handleRemoveFile();
    } catch (err) {
      console.error(err);
      alert("Erro ao disparar na comunidade: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="communities-page">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="text-neon-green" size={26} />
            Comunidades do WhatsApp
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Reúna múltiplos leads e dispare mensagens em massa de forma segmentada, dinâmica e rápida.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-neon-green/20 hover:bg-neon-green/30 text-neon-green border border-neon-green/30 hover:border-neon-green/50 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all font-semibold font-display text-sm active:scale-95"
        >
          <Plus size={18} />
          Nova Comunidade
        </button>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Communities List Card */}
        <div className="lg:col-span-5 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white font-display border-b border-white/5 pb-3">
            Minhas Comunidades ({communities.length})
          </h3>

          {communities.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-white/10 rounded-2xl space-y-3">
              <Users className="w-10 h-10 text-gray-600 mx-auto" />
              <p className="text-gray-400 font-medium text-sm">Nenhuma comunidade cadastrada</p>
              <p className="text-gray-500 text-xs max-w-xs mx-auto">
                Crie sua primeira comunidade no botão acima para segmentar seus disparos em massa.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {communities.map((comm) => {
                const isSelected = selectedCommunity?.id === comm.id;
                return (
                  <div
                    key={comm.id}
                    onClick={() => {
                      setSelectedCommunity(comm);
                      setIsImportMode(false);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative group flex justify-between items-center ${
                      isSelected
                        ? 'bg-neon-green/10 border-neon-green/40 text-white'
                        : 'bg-[#121212]/30 border-white/5 hover:border-white/10 text-gray-300 hover:bg-[#121212]/50'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 pr-6">
                      <p className="font-semibold text-white text-sm truncate font-display">
                        {comm.name}
                      </p>
                      {comm.description && (
                        <p className="text-xs text-gray-400 truncate max-w-xs">
                          {comm.description}
                        </p>
                      )}
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 font-mono">
                        <Calendar size={12} />
                        Criada em: {new Date(comm.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="bg-white/5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-neon-green border border-white/5">
                        {comm.membersCount || 0} leads
                      </span>
                      <button
                        onClick={(e) => handleDeleteCommunity(comm, e)}
                        className="text-gray-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                        title="Remover Comunidade"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Community Detail Panel */}
        <div className="lg:col-span-7 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 min-h-[450px] flex flex-col justify-between">
          {!selectedCommunity ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4">
              <Layers className="w-16 h-16 text-gray-800 animate-pulse" />
              <div className="space-y-2">
                <h4 className="text-white font-bold text-lg font-display">Selecione uma Comunidade</h4>
                <p className="text-gray-500 text-sm max-w-sm">
                  Escolha uma comunidade da coluna da esquerda para visualizar os leads, importar contatos e configurar seus disparos.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              {/* Header Details */}
              <div className="border-b border-white/5 pb-4 space-y-2">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-white font-display">
                      {selectedCommunity.name}
                    </h3>
                    {selectedCommunity.description && (
                      <p className="text-sm text-gray-400 mt-1 max-w-xl">
                        {selectedCommunity.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsImportMode(!isImportMode);
                        setImportStatus(null);
                      }}
                      className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Upload size={14} />
                      {isImportMode ? "Ver Leads" : "Importar em Lote"}
                    </button>
                    {members.length > 0 && (
                      <button
                        onClick={handleDeleteAllMembers}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3.5 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <Trash2 size={14} />
                        Limpar Leads
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic View: Import Area OR Members List & Dispatch Area */}
              {isImportMode ? (
                <div className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <Upload size={13} className="text-neon-green" />
                      Importar Lista de Contatos
                    </label>
                    <p className="text-xs text-gray-500">
                      Cole um contato por linha. Formatos aceitos: <code className="text-gray-400 bg-white/5 px-1 py-0.5 rounded font-mono">Nome;Telefone</code>, <code className="text-gray-400 bg-white/5 px-1 py-0.5 rounded font-mono">Nome,Telefone</code> ou apenas o <code className="text-gray-400 bg-white/5 px-1 py-0.5 rounded font-mono">Telefone</code>.
                    </p>
                    <textarea
                      rows={8}
                      value={bulkInput}
                      onChange={(e) => setBulkInput(e.target.value)}
                      placeholder="Exemplo:&#10;Ygor Santos;5531999990000&#10;Cliente Pro;5511988887777&#10;5521977776666"
                      className="w-full bg-[#050505] border border-white/10 p-3 rounded-xl text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/30"
                      disabled={isImporting}
                    />
                  </div>

                  {importStatus && (
                    <div className="p-3 bg-neon-green/10 border border-neon-green/30 rounded-xl text-xs text-neon-green flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
                      {importStatus}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setIsImportMode(false)}
                      disabled={isImporting}
                      className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-semibold transition-all text-gray-300"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleBulkImport}
                      disabled={isImporting}
                      className="bg-neon-green text-black hover:bg-neon-green/90 px-5 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                    >
                      Processar Envio
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  {/* Action Row for manual addition */}
                  <form onSubmit={handleAddSingleMember} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#121212]/40 p-4 border border-white/5 rounded-xl">
                    <div className="sm:col-span-1">
                      <input
                        type="text"
                        placeholder="Nome (opcional)"
                        value={singleName}
                        onChange={(e) => setSingleName(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 px-3 py-2 rounded-lg text-white text-xs placeholder-gray-600 focus:outline-none focus:border-neon-green/50"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <input
                        type="text"
                        placeholder="Telefone (DDD + Nu.)"
                        value={singlePhone}
                        onChange={(e) => setSinglePhone(e.target.value)}
                        className="w-full bg-[#050505] border border-white/10 px-3 py-2 rounded-lg text-white text-xs placeholder-gray-600 focus:outline-none focus:border-neon-green/50"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-neon-green text-black hover:bg-[#00e600] px-4 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <UserPlus size={14} />
                      Adicionar Lead
                    </button>
                  </form>

                  {/* Splits: Left is Members List, Right is Trigger Area */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start flex-1">
                    {/* Leads Sub-List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-white/5 pb-1 flex justify-between">
                        <span>Leads na Comunidade</span>
                        <span className="font-mono text-neon-green">({members.length})</span>
                      </h4>

                      {members.length === 0 ? (
                        <p className="text-xs text-gray-500 py-6 text-center">
                          Nenhum lead adicionado ainda. Adicione manualmente acima ou faça uma importação em lote.
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                          {members.map((m) => (
                            <div key={m.id} className="flex justify-between items-center bg-[#121212]/20 border border-white/5 p-2 px-3 rounded-lg group">
                              <div className="min-w-0 pr-2">
                                <p className="text-white text-xs font-medium truncate">{m.name}</p>
                                <p className="text-gray-500 text-[10px] font-mono">+{m.phone}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteMember(m)}
                                className="text-gray-500 hover:text-rose-400 p-1 rounded hover:bg-rose-500/5 transition-all opacity-0 group-hover:opacity-100"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Integrated Trigger Panel */}
                    <form onSubmit={handleStartDispatch} className="bg-[#121212]/30 border border-white/5 rounded-xl p-4 space-y-4">
                      <h4 className="text-xs font-semibold text-neon-green uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-1.5">
                        <Send size={12} />
                        Disparar Comunidade
                      </h4>

                      {/* Msg Area */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Mensagem</label>
                        <textarea
                          rows={4}
                          placeholder="Olá {{nome}}, confira nossa última novidade..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full bg-[#050505] border border-white/10 p-2.5 rounded-lg text-white text-xs placeholder-gray-600 focus:outline-none focus:border-neon-green/40 font-sans"
                        />
                        <p className="text-[10px] text-gray-500">Use <span className="text-neon-green font-mono">&#123;&#123;nome&#125;&#125;</span> para personalizar.</p>
                      </div>

                      {/* File attachment preview */}
                      {mediaUrl ? (
                        <div className="p-2 bg-neon-green/5 outline-dashed outline-1 outline-neon-green/20 rounded-lg flex items-center justify-between text-xs text-white">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <FileText size={14} className="text-neon-green" />
                            <span className="truncate max-w-[150px] font-mono text-[10px]">{mediaName}</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="text-gray-500 hover:text-rose-400"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                          >
                            <Upload size={12} />
                            Anexar Media (Máx. 1MB)
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileInputChange}
                            className="hidden"
                          />
                          {fileError && <span className="text-[9px] text-rose-400 font-medium">{fileError}</span>}
                        </div>
                      )}

                      {/* Delay Configuration */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-1">Delay Mín (s)</label>
                          <input
                            type="number"
                            min="1"
                            value={delayMin}
                            onChange={(e) => setDelayMin(Number(e.target.value))}
                            className="w-full bg-[#050505] border border-white/10 p-1.5 rounded-lg text-white text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-1">Delay Máx (s)</label>
                          <input
                            type="number"
                            min="2"
                            value={delayMax}
                            onChange={(e) => setDelayMax(Number(e.target.value))}
                            className="w-full bg-[#050505] border border-white/10 p-1.5 rounded-lg text-white text-xs font-mono"
                          />
                        </div>
                      </div>

                      {/* Instance Selector */}
                      <div className="space-y-1">
                        <label className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest">Utilizar Instância</label>
                        <select
                          value={selectedInstance}
                          onChange={(e) => setSelectedInstance(e.target.value)}
                          className="w-full bg-[#050505] border border-white/10 p-1.5 rounded-lg text-white text-xs"
                        >
                          {instances.filter(i => i.status === 'CONNECTED').map(inst => (
                            <option key={inst.id} value={inst.name}>{inst.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Dispatch Trigger Button */}
                      <button
                        type="submit"
                        disabled={isSending || members.length === 0}
                        className="w-full bg-neon-green text-black hover:bg-neon-green/90 transition-all p-2.5 rounded-xl font-bold font-display text-xs flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send size={14} />
                        {isSending ? "Iniciando disparos..." : `Iniciar Disparo (${members.length})`}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in" id="create-modal-container">
          <div className="bg-[#0c0c0c] border border-white/10 max-w-md w-full rounded-2xl p-6 relative shadow-2xl">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-4 mb-6">
              <h3 className="text-xl font-bold text-white font-display flex items-center gap-2">
                <Plus className="text-neon-green" size={20} />
                Nova Comunidade
              </h3>
              <p className="text-xs text-gray-400">
                Segmentos de comunidades do WhatsApp. Agrupe contatos relevantes com alta densidade de tags e leads segmentados.
              </p>
            </div>

            <form onSubmit={handleCreateCommunity} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Nome da Comunidade</label>
                <input
                  type="text"
                  placeholder="Ex: Novos Alunos 2026, Dropshipping Vip"
                  value={newCommName}
                  onChange={(e) => setNewCommName(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 p-3 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-neon-green"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">Descrição</label>
                <input
                  type="text"
                  placeholder="Resumo longo sobre quem está nessa comunidade."
                  value={newCommDesc}
                  onChange={(e) => setNewCommDesc(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 p-3 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-neon-green"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400">ID da Comunidade WhatsApp (opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: 12036319803123@g.us (JID do grupo de avisos)"
                  value={newCommJid}
                  onChange={(e) => setNewCommJid(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 p-3 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-neon-green"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-300 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-neon-green hover:bg-[#00e600] text-black px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                >
                  Construir Comunidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
