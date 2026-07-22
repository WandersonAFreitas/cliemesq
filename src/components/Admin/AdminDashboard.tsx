import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Coffee, Wind, AlertCircle, Plus, MessageCircle, Mail, CheckCircle2, Clock, Copy, Link as LinkIcon } from 'lucide-react';
import { PatientRegistrationModal } from './PatientRegistrationModal';
import logoSrc from '../../assets/logo.jpg';

interface PatientRecord {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  status: 'Aguardando' | 'Respondido';
  createdAt: string;
  respondedAt?: string;
  // Opcionais das respostas:
  socialName?: string;
  beverage?: string;
  musicPreference?: string;
  odorSensitivity?: boolean;
  coldSensitivity?: boolean;
  specificFocus?: string;
}

export const AdminDashboard: React.FC = () => {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = () => {
    const data = JSON.parse(localStorage.getItem('climesq_patients') || '[]');
    setPatients(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSavePatient = (data: any) => {
    const newEntry: PatientRecord = {
      id: crypto.randomUUID(),
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      status: 'Aguardando',
      createdAt: new Date().toISOString()
    };
    
    const updated = [newEntry, ...patients];
    localStorage.setItem('climesq_patients', JSON.stringify(updated));
    setPatients(updated);
    setIsModalOpen(false);
  };

  const getShareUrl = (id: string) => {
    const baseHref = window.location.href.split('#')[0];
    const cleanBase = baseHref.endsWith('/') ? baseHref.slice(0, -1) : baseHref;
    return `${cleanBase}/#/acolhimento?id=${id}`;
  };

  const shareViaWhatsApp = (patient: PatientRecord) => {
    if (!patient.phone) return alert('Paciente sem telefone cadastrado.');
    const link = getShareUrl(patient.id);
    const text = encodeURIComponent(`Olá ${patient.fullName}, estamos aguardando você na CLIMESQ! Por favor, acesse o link abaixo para nos contar suas preferências de acolhimento para a sua consulta de hoje:\n\n${link}`);
    window.open(`https://wa.me/${patient.phone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  const shareViaEmail = (patient: PatientRecord) => {
    if (!patient.email) return alert('Paciente sem e-mail cadastrado.');
    const link = getShareUrl(patient.id);
    const subject = encodeURIComponent('Suas preferências de Acolhimento - CLIMESQ');
    const body = encodeURIComponent(`Olá ${patient.fullName},\n\nEstamos aguardando você na CLIMESQ! Por favor, acesse o link abaixo para nos contar suas preferências de acolhimento para a sua consulta de hoje:\n\n${link}`);
    window.open(`mailto:${patient.email}?subject=${subject}&body=${body}`, '_blank');
  };

  const copyToClipboard = async (id: string) => {
    try {
      const link = getShareUrl(id);
      await navigator.clipboard.writeText(link);
      alert('Link copiado para a área de transferência!');
    } catch (err) {
      alert('Erro ao copiar o link.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-teal-900 text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src={logoSrc} alt="CLIMESQ" className="h-10 w-10 rounded-full border border-teal-700 object-cover" />
          <h1 className="text-xl font-bold">Painel Administrativo</h1>
        </div>
        <Link to="/acolhimento" className="flex items-center text-teal-200 hover:text-white transition-colors text-sm font-medium bg-teal-800 px-3 py-1.5 rounded-md hover:bg-teal-700">
          <LinkIcon size={16} className="mr-1.5" />
          Ver Formulário Público
        </Link>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestão de Acolhimento</h2>
            <p className="text-gray-600 mt-1">Gerencie os links enviados e as preferências dos pacientes.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg shadow-sm font-semibold text-sm transition-colors"
          >
            <Plus size={18} className="mr-2" />
            Novo Paciente
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente / Contato
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospitalidade
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Foco da Consulta
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Compartilhar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Nenhum paciente cadastrado ainda.
                    </td>
                  </tr>
                ) : (
                  patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${patient.status === 'Respondido' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'}`}>
                            <User size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{patient.fullName}</div>
                            <div className="text-xs text-gray-500">{patient.phone || patient.email || 'Sem contato'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {patient.status === 'Respondido' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle2 size={12} className="mr-1" /> Respondido
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock size={12} className="mr-1" /> Aguardando
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {patient.status === 'Respondido' ? (
                           <div className="flex flex-col space-y-1">
                             <div className="flex items-center text-sm text-gray-700">
                               <Coffee size={14} className="mr-2 text-amber-600" />
                               {patient.beverage}
                             </div>
                             {(patient.coldSensitivity || patient.odorSensitivity) && (
                               <div className="flex flex-wrap gap-1 mt-1">
                                 {patient.coldSensitivity && (
                                   <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">
                                     <Wind size={8} className="mr-1" /> Frio
                                   </span>
                                 )}
                                 {patient.odorSensitivity && (
                                   <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-100 text-orange-800">
                                     <AlertCircle size={8} className="mr-1" /> Odores
                                   </span>
                                 )}
                               </div>
                             )}
                           </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-xs truncate" title={patient.specificFocus || 'Nenhum'}>
                          {patient.status === 'Respondido' ? (
                            patient.specificFocus ? (
                              <span className="italic text-gray-800">"{patient.specificFocus}"</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )
                          ) : (
                             <span className="text-sm text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex items-center justify-center space-x-2">
                           <button 
                             onClick={() => shareViaWhatsApp(patient)}
                             title="Compartilhar via WhatsApp"
                             className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors disabled:opacity-30"
                             disabled={!patient.phone}
                           >
                             <MessageCircle size={18} />
                           </button>
                           <button 
                             onClick={() => shareViaEmail(patient)}
                             title="Compartilhar via E-mail"
                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-30"
                             disabled={!patient.email}
                           >
                             <Mail size={18} />
                           </button>
                           <button 
                             onClick={() => copyToClipboard(patient.id)}
                             title="Copiar Link"
                             className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                           >
                             <Copy size={18} />
                           </button>
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <PatientRegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSavePatient} 
      />
    </div>
  );
};
