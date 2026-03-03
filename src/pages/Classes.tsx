import React, { useState } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Users, ChevronLeft } from 'lucide-react';

export const Classes: React.FC = () => {
  const { profile } = useAuth();
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  const classes = [
    { id: '1', name: 'Judô Infantil', time: '18:00', students: [
      { id: 's1', name: 'João Silva' },
      { id: 's2', name: 'Maria Santos' },
      { id: 's3', name: 'Pedro Oliveira' },
    ]},
    { id: '2', name: 'Judô Adulto', time: '19:30', students: [
      { id: 's4', name: 'Carlos Souza' },
      { id: 's5', name: 'Ana Costa' },
    ]},
  ];

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  if (selectedClass) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setSelectedClass(null)}
          className="flex items-center gap-2 text-stone-500 font-medium text-sm"
        >
          <ChevronLeft size={18} /> Voltar
        </button>

        <div className="bg-stone-900 text-white p-6 rounded-3xl">
          <h2 className="text-2xl font-bold">{selectedClass.name}</h2>
          <p className="text-stone-400 text-sm">{selectedClass.time} • Hoje</p>
          <div className="flex items-center gap-2 mt-4">
            <Users size={16} />
            <span className="text-sm font-medium">{selectedClass.students.length} alunos inscritos</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-stone-900 px-1">Lista de Chamada</h3>
          {selectedClass.students.map((student: any) => (
            <div key={student.id} className="bg-white p-4 rounded-2xl border border-stone-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center font-bold text-stone-500">
                  {student.name[0]}
                </div>
                <p className="font-bold text-stone-900">{student.name}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleAttendance(student.id)}
                  className={`p-2 rounded-xl transition-all ${
                    attendance[student.id] === false 
                      ? 'bg-red-500 text-white' 
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  <X size={20} />
                </button>
                <button 
                  onClick={() => toggleAttendance(student.id)}
                  className={`p-2 rounded-xl transition-all ${
                    attendance[student.id] === true 
                      ? 'bg-green-500 text-white' 
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  <Check size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 mt-4">
          Finalizar Chamada
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-stone-900">Aulas</h2>
        <p className="text-stone-500 text-sm">Gerencie suas turmas e presenças</p>
      </section>

      <div className="space-y-4">
        {classes.map((c) => (
          <motion.div 
            key={c.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => profile?.role !== 'student' && setSelectedClass(c)}
            className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
                {c.time.split(':')[0]}h
              </div>
              <div>
                <p className="font-bold text-stone-900 text-lg">{c.name}</p>
                <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">
                  {c.students.length} Alunos • Segunda e Quarta
                </p>
              </div>
            </div>
            {profile?.role !== 'student' && (
              <div className="bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-bold">
                Chamada
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
