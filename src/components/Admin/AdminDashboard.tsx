import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Coffee, Wind, AlertCircle, Plus, MessageCircle, Mail, CheckCircle2, Clock, Copy, Link as LinkIcon, Menu } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const getShareUrl = (id: string, name: string) => {
    const baseHref = window.location.href.split('#')[0];
    const cleanBase = baseHref.endsWith('/') ? baseHref.slice(0, -1) : baseHref;
    return `${cleanBase}/#/acolhimento?id=${id}&name=${encodeURIComponent(name)}`;
  };

  const shareViaWhatsApp = (patient: PatientRecord) => {
    if (!patient.phone) return alert('Paciente sem telefone cadastrado.');
    const link = getShareUrl(patient.id, patient.fullName);
    const text = encodeURIComponent(`Olá ${patient.fullName}, estamos aguardando você na CLIMESQ! Por favor, acesse o link abaixo para nos contar suas preferências de acolhimento para a sua consulta de hoje:\n\n${link}`);
    
    // Pega apenas os números. Se for um número de celular/fixo do Brasil sem DDI (10 ou 11 dígitos), adiciona '55' na frente
    let phoneNum = patient.phone.replace(/\D/g, '');
    if (phoneNum.length === 10 || phoneNum.length === 11) {
      phoneNum = `55${phoneNum}`;
    }
    
    window.open(`https://wa.me/${phoneNum}?text=${text}`, '_blank');
  };

  const shareViaEmail = (patient: PatientRecord) => {
    if (!patient.email) return alert('Paciente sem e-mail cadastrado.');
    const link = getShareUrl(patient.id, patient.fullName);
    const subject = encodeURIComponent('Suas preferências de Acolhimento - CLIMESQ');
    const body = encodeURIComponent(`Olá ${patient.fullName},\n\nEstamos aguardando você na CLIMESQ! Por favor, acesse o link abaixo para nos contar suas preferências de acolhimento para a sua consulta de hoje:\n\n${link}`);
    window.open(`mailto:${patient.email}?subject=${subject}&body=${body}`, '_blank');
  };

  const copyToClipboard = async (patient: PatientRecord) => {
    try {
      const link = getShareUrl(patient.id, patient.fullName);
      await navigator.clipboard.writeText(link);
      alert('Link copiado para a área de transferência!');
    } catch (err) {
      alert('Erro ao copiar o link.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header Responsivo */}
      <header className="bg-teal-900 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={logoSrc} alt="CLIMESQ" className="h-10 w-10 rounded-full border border-teal-700 object-cover shadow-sm" />
            <h1 className="text-lg md:text-xl font-bold tracking-tight">Painel Admin</h1>
          </div>
          
          {/* Botão Mobile Menu */}
          <button 
            className="md:hidden p-2 bg-teal-800 rounded-md text-teal-100 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={20} />
          </button>

          {/* Nav Desktop */}
          <div className="hidden md:flex items-center">
            <Link to="/acolhimento" className="flex items-center text-teal-100 hover:text-white transition-colors text-sm font-medium bg-teal-800 px-4 py-2 rounded-lg shadow-sm hover:bg-teal-700 border border-teal-700">
              <LinkIcon size={16} className="mr-2" />
              Ver Formulário Público
            </Link>
          </div>
        </div>
        
        {/* Nav Mobile (Expandível) */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-teal-800 flex flex-col space-y-3">
            <Link to="/acolhimento" className="flex items-center justify-center text-white bg-teal-800 px-4 py-3 rounded-lg shadow-sm active:bg-teal-700 w-full font-medium">
              <LinkIcon size={18} className="mr-2" />
              Ver Formulário Público
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Título e Ações */}
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Gestão de Acolhimento</h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">Gerencie os links enviados e as preferências dos pacientes.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 md:py-2.5 rounded-xl md:rounded-lg shadow-md font-semibold text-sm md:text-base transition-all active:scale-[0.98]"
          >
            <Plus size={20} className="mr-2" />
            Novo Paciente
          </button>
        </div>

        {/* Container da Lista (Tabela Desktop / Cards Mobile) */}
        <div className="bg-transparent md:bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-200 overflow-hidden">
          {patients.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
              Nenhum paciente cadastrado ainda.
            </div>
          ) : (
            <div className="block w-full">
              {/* Tabela apenas visível em MD ou maior */}
              <table className="hidden md:table min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente / Contato</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospitalidade</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foco da Consulta</th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Compartilhar</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient) => (
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
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle2 size={12} className="mr-1.5" /> Respondido
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock size={12} className="mr-1.5" /> Aguardando
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {patient.status === 'Respondido' ? (
                           <div className="flex flex-col space-y-1.5">
                             <div className="flex items-center text-sm text-gray-700">
                               <Coffee size={14} className="mr-2 text-amber-600" />
                               {patient.beverage}
                             </div>
                             {(patient.coldSensitivity || patient.odorSensitivity) && (
                               <div className="flex flex-wrap gap-1.5 mt-1">
                                 {patient.coldSensitivity && (
                                   <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">
                                     <Wind size={10} className="mr-1" /> Frio
                                   </span>
                                 )}
                                 {patient.odorSensitivity && (
                                   <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-100 text-orange-800">
                                     <AlertCircle size={10} className="mr-1" /> Odores
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
                            patient.specificFocus ? <span className="italic text-gray-800">"{patient.specificFocus}"</span> : <span className="text-gray-400">-</span>
                          ) : <span className="text-gray-400">-</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <div className="flex items-center justify-center space-x-2">
                           <button onClick={() => shareViaWhatsApp(patient)} title="WhatsApp" className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors disabled:opacity-30" disabled={!patient.phone}><MessageCircle size={18} /></button>
                           <button onClick={() => shareViaEmail(patient)} title="E-mail" className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors disabled:opacity-30" disabled={!patient.email}><Mail size={18} /></button>
                           <button onClick={() => copyToClipboard(patient)} title="Copiar Link" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"><Copy size={18} /></button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Cards Mobile visíveis apenas em telas menores que MD */}
              <div className="md:hidden space-y-4">
                {patients.map((patient) => (
                  <div key={patient.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col space-y-4">
                    
                    {/* Header do Card (Nome e Status) */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${patient.status === 'Respondido' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'}`}>
                          <User size={24} />
                        </div>
                        <div>
                          <div className="text-base font-bold text-gray-900 leading-tight">{patient.fullName}</div>
                          <div className="text-sm text-gray-500 mt-0.5">{patient.phone || patient.email || 'Sem contato'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {patient.status === 'Respondido' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                          <CheckCircle2 size={14} className="mr-1.5" /> Respondido
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                          <Clock size={14} className="mr-1.5" /> Aguardando Preenchimento
                        </span>
                      )}
                    </div>

                    {/* Conteúdo (Hospitalidade) se Respondido */}
                    {patient.status === 'Respondido' && (
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
                        <div className="flex items-center text-sm text-gray-800 font-medium">
                          <Coffee size={16} className="mr-2 text-amber-600" />
                          Bebida: {patient.beverage}
                        </div>
                        
                        {(patient.coldSensitivity || patient.odorSensitivity) && (
                          <div className="flex flex-wrap gap-2">
                            {patient.coldSensitivity && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800">
                                <Wind size={12} className="mr-1.5" /> Evitar Frio
                              </span>
                            )}
                            {patient.odorSensitivity && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-orange-100 text-orange-800">
                                <AlertCircle size={12} className="mr-1.5" /> Evitar Odores
                              </span>
                            )}
                          </div>
                        )}

                        {patient.specificFocus && (
                          <div className="text-sm text-gray-700 bg-white p-3 rounded-md border border-gray-200">
                            <span className="font-semibold block text-xs text-gray-500 uppercase mb-1">Foco da Consulta:</span>
                            <span className="italic">"{patient.specificFocus}"</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Botões de Ação Mobile */}
                    <div className="pt-3 border-t border-gray-100 grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => shareViaWhatsApp(patient)}
                        disabled={!patient.phone}
                        className="flex flex-col items-center justify-center p-2 text-green-700 bg-green-50 hover:bg-green-100 rounded-xl transition-colors disabled:opacity-50 disabled:bg-gray-50 disabled:text-gray-400"
                      >
                        <MessageCircle size={20} className="mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">WhatsApp</span>
                      </button>
                      <button 
                        onClick={() => shareViaEmail(patient)}
                        disabled={!patient.email}
                        className="flex flex-col items-center justify-center p-2 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors disabled:opacity-50 disabled:bg-gray-50 disabled:text-gray-400"
                      >
                        <Mail size={20} className="mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">E-mail</span>
                      </button>
                      <button 
                        onClick={() => copyToClipboard(patient)}
                        className="flex flex-col items-center justify-center p-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                      >
                        <Copy size={20} className="mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Copiar</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}
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
