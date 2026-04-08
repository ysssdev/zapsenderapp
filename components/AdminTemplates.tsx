import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Clock, Check, X, AlertCircle } from 'lucide-react';
import { collection, query, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Template } from '../types';

const AdminTemplates = () => {
  const [templates, setTemplates] = useState<(Template & { userEmail?: string })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    // Admins can see all templates
    const q = query(collection(db, 'templates'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const templateData: (Template & { userEmail?: string })[] = [];
      
      for (const document of snapshot.docs) {
        const data = document.data() as Template;
        
        // Fetch user email for display (optional, but helpful for admin)
        let userEmail = 'Usuário Desconhecido';
        try {
          const userDoc = await getDoc(doc(db, 'users', data.userId));
          if (userDoc.exists()) {
            userEmail = userDoc.data().email;
          }
        } catch (e) {
          console.error("Error fetching user email", e);
        }

        templateData.push({ ...data, userEmail });
      }

      // Sort by updatedAt descending
      templateData.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setTemplates(templateData);
    }, (error) => {
      console.error("Error fetching templates:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (id: string) => {
    if (window.confirm('Tem certeza que deseja aprovar este template?')) {
      try {
        await updateDoc(doc(db, 'templates', id), {
          status: 'APPROVED',
          rejectionReason: null,
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error("Error approving template:", error);
        alert("Erro ao aprovar template.");
      }
    }
  };

  const handleOpenRejectModal = (template: Template) => {
    setSelectedTemplate(template);
    setRejectionReason(template.rejectionReason || '');
    setIsRejectModalOpen(true);
  };

  const handleCloseRejectModal = () => {
    setIsRejectModalOpen(false);
    setSelectedTemplate(null);
    setRejectionReason('');
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    try {
      await updateDoc(doc(db, 'templates', selectedTemplate.id), {
        status: 'REJECTED',
        rejectionReason: rejectionReason,
        updatedAt: new Date().toISOString()
      });
      handleCloseRejectModal();
    } catch (error) {
      console.error("Error rejecting template:", error);
      alert("Erro ao reprovar template.");
    }
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.userEmail && t.userEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1"><CheckCircle size={12} /> Aprovado</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-1"><XCircle size={12} /> Reprovado</span>;
      case 'PENDING':
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center gap-1"><Clock size={12} /> Pendente</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white">Aprovação de Templates</h2>
        <p className="text-gray-400 text-sm mt-1">Gerencie os templates submetidos pelos usuários.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 flex-1">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, conteúdo ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-white focus:ring-0 w-full placeholder-gray-500"
          />
        </div>
        
        <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === status 
                  ? 'bg-white/10 text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              {status === 'ALL' ? 'Todos' : 
               status === 'PENDING' ? 'Pendentes' : 
               status === 'APPROVED' ? 'Aprovados' : 'Reprovados'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-bold text-white">{template.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Usuário: {template.userEmail}</p>
              </div>
              {getStatusBadge(template.status)}
            </div>
            
            <div className="flex-1 bg-black/20 rounded-xl p-4 my-4 border border-white/5">
              <p className="text-gray-300 text-sm whitespace-pre-wrap">{template.content}</p>
            </div>

            {template.status === 'REJECTED' && template.rejectionReason && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2 text-sm text-red-400">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p><strong>Motivo da reprovação:</strong> {template.rejectionReason}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              {template.status !== 'APPROVED' && (
                <button 
                  onClick={() => handleApprove(template.id)}
                  className="px-4 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm"
                >
                  <Check size={16} /> Aprovar
                </button>
              )}
              {template.status !== 'REJECTED' && (
                <button 
                  onClick={() => handleOpenRejectModal(template)}
                  className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm"
                >
                  <X size={16} /> Reprovar
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            Nenhum template encontrado com os filtros atuais.
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Reprovar Template</h3>
              <button onClick={handleCloseRejectModal} className="text-gray-400 hover:text-white transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleReject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Motivo da Reprovação (Opcional mas recomendado)</label>
                <textarea
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors resize-none"
                  placeholder="Ex: O template contém links não permitidos..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseRejectModal}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600 transition-colors"
                >
                  Confirmar Reprovação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTemplates;
