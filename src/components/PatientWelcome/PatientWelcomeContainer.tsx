import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { usePatientWelcome } from './usePatientWelcome';
import { PatientWelcomeForm } from './PatientWelcomeForm';

export const PatientWelcomeContainer: React.FC = () => {
  const { formMethods, submitStatus, submitWelcomeForm, resetForm } = usePatientWelcome();

  // Tela de Sucesso amigável
  if (submitStatus === 'success') {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-green-50 text-center animate-fade-in" role="alert" aria-live="polite">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Estamos esperando por você!</h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Obrigado por compartilhar suas preferências. Nossa equipe preparará cada detalhe para que sua visita seja extremamente confortável e acolhedora.
        </p>
        <button
          onClick={resetForm}
          className="text-teal-600 hover:text-teal-800 font-semibold text-sm transition-colors border border-teal-100 rounded-md px-4 py-2 hover:bg-teal-50"
        >
          Ajustar respostas
        </button>
      </div>
    );
  }

  // View principal com o formulário
  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <header className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 border-b border-teal-100 text-center flex flex-col items-center">
        <img src="/logo.jpg" alt="CLIMESQ Logo" className="w-24 h-24 rounded-full shadow-md mb-4 border-4 border-white object-cover" />
        <h1 className="text-2xl font-bold text-teal-900">Pré-Consulta e Acolhimento</h1>
        <p className="mt-3 text-base text-teal-700">
          Queremos que você se sinta em casa. Por favor, dedique 1 minuto para nos contar como podemos tornar sua experiência hoje mais especial.
        </p>
      </header>
      
      <main className="p-6 sm:p-8">
        {submitStatus === 'error' && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Desculpe, tivemos um problema de conexão ao enviar suas respostas. Por favor, tente novamente em instantes.
                </p>
              </div>
            </div>
          </div>
        )}

        <FormProvider {...formMethods}>
          <PatientWelcomeForm 
            onSubmit={submitWelcomeForm} 
            isSubmitting={submitStatus === 'loading'} 
          />
        </FormProvider>
      </main>
      
      <div className="bg-gray-50 px-8 py-3 border-t border-gray-100 flex justify-end">
        <Link to="/" className="text-xs text-gray-400 hover:text-teal-600 transition-colors">
          Acesso Restrito
        </Link>
      </div>
    </div>
  );
};

export default PatientWelcomeContainer;
