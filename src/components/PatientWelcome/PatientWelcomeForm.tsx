import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { PatientWelcomeFormData, PatientWelcomeFormProps } from './types';

export const PatientWelcomeForm: React.FC<PatientWelcomeFormProps> = ({ onSubmit, isSubmitting }) => {
  const { register, handleSubmit, formState: { errors } } = useFormContext<PatientWelcomeFormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" aria-label="Formulário de Pré-Consulta e Acolhimento">
      
      {/* Seção: Identificação */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-800 border-b pb-2 w-full">Identificação</legend>
        
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nome completo *</label>
          <input
            id="fullName"
            type="text"
            {...register('fullName')}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 border transition-colors"
            placeholder="Digite seu nome completo"
          />
          {errors.fullName && <p id="fullName-error" className="mt-1 text-sm text-red-600" role="alert">{errors.fullName.message}</p>}
        </div>

        <div>
          <label htmlFor="socialName" className="block text-sm font-medium text-gray-700">Como prefere ser chamado / Nome Social</label>
          <input
            id="socialName"
            type="text"
            {...register('socialName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 border transition-colors"
            placeholder="Ex: João, Maria, Dra. Silva..."
          />
        </div>
      </fieldset>

      {/* Seção: Hospitalidade */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-800 border-b pb-2 w-full">Hospitalidade</legend>
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-3">Aceita uma bebida ao chegar? *</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {['Café expresso', 'Chá', 'Água com gás', 'Suco', 'Não, obrigado'].map((beverage) => (
              <div key={beverage} className="flex items-center p-3 border rounded-md hover:bg-gray-50 transition-colors">
                <input
                  id={`beverage-${beverage}`}
                  type="radio"
                  value={beverage}
                  {...register('beverage')}
                  className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor={`beverage-${beverage}`} className="ml-3 block text-sm font-medium text-gray-700 w-full cursor-pointer">
                  {beverage}
                </label>
              </div>
            ))}
          </div>
          {errors.beverage && <p className="mt-2 text-sm text-red-600" role="alert">{errors.beverage.message}</p>}
        </div>
      </fieldset>

      {/* Seção: Conforto Ambiental */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-800 border-b pb-2 w-full">Conforto Ambiental</legend>
        
        <div>
          <label htmlFor="musicPreference" className="block text-sm font-medium text-gray-700">Sua preferência musical para o som ambiente</label>
          <input
            id="musicPreference"
            type="text"
            placeholder="Ex: Jazz, MPB, Música Clássica..."
            {...register('musicPreference')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 border transition-colors"
          />
        </div>

        <div className="flex items-start space-x-3 mt-4 bg-gray-50 p-4 rounded-md">
          <div className="flex items-center h-5">
            <input
              id="odorSensitivity"
              type="checkbox"
              {...register('odorSensitivity')}
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
          </div>
          <div className="text-sm">
            <label htmlFor="odorSensitivity" className="font-medium text-gray-700 cursor-pointer">
              Sensibilidade a odores
            </label>
            <p className="text-gray-500">Prefere que evitemos o uso de aromatizadores de ambiente?</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 bg-gray-50 p-4 rounded-md">
          <div className="flex items-center h-5">
            <input
              id="coldSensitivity"
              type="checkbox"
              {...register('coldSensitivity')}
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
          </div>
          <div className="text-sm">
            <label htmlFor="coldSensitivity" className="font-medium text-gray-700 cursor-pointer">
              Sensibilidade ao frio
            </label>
            <p className="text-gray-500">Prefere que o ar-condicionado seja ajustado de forma mais branda?</p>
          </div>
        </div>
      </fieldset>

      {/* Seção: Foco da Consulta */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-800 border-b pb-2 w-full">Foco do Atendimento</legend>
        <div>
          <label htmlFor="specificFocus" className="block text-sm font-medium text-gray-700">Há algo específico que não podemos deixar de abordar hoje?</label>
          <textarea
            id="specificFocus"
            rows={3}
            placeholder="Deixe em branco se não houver um tópico específico."
            {...register('specificFocus')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-3 border transition-colors resize-none"
          ></textarea>
        </div>
      </fieldset>

      {/* Seção: LGPD e Envio */}
      <fieldset className="space-y-4 pt-6 border-t border-gray-200">
        <div className="flex items-start bg-teal-50/50 p-4 rounded-lg border border-teal-100">
          <div className="flex h-5 items-center">
            <input
              id="lgpdConsent"
              type="checkbox"
              {...register('lgpdConsent')}
              aria-invalid={!!errors.lgpdConsent}
              aria-describedby={errors.lgpdConsent ? "lgpdConsent-error" : undefined}
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 mt-1"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="lgpdConsent" className="font-semibold text-gray-800 cursor-pointer">Consentimento de Dados (LGPD) *</label>
            <p className="text-gray-600 mt-1">
              Concordo com o tratamento dos dados informados para fins exclusivos de atendimento clínico e hospitalidade, visando oferecer a melhor experiência possível.
            </p>
          </div>
        </div>
        {errors.lgpdConsent && <p id="lgpdConsent-error" className="mt-1 text-sm text-red-600 font-medium" role="alert">{errors.lgpdConsent.message}</p>}
      </fieldset>

      <div className="pt-2 pb-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70 disabled:cursor-wait transition-all"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando e Enviando...
            </span>
          ) : 'Confirmar Preferências'}
        </button>
      </div>
    </form>
  );
};
