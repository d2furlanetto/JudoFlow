import React from 'react';
import { useAuth } from '../firebase/AuthContext';
import { motion } from 'motion/react';
import { CreditCard, Download, History, AlertCircle } from 'lucide-react';

export const Finance: React.FC = () => {
  const { profile } = useAuth();

  const history = [
    { id: '1', month: 'Janeiro', amount: 'R$ 150,00', status: 'Pago', date: '05/01/2024' },
    { id: '2', month: 'Fevereiro', amount: 'R$ 150,00', status: 'Pago', date: '04/02/2024' },
    { id: '3', month: 'Março', amount: 'R$ 150,00', status: 'Pendente', date: '-' },
  ];

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-stone-900">Financeiro</h2>
        <p className="text-stone-500 text-sm">Gerencie suas mensalidades e pagamentos</p>
      </section>

      {/* Current Bill */}
      <div className="bg-stone-900 text-white p-6 rounded-3xl shadow-xl shadow-stone-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Próximo Vencimento</p>
            <p className="text-2xl font-bold mt-1">10 de Março</p>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl">
            <CreditCard size={24} />
          </div>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Valor</p>
            <p className="text-3xl font-bold">R$ 150,00</p>
          </div>
          <button className="bg-white text-stone-900 px-6 py-3 rounded-2xl font-bold text-sm">
            Pagar Agora
          </button>
        </div>
      </div>

      {/* Warning if overdue */}
      {profile?.tuitionStatus === 'overdue' && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-800">
          <AlertCircle size={20} />
          <p className="text-sm font-bold">Você possui mensalidades em atraso.</p>
        </div>
      )}

      {/* History */}
      <section className="space-y-3">
        <h3 className="font-bold text-stone-900 flex items-center gap-2">
          <History size={18} className="text-blue-600" />
          Histórico
        </h3>
        <div className="space-y-3">
          {history.map((h) => (
            <div key={h.id} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="font-bold text-stone-900">{h.month}</p>
                <p className="text-xs text-stone-500">{h.date !== '-' ? `Pago em ${h.date}` : 'Aguardando pagamento'}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-stone-900">{h.amount}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${h.status === 'Pago' ? 'text-green-600' : 'text-orange-500'}`}>
                    {h.status}
                  </p>
                </div>
                {h.status === 'Pago' && (
                  <button className="p-2 bg-stone-50 rounded-xl text-stone-400">
                    <Download size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
