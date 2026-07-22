import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { patientWelcomeSchema } from './types';
import type { PatientWelcomeFormData } from './types';

export const usePatientWelcome = () => {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const hashString = window.location.hash;
  const queryStr = hashString.includes('?') ? hashString.split('?')[1] : '';
  const urlParams = new URLSearchParams(queryStr);
  const defaultName = urlParams.get('name') || '';

  const formMethods = useForm<PatientWelcomeFormData>({
    resolver: zodResolver(patientWelcomeSchema),
    defaultValues: {
      fullName: defaultName,
      socialName: '',
      odorSensitivity: false,
      coldSensitivity: false,
      specificFocus: '',
      musicPreference: '',
    },
  });

  const submitWelcomeForm = async (data: PatientWelcomeFormData) => {
    setSubmitStatus('loading');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const existingData = JSON.parse(localStorage.getItem('climesq_patients') || '[]');
      
      const hashString = window.location.hash;
      const queryStr = hashString.includes('?') ? hashString.split('?')[1] : '';
      const urlParams = new URLSearchParams(queryStr);
      const patientId = urlParams.get('id');

      if (patientId) {
        const updatedData = existingData.map((p: any) => {
          if (p.id === patientId) {
            return { ...p, ...data, status: 'Respondido', respondedAt: new Date().toISOString() };
          }
          return p;
        });
        localStorage.setItem('climesq_patients', JSON.stringify(updatedData));
        console.log('Paciente atualizado:', patientId);
      } else {
        const newEntry = {
          ...data,
          id: crypto.randomUUID(),
          status: 'Respondido',
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('climesq_patients', JSON.stringify([newEntry, ...existingData]));
        console.log('Novo registro criado:', newEntry);
      }
      
      setSubmitStatus('success');
    } catch (error) {
      console.error('Erro na submissão:', error);
      setSubmitStatus('error');
    }
  };

  const resetForm = () => {
    setSubmitStatus('idle');
    formMethods.reset();
  };

  return {
    formMethods,
    submitStatus,
    submitWelcomeForm,
    resetForm,
  };
};
