import React, { useState, useEffect } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { Users, Shield, Award, AlertCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!db) return;
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = querySnapshot.docs.map(doc => doc.data() as UserProfile);
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (uid: string, newRole: 'student' | 'professor' | 'admin') => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
      setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <Shield size={32} />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Acesso Negado</h2>
        <p className="text-stone-500 text-sm mt-2">
          Esta área é restrita para administradores do dojo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-stone-900">Painel Admin</h2>
        <p className="text-stone-500 text-sm">Gerencie alunos e permissões</p>
      </section>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3 text-blue-800">
        <AlertCircle size={20} className="mt-0.5 shrink-0" />
        <p className="text-xs leading-relaxed">
          <strong>Dica:</strong> Como você é o administrador, pode alterar o papel de qualquer usuário para 'Professor' ou 'Admin' diretamente nesta lista.
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="font-bold text-stone-900 flex items-center gap-2">
          <Users size={18} className="text-blue-600" />
          Usuários Cadastrados ({users.length})
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.uid} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-stone-900">{u.displayName}</p>
                    <p className="text-xs text-stone-500">{u.email}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 
                    u.role === 'professor' ? 'bg-blue-100 text-blue-600' : 
                    'bg-stone-100 text-stone-600'
                  }`}>
                    {u.role}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mr-auto">Alterar Papel:</p>
                  <button 
                    onClick={() => handleRoleChange(u.uid, 'student')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${u.role === 'student' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500'}`}
                  >
                    Aluno
                  </button>
                  <button 
                    onClick={() => handleRoleChange(u.uid, 'professor')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${u.role === 'professor' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500'}`}
                  >
                    Prof
                  </button>
                  <button 
                    onClick={() => handleRoleChange(u.uid, 'admin')}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${u.role === 'admin' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500'}`}
                  >
                    Admin
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
