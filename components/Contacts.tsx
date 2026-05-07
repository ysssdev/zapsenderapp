import React, { useState, useEffect, useRef } from 'react';
import { Upload, Download, Filter, Search, Tag, MoreVertical, Trash2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import * as XLSX from 'xlsx';

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
      // Sort contacts by phone number numerically
      const sortedContacts = [...fetchedContacts].sort((a, b) => {
        const phoneA = String(a.phone || '').replace(/\D/g, '');
        const phoneB = String(b.phone || '').replace(/\D/g, '');
        return phoneA.localeCompare(phoneB, undefined, { numeric: true });
      });
      setContacts(sortedContacts);
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

    const headers = ['id', 'name', 'phone', 'cpf', 'tags', 'status'];
    const csvContent = [
      headers.join(','),
      ...contacts.map(contact => [
        contact.id,
        `"${contact.name}"`,
        contact.phone,
        `"${contact.cpf || ''}"`,
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
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];
        if (rows.length === 0) return;

        let importedCount = 0;
        
        // Find column indices
        const headerRow = (rows[0] || []).map((h: any) => String(h || '').toLowerCase().trim());
        let nameIdx = headerRow.findIndex((h: string) => h.includes('nome') || h.includes('name'));
        let phoneIdx = headerRow.findIndex((h: string) => h === 'numero' || h.includes('número') || h.includes('telefone') || h.includes('phone') || h === 'celular');
        let cpfIdx = headerRow.findIndex((h: string) => h === 'cpf' || h.includes('documento'));
        let tagsIdx = headerRow.findIndex((h: string) => h.includes('tag'));

        // Fallbacks if headers are not clearly labeled
        if (nameIdx === -1) nameIdx = 0;
        if (phoneIdx === -1) phoneIdx = 1;
        if (cpfIdx === -1) cpfIdx = 2; // Default CPF to 3rd column if not specified
        if (tagsIdx === -1) tagsIdx = 3;

        // Determine start index for data
        const hasHeaders = headerRow.some((h: string) => h.includes('nome') || h.includes('name') || h === 'numero' || h.includes('cpf'));
        const startIndex = hasHeaders ? 1 : 0;

        const contactsToImport: any[] = [];

        for (let i = startIndex; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          let name = row[nameIdx] ? String(row[nameIdx]).trim() : '';
          const phone = row[phoneIdx] ? String(row[phoneIdx]).trim() : '';
          const cpf = row[cpfIdx] ? String(row[cpfIdx]).trim() : '';
          const tagsStr = row[tagsIdx] ? String(row[tagsIdx]).trim() : '';
          
          let tags = tagsStr ? tagsStr.split(';').map(t => t.trim()) : [];

          // If name is missing but phone exists, use phone as name
          if (!name && phone) {
            name = phone;
          }

          // Sometimes CPF might be in the tags column if it's a legacy CSV format, handling that edge case:
          let finalCpf = cpf;
          if (!finalCpf && tagsStr && /^[\d.\-\s]+$/.test(tagsStr) && tagsStr.replace(/\D/g, '').length === 11) {
             finalCpf = tagsStr;
             tags = [];
          }

          if (phone) {
            contactsToImport.push({
              userId: user.uid,
              name,
              phone,
              cpf: finalCpf,
              tags,
              status: 'VALID',
              createdAt: new Date().toISOString()
            });
          }
        }

        // Sort contactsToImport numerically by phone before saving
        contactsToImport.sort((a, b) => {
          const phoneA = String(a.phone).replace(/\D/g, '');
          const phoneB = String(b.phone).replace(/\D/g, '');
          return phoneA.localeCompare(phoneB, undefined, { numeric: true });
        });

        for (const contactData of contactsToImport) {
          try {
            await addDoc(collection(db, 'contacts'), contactData);
            importedCount++;
          } catch (error) {
            console.error("Error adding contact:", error);
          }
        }
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        alert(`${importedCount} contatos importados com sucesso!`);
      } catch (error) {
        console.error("Error parsing file:", error);
        alert("Erro ao processar o arquivo. Verifique se é um arquivo Excel ou CSV válido.");
      }
    };
    reader.readAsArrayBuffer(file);
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
        accept=".csv, .xlsx" 
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
            Importar Planilha (CSV/XLSX)
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
                <th className="px-6 py-4">CPF</th>
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
                  <td className="px-6 py-4 text-gray-400 font-mono">{contact.cpf || '-'}</td>
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