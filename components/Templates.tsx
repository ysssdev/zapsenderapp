import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Template } from '../types';
import { v4 as uuidv4 } from 'uuid';

const Templates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    content: ''
  });

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'templates'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const templateData: Template[] = [];
      snapshot.forEach((doc) => {
        templateData.push(doc.data() as Template);
      });
      // Sort by updatedAt descending
      templateData.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setTemplates(templateData);
    }, (error) => {
      console.error("Error fetching templates:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenModal = (template?: Template) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        content: template.content
      });
    } else {
      setEditingTemplate(null);
      setFormData({ name: '', content: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
    setFormData({ name: '', content: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      const now = new Date().toISOString();
      const templateId = editingTemplate ? editingTemplate.id : uuidv4();
      
      const templateData: Template = {
        id: templateId,
        userId: auth.currentUser.uid,
        name: formData.name,
        content: formData.content,
        status: 'PENDING', // Always goes to pending when created or edited by user
        createdAt: editingTemplate ? editingTemplate.createdAt : now,
        updatedAt: now,
      };

      await setDoc(doc(db, 'templates', templateId), templateData);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Erro ao salvar template. Verifique se os campos estão corretos.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este template?')) {
      try {
        await deleteDoc(doc(db, 'templates', id));
      } catch (error) {
        console.error("Error deleting template:", error);
        alert("Erro ao excluir template.");
      }
    }
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1"><CheckCircle size={12} /> Aprovado</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-1"><XCircle size={12} /> Reprovado</span>;
      case 'PENDING':
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center gap-1"><Clock size={12} /> Em Análise</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Meus Templates</h2>
          <p className="text-gray-400 text-sm mt-1">Crie templates de mensagens para aprovação.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-neon-green text-black px-4 py-2 rounded-xl font-bold hover:bg-neon-green/90 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Template
        </button>
      </div>

      <div className="glass-panel p-4 rounded-2xl flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-white focus:ring-0 w-full placeholder-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-white truncate pr-2">{template.name}</h3>
              {getStatusBadge(template.status)}
            </div>
            
            <div className="flex-1 bg-black/20 rounded-xl p-4 mb-4 border border-white/5 relative group">
              <p className="text-gray-300 text-sm whitespace-pre-wrap line-clamp-4">{template.content}</p>
            </div>

            {template.status === 'REJECTED' && template.rejectionReason && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2 text-sm text-red-400">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>{template.rejectionReason}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 mt-auto pt-4 border-t border-white/5">
              <button 
                onClick={() => handleOpenModal(template)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                title="Editar (Voltará para análise)"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(template.id)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                title="Excluir"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            Nenhum template encontrado.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {editingTemplate ? 'Editar Template' : 'Novo Template'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {editingTemplate && editingTemplate.status !== 'PENDING' && (
                <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-2 text-sm text-yellow-500 mb-4">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p>Atenção: Ao editar este template, ele voltará para o status de "Em Análise" e precisará ser aprovado novamente.</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nome do Template</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green/50 transition-colors"
                  placeholder="Ex: Promoção Dia das Mães"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Conteúdo da Mensagem</label>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green/50 transition-colors resize-none"
                  placeholder="Olá {{nome}}, temos uma oferta especial..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  Dica: Use {'{{nome}}'} para personalizar a mensagem com o nome do contato.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-neon-green text-black px-6 py-2 rounded-xl font-bold hover:bg-neon-green/90 transition-colors"
                >
                  Salvar e Enviar para Análise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
