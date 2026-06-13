import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { X, User, Image as ImageIcon, Upload, Check, Loader2, Camera, RefreshCw } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  { id: 'av1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces', label: 'Estudio Feminino' },
  { id: 'av2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces', label: 'Tecnológico Masculino' },
  { id: 'av3', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces', label: 'Vibrante Feminino' },
  { id: 'av4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces', label: 'Estilo Masculino' },
  { id: 'av5', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces', label: 'Elegante Feminino' },
  { id: 'av6', url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&h=150&fit=crop&crop=faces', label: 'Tech 3D Abstract' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !user) return null;

  // Handle Drag & Drop behavior
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Formato inválido. Por favor, selecione um arquivo de imagem.');
      return;
    }

    // Limit size to 1MB (as firestore document limit is 1MB and we inline base64)
    if (file.size > 1024 * 1024) {
      setError('A imagem é muito grande. Escolha uma imagem de até 1MB para melhor desempenho.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === 'string') {
        setAvatarUrl(event.target.result);
        setError(null);
      }
    };
    reader.onerror = () => {
      setError('Ocorreu um erro ao carregar a imagem.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const selectPreset = (url: string) => {
    setAvatarUrl(url);
    setError(null);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('O nome não pode estar em branco.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await updateProfile(name, avatarUrl);
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao salvar alterações no perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          id="profile-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal body */}
        <motion.div
          id="profile-modal-container"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative bg-[#0d0d0d] border border-white/10 w-full max-w-xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 p-6 md:p-8 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-neon-green/10 text-neon-green rounded-xl border border-neon-green/20">
                <User size={22} className="drop-shadow-[0_0_8px_rgba(0,255,0,0.4)]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">Editar Perfil</h3>
                <p className="text-xs text-gray-400">Personalize o seu nome de usuário e foto eletronicamente</p>
              </div>
            </div>
            <button
              id="profile-close-btn"
              onClick={onClose}
              className="p-1 px-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form id="profile-edit-form" onSubmit={handleSave} className="space-y-6">
            {error && (
              <div id="profile-error-msg" className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            {success && (
              <div id="profile-success-msg" className="p-4 bg-neon-green/10 border border-neon-green/20 text-neon-green rounded-xl text-sm font-medium flex items-center gap-2">
                <Check size={18} />
                Perfil atualizado com sucesso!
              </div>
            )}

            {/* Avatar section */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-300 uppercase tracking-wider block">Foto de Perfil</label>
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Preview and Upload Trigger */}
                <div className="relative group flex-shrink-0">
                  <div className="w-24 h-24 rounded-full border border-white/10 overflow-hidden bg-[#050505] shadow-inner relative">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <User size={36} />
                      </div>
                    )}
                  </div>
                  <button
                    id="profile-avatar-trigger"
                    type="button"
                    onClick={triggerFileSelect}
                    className="absolute bottom-0 right-0 p-2 bg-neon-green text-[#050505] rounded-full hover:scale-110 transition-transform shadow-lg cursor-pointer"
                    title="Carregar foto local"
                  >
                    <Camera size={14} className="stroke-[2.5]" />
                  </button>
                </div>

                <div className="flex-1 w-full space-y-2">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Carregue ou arraste um arquivo de imagem (`.png`, `.jpg`) de até <span className="text-white">1MB</span>, cole um link direto ou selecione uma de nossas artes prontas abaixo.
                  </p>
                  
                  {/* Drag and Drop Zone */}
                  <div
                    id="profile-drag-zone"
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileSelect}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-1.5 ${
                      dragActive 
                        ? 'border-neon-green bg-neon-green/5 text-neon-green' 
                        : 'border-white/10 bg-[#070707] hover:border-white/20 text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <Upload size={18} className={dragActive ? 'animate-bounce' : ''} />
                    <span className="text-xs font-semibold">Arraste ou clique para selecionar</span>
                    <input
                      id="profile-file-input"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Avatares Recomendados</label>
              <div id="profile-presets" className="grid grid-cols-6 gap-3 pt-1">
                {PRESET_AVATARS.map((av) => {
                  const isSelected = avatarUrl === av.url;
                  return (
                    <button
                      key={av.id}
                      id={`profile-preset-${av.id}`}
                      type="button"
                      onClick={() => selectPreset(av.url)}
                      className={`relative w-12 h-12 rounded-full overflow-hidden border transition-all ${
                        isSelected 
                          ? 'border-neon-green scale-105 shadow-[0_0_10px_rgba(0,255,0,0.4)] ring-1 ring-neon-green' 
                          : 'border-white/10 hover:border-white/30 hover:scale-105'
                      }`}
                      title={av.label}
                    >
                      <img src={av.url} alt={av.label} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-neon-green/20 flex items-center justify-center">
                          <Check size={16} className="text-neon-green stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom URL Input */}
            <div className="space-y-2">
              <label htmlFor="profile-url-input" className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Ou link direto da imagem</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4.5 h-4.5" />
                <input
                  id="profile-url-input"
                  type="url"
                  placeholder="https://exemplo.com/sua-foto.jpg"
                  value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 transition-all font-mono"
                />
              </div>
            </div>

            {/* Display Name Input */}
            <div className="space-y-2">
              <label htmlFor="profile-name-input" className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Nome do Usuário</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4.5 h-4.5" />
                <input
                  id="profile-name-input"
                  type="text"
                  required
                  placeholder="Seu nome"
                  maxLength={50}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/50 transition-all font-medium"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 pt-3 justify-end border-t border-white/10">
              <button
                id="profile-cancel-btn"
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                id="profile-save-btn"
                type="submit"
                disabled={loading || success}
                className="px-6 py-2.5 rounded-xl bg-neon-green text-[#050505] hover:bg-[#00e600] disabled:bg-opacity-50 transition-all text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Salvando...
                  </>
                ) : success ? (
                  <>
                    <Check size={16} className="stroke-[3]" />
                    Salvo!
                  </>
                ) : (
                  <>
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
