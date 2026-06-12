import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User, PlanTier } from '../types';
import { ShieldAlert, Users, CreditCard, Trash2, Edit, Save, X, Search, Activity, UserPlus } from 'lucide-react';
import { PLANS } from '../constants';

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<{ plan: PlanTier; credits: number; role: 'admin' | 'user' }>({
    plan: 'STARTER',
    credits: 0,
    role: 'user'
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleAddSpecialContacts = async () => {
    try {
      setActionLoading(true);
      setActionSuccess(null);
      
      const targetUser = users.find(u => u.email?.toLowerCase() === 'platinumpromotoria@gmail.com');
      const targetUserId = targetUser ? targetUser.id : 'platinumpromotoria@gmail.com';
      
      const SPECIAL_CONTACTS = [
        { name: "CLAUDIO DA SILVA BITTENCOURT", phone: "+55 (31) 9556-5207", cpf: "953.304.536-15", tags: ["OK"], status: "VALID" },
        { name: "JEFFERSON GABRIEL MARTINS SIMOES", phone: "+55 (31) 9590-9958", cpf: "103.114.146-48", tags: ["OK"], status: "VALID" },
        { name: "ANTONIO WAGNER SANTOS", phone: "+55 (31) 9712-1969", cpf: "638.786.746-00", tags: ["OK"], status: "VALID" },
        { name: "CASSIO DE MOURA TOBIAS", phone: "+55 (34) 9807-1907", cpf: "380.263.958-83", tags: ["OK"], status: "VALID" },
        { name: "ALDAIR JOSE GOUVEA", phone: "+55 (35) 8853-6383", cpf: "871.722.326-15", tags: ["OK"], status: "VALID" },
        { name: "DEIVID MENEGUEL", phone: "+55 (41) 9649-6636", cpf: "121.144.749-92", tags: ["OK"], status: "VALID" },
        { name: "AMADEU DO PERPETUO DE FRANCA", phone: "+55 (41) 9707-0450", cpf: "019.888.049-90", tags: ["OK"], status: "VALID" },
        { name: "GERRI ADRIANO RODRIGUES", phone: "+55 (41) 9795-1894", cpf: "965.160.039-04", tags: ["OK"], status: "VALID" },
        { name: "JARBAS COSTA RAYZER", phone: "+55 (42) 9153-1444", cpf: "793.081.989-20", tags: ["OK"], status: "VALID" },
        { name: "FERNANDO HENRIQUE CARDOSO", phone: "+55 (42) 9868-7163", cpf: "068.220.919-80", tags: ["OK"], status: "VALID" },
        { name: "JHONATAN JOSE MACHADO SANTOS", phone: "+55 (42) 9921-9246", cpf: "139.212.999-00", tags: ["OK"], status: "VALID" },
        { name: "TIAGO REPULA", phone: "+55 (42) 9938-9008", cpf: "109.234.939-13", tags: ["OK"], status: "VALID" },
        { name: "WILSON FABIO FERNANDES", phone: "+55 (42) 9945-2907", cpf: "045.015.329-04", tags: ["OK"], status: "VALID" },
        { name: "ALINE LOPES APNO", phone: "+55 (42) 9959-3136", cpf: "107.651.999-71", tags: ["OK"], status: "VALID" },
        { name: "JOSUE BUENO", phone: "+55 (42) 9992-2208", cpf: "113.784.199-01", tags: ["OK"], status: "VALID" }
      ];

      for (const contact of SPECIAL_CONTACTS) {
        const contactRef = doc(collection(db, 'contacts'));
        await setDoc(contactRef, {
          id: contactRef.id,
          userId: targetUserId,
          name: contact.name,
          phone: contact.phone,
          cpf: contact.cpf,
          tags: contact.tags,
          status: contact.status,
          createdAt: new Date().toISOString()
        });
      }

      setActionSuccess(`Sucesso! 15 contatos foram adicionados para platinumpromotoria@gmail.com (id: ${targetUserId})`);
    } catch (err: any) {
      console.error(err);
      alert("Erro ao adicionar contatos: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData: User[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push(doc.data() as User);
      });
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Erro ao buscar usuários. Verifique se você tem permissão de administrador.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditForm({
      plan: user.plan || 'STARTER',
      credits: user.credits || 0,
      role: user.role || 'user'
    });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    try {
      const userRef = doc(db, 'users', editingUser.id);
      await updateDoc(userRef, {
        plan: editForm.plan,
        credits: Number(editForm.credits),
        role: editForm.role
      });
      
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...editForm } : u));
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Erro ao atualizar usuário.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário? Esta ação é irreversível.")) return;
    
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Erro ao excluir usuário.");
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCredits = users.reduce((acc, user) => acc + (user.credits || 0), 0);
  const totalAdmins = users.filter(u => u.role === 'admin' || u.email === 'ygorsantos131421@gmail.com').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-emerald-500" />
            Painel Administrativo
          </h2>
          <p className="text-gray-400">Gerencie usuários, planos e créditos do sistema.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-4 bg-blue-500/20 text-blue-400 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total de Usuários</p>
            <h3 className="text-2xl font-bold text-white">{users.length}</h3>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Créditos Distribuídos</p>
            <h3 className="text-2xl font-bold text-white">{totalCredits.toLocaleString()}</h3>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-4">
          <div className="p-4 bg-purple-500/20 text-purple-400 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Administradores</p>
            <h3 className="text-2xl font-bold text-white">{totalAdmins}</h3>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <UserPlus size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Importador de Contatos em Lote</h3>
            <p className="text-sm text-gray-400">Adicione rapidamente os 15 contatos solicitados ao usuário <span className="text-emerald-400 font-medium font-mono">platinumpromotoria@gmail.com</span>.</p>
          </div>
        </div>

        {actionSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm font-medium">
            {actionSuccess}
          </div>
        )}

        <div className="flex flex-wrap gap-4 items-center justify-between pt-2">
          <div className="text-xs text-gray-400">
            {users.find(u => u.email?.toLowerCase() === 'platinumpromotoria@gmail.com') ? (
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Usuário já registrado no banco (ID mapeado automaticamente)
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Usuário ainda não fez login. Os contatos serão vinculados via e-mail e auto-mapeados quando ele fizer o primeiro acesso!
              </span>
            )}
          </div>
          <button
            onClick={handleAddSpecialContacts}
            disabled={actionLoading}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 transition-all font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:cursor-not-allowed"
          >
            {actionLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                Adicionando...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Adicionar 15 Contatos Agora
              </>
            )}
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-bold text-white">Usuários Cadastrados</h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar usuário..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-sm font-medium text-gray-400">Usuário</th>
                <th className="p-4 text-sm font-medium text-gray-400">Plano</th>
                <th className="p-4 text-sm font-medium text-gray-400">Créditos</th>
                <th className="p-4 text-sm font-medium text-gray-400">Role</th>
                <th className="p-4 text-sm font-medium text-gray-400 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">
                        {user.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-white/10 rounded-md text-xs font-medium text-gray-300">
                      {user.plan || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300">
                    {user.credits?.toLocaleString() || 0}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${user.role === 'admin' || user.email === 'ygorsantos131421@gmail.com' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {user.email === 'ygorsantos131421@gmail.com' ? 'admin (owner)' : (user.role || 'user')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                        title="Editar Usuário"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.email === 'ygorsantos131421@gmail.com'}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Excluir Usuário"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0a0a0a] rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Editar Usuário</h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-500 hover:text-gray-300 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nome</label>
                <input type="text" value={editingUser.name} disabled className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-gray-500 cursor-not-allowed" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Plano</label>
                <select 
                  value={editForm.plan}
                  onChange={(e) => setEditForm({...editForm, plan: e.target.value as PlanTier})}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 focus:outline-none"
                >
                  {Object.keys(PLANS).map(planKey => (
                    <option key={planKey} value={planKey}>{PLANS[planKey].name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Créditos</label>
                <input 
                  type="number" 
                  value={editForm.credits}
                  onChange={(e) => setEditForm({...editForm, credits: Number(e.target.value)})}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Permissão (Role)</label>
                <select 
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value as 'admin' | 'user'})}
                  disabled={editingUser.email === 'ygorsantos131421@gmail.com'}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="user">Usuário Padrão</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => setEditingUser(null)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveUser}
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors font-medium flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Save size={18} />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
