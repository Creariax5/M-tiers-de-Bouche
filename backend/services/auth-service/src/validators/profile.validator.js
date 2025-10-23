import { z } from 'zod';

export const updateProfileSchema = z.object({
  email: z.string().email('Email invalide').optional(),
  firstName: z.string().min(1, 'Le prénom ne peut pas être vide').trim().optional(),
  lastName: z.string().min(1, 'Le nom ne peut pas être vide').trim().optional(),
  company: z.string().min(1, 'Le nom de la société ne peut pas être vide').trim().optional(),
  logoUrl: z.string().url('URL invalide').optional(),
}).passthrough(); // Permet les champs supplémentaires (seront filtrés par le service)
