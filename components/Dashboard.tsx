import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  Activity, 
  Send, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Zap, 
  Smartphone, 
  Upload, 
  Plus, 
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MOCK_DATA = [
  { name: 'Seg', envios: 4000, falhas: 240 },
  { name: 'Ter', envios: 3000, falhas: 139 },
  { name: 'Qua', envios: 2000, falhas: 98 },
  { name: 'Qui', envios: 2780, falhas: 39 },
  { name: 'Sex', envios: 1890, falhas: 48 },
  { name: 'Sab', envios: 2390, falhas: 38 },
  { name: 'Dom', envios: 3490, falhas: 43 },
];

const ZERO_DATA = [
  { name: 'Seg', envios: 0, falhas: 0 },
  { name: 'Ter', envios: 0, falhas: 0 },
  { name: 'Qua', envios: 0, falhas: 0 },
  { name: 'Qui', envios: 0, falhas: 0 },
  { name: 'Sex', envios: 0, falhas: 0 },
  { name: 'Sab', envios: 0, falhas: 0 },
  { name: 'Dom', envios: 0, falhas: 0 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If creditsUsedToday is 0, we assume it's a fresh account for this demo
  const isNewUser = user?.creditsUsedToday === 0;
  const data = isNewUser ? ZERO_DATA : MOCK_DATA;

  const StatCard = ({ title, value, sub, icon: Icon, color, trend }: any) => (
    <div className="relative overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 group hover:border-neon-green/30 transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(0,255,0,0.1)]">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        <Icon size={80} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2.5 rounded-xl bg-white/5 ${color} border border-white/10 shadow-sm`}>
            <Icon size={20} />
          </div>
          {trend && (
             <span className="text-xs font-bold text-neon-green bg-neon-green/10 px-2 py-1 rounded-full border border-neon-green/20 flex items-center gap-1 neon-border">
               <TrendingUp size={10} /> {trend}
             </span>
          )}
        </div>
        <h3 className="text-3xl font-display font-bold text-white tracking-tight mb-1">{value}</h3>
        <p className="text-sm text-gray-400 font-medium">{title}</p>
        <div className="mt-3 text-xs text-gray-500">{sub}</div>
      </div>
      {/* Bottom Glow Line */}
      <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-neon-green to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    </div>
  );

  const QuickAction = ({ icon: Icon, label, path, primary = false }: any) => (
    <button 
      onClick={() => navigate(path)}
      className={`relative group flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
        primary 
          ? 'bg-neon-green/10 border-neon-green/30 hover:border-neon-green/50 hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]' 
          : 'bg-[#0a0a0a] border-white/5 hover:bg-white/5 hover:border-white/10 shadow-sm'
      }`}
    >
      <div className={`p-3 rounded-full ${primary ? 'bg-neon-green text-black shadow-[0_0_15px_rgba(0,255,0,0.5)]' : 'bg-white/5 text-gray-400 group-hover:text-white group-hover:scale-110 transition-transform'}`}>
        <Icon size={20} />
      </div>
      <span className={`text-sm font-medium ${primary ? 'text-neon-green' : 'text-gray-400 group-hover:text-white'}`}>
        {label}
      </span>
    </button>
  );

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      
      {/* Hero / Welcome Section */}
      <div className="relative rounded-3xl overflow-hidden border border-neon-green/20 shadow-[0_0_30px_rgba(0,255,0,0.1)]">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-[#050505] to-black opacity-90" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        
        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
              Automação Profissional
            </h1>
            <p className="text-gray-400 max-w-xl text-lg">
              Sua operação de disparos está rodando com <span className="text-neon-green font-bold neon-text">98.2%</span> de eficiência.
              Otimize seus resultados agora.
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/app/campaigns?create=true')}
              className="bg-neon-green text-black hover:bg-neon-green/90 px-6 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all flex items-center gap-2 transform hover:-translate-y-1"
            >
              <Zap size={18} className="fill-current" />
              Novo Disparo
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAction icon={Plus} label="Criar Campanha" path="/app/campaigns?create=true" primary />
        <QuickAction icon={Smartphone} label="Conectar WhatsApp" path="/app/instances" />
        <QuickAction icon={Upload} label="Importar Contatos" path="/app/contacts" />
        <QuickAction icon={CreditCard} label="Recarregar Créditos" path="/app/billing" />
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Envios Hoje" 
          value={isNewUser ? '0' : '14,293'} 
          sub="Disparos realizados com sucesso"
          icon={Send} 
          color="text-neon-cyan" 
          trend={!isNewUser ? "+12%" : null}
        />
        <StatCard 
          title="Taxa de Entrega" 
          value={isNewUser ? '0%' : '98.2%'} 
          sub="Performance da última hora"
          icon={Activity} 
          color="text-neon-green" 
          trend="Estável"
        />
        <StatCard 
          title="Base de Contatos" 
          value={isNewUser ? '0' : '84,392'} 
          sub="Leads ativos na plataforma"
          icon={Users} 
          color="text-neon-purple" 
          trend={!isNewUser ? "+2.4k" : null}
        />
        <StatCard 
          title="Falhas / Bloqueios" 
          value={isNewUser ? '0%' : '0.4%'} 
          sub="Status de saúde da carteira"
          icon={AlertCircle} 
          color="text-red-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl relative shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp size={18} className="text-neon-green" />
              Performance de Envios
            </h3>
            <select className="bg-[#050505] border border-white/10 rounded-lg text-xs text-gray-400 px-2 py-1 focus:outline-none focus:border-neon-green/50 text-white">
              <option>Últimos 7 dias</option>
              <option>Últimos 30 dias</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEnvios" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF00" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00FF00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#666" 
                  tick={{fill: '#999', fontSize: 12}} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="#666" 
                  tick={{fill: '#999', fontSize: 12}} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 10, 10, 0.9)', 
                    borderColor: '#333', 
                    color: '#fff',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 20px rgba(0, 255, 0, 0.1)'
                  }}
                  itemStyle={{ color: '#00FF00' }}
                  cursor={{stroke: '#333', strokeWidth: 1}}
                />
                <Area 
                  type="monotone" 
                  dataKey="envios" 
                  stroke="#00FF00" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorEnvios)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart */}
        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-white mb-2">Saúde da Operação</h3>
          <p className="text-sm text-gray-400 mb-6">Monitoramento de falhas por dia</p>
          
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#666" 
                  tick={{fill: '#999', fontSize: 10}} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10}
                />
                <Tooltip 
                  cursor={{fill: '#111'}}
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 10, 10, 0.9)', 
                    borderColor: '#333',
                    borderRadius: '8px',
                    color: '#fff',
                    boxShadow: '0 4px 20px rgba(0, 255, 0, 0.1)'
                  }}
                />
                <Bar dataKey="falhas" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.falhas > 100 ? '#ef4444' : '#00FFFF'} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-sm">
             <span className="text-gray-400">Status Geral:</span>
             <span className="text-neon-green font-bold flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"/>
               Operacional
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;