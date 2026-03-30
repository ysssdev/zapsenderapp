import React, { useState, useEffect, useRef } from 'react';
import { Upload, Download, Filter, Search, Tag, MoreVertical, Trash2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Contacts = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'contacts'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedContacts: any[] = [];
      snapshot.forEach((doc) => {
        fetchedContacts.push({ id: doc.id, ...doc.data() });
      });
      setContacts(fetchedContacts);
    }, (error) => {
      console.error("Error fetching contacts:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const handleExport = () => {
    if (contacts.length === 0) {
      alert('Não há contatos para exportar.');
      return;
    }

    const headers = ['id', 'name', 'phone', 'tags', 'status'];
    const csvContent = [
      headers.join(','),
      ...contacts.map(contact => [
        contact.id,
        `"${contact.name}"`,
        contact.phone,
        `"${(contact.tags || []).join(';')}"`,
        contact.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `contatos_dispzap_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const lines = text.split('\n');
      let importedCount = 0;

      // Simple CSV parser
      // Expected format: name,phone,tags (optional)
      // Skip header if present
      const startIndex = lines[0].toLowerCase().includes('name') || lines[0].toLowerCase().includes('nome') ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(',');
        
        if (parts.length >= 2) {
          const name = parts[0].replace(/^"|"$/g, '').trim();
          const phone = parts[1].replace(/^"|"$/g, '').trim();
          const tagsStr = parts[2] ? parts[2].replace(/^"|"$/g, '').trim() : '';
          const tags = tagsStr ? tagsStr.split(';').map(t => t.trim()) : [];

          try {
            await addDoc(collection(db, 'contacts'), {
              userId: user.uid,
              name,
              phone,
              tags,
              status: 'VALID',
              createdAt: new Date().toISOString()
            });
            importedCount++;
          } catch (error) {
            console.error("Error adding contact:", error);
          }
        }
      }
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      alert(`${importedCount} contatos importados com sucesso!`);
    };
    reader.readAsText(file);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      try {
        await deleteDoc(doc(db, 'contacts', id));
      } catch (error) {
        console.error("Error deleting contact:", error);
        alert("Erro ao excluir contato.");
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".csv" 
        className="hidden" 
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Base de Contatos</h2>
          <p className="text-gray-400">Gerencie leads, clientes e listas de bloqueio.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="bg-white/10 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-white/10"
          >
            <Download size={18} />
            Exportar
          </button>
          <button 
            onClick={handleImportClick}
            className="bg-gradient-to-r from-neon-green-500 to-neon-cyan-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-900/20 hover:scale-105 transition-transform"
          >
            <Upload size={18} />
            Importar CSV
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/10 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou telefone..." 
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm transition-colors">
              <Filter size={16} />
              Filtrar
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0a0a0a]/50 text-gray-400 font-medium">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Telefone</th>
                <th className="px-6 py-4">Tags</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 text-white font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-500/20 dark:to-teal-500/20 flex items-center justify-center text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                        {contact.name.charAt(0)}
                      </div>
                      {contact.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 font-mono">{contact.phone}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {contact.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-xs flex items-center gap-1">
                          <Tag size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      contact.status === 'VALID' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                      contact.status === 'INVALID' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
                    }`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(contact.id)}
                      className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Excluir Contato"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {contacts.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              Nenhum contato encontrado. Importe uma lista para começar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contacts;