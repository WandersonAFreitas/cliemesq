import { z } from 'zod';

export const patientWelcomeSchema = z.object({
  fullName: z.string().min(3, 'Nome completo é obrigatório e deve ter no mínimo 3 caracteres'),
  socialName: z.string().optional(),
  beverage: z.enum(['Café expresso', 'Chá', 'Água com gás', 'Suco', 'Não, obrigado'] as const, {
    message: 'Por favor, selecione uma opção de bebida',
  }),
  musicPreference: z.string().optional(),
  odorSensitivity: z.boolean().optional(),
  coldSensitivity: z.boolean().optional(),
  specificFocus: z.string().optional(),
  lgpdConsent: z.boolean().refine(val => val === true, {
    message: 'O consentimento é obrigatório para prosseguirmos com o atendimento',
  }),
});

export type PatientWelcomeFormData = z.infer<typeof patientWelcomeSchema>;

export interface PatientWelcomeFormProps {
  onSubmit: (data: PatientWelcomeFormData) => void;
  isSubmitting: boolean;
}
