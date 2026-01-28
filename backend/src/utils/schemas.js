import { z } from 'zod';

// Schéma pour un collaborateur
export const collaboratorSchema = z.object({
  firstname: z.string().min(1, 'Le prénom est requis'),
  lastname: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  gender: z.string().min(1, 'Le genre est requis'),
  role: z.string().min(1, 'Le rôle est requis').max(500, 'Le rôle ne peut pas dépasser 500 caractères')
});

// Schéma pour un lien social
export const socialSchema = z.object({
  network_id: z.number().int().positive('ID réseau social invalide'),
  url: z.string().url('URL invalide').max(500, 'URL trop longue')
});

// Schéma principal pour la soumission
export const submissionSchema = z.object({
  // Infos vidéo
  english_title: z.string().min(1, 'Le titre anglais est requis').max(255, 'Le titre ne peut pas dépasser 255 caractères'),
  original_title: z.string().max(255, 'Le titre original ne peut pas dépasser 255 caractères').optional(),
  language: z.string().min(1, 'La langue est requise'),
  english_synopsis: z.string().min(1, 'Le synopsis anglais est requis').max(300, 'Le synopsis ne peut pas dépasser 300 caractères'),
  original_synopsis: z.string().max(300, 'Le synopsis original ne peut pas dépasser 300 caractères').optional(),
  classification: z.enum(['IA', 'hybrid'], {
    errorMap: () => ({ message: 'Classification invalide. Valeurs acceptées : 100% IA, Hybrid' })
  }),
  tech_stack: z.string().min(1, 'La stack technique est requise').max(500, 'La stack technique ne peut pas dépasser 500 caractères'),
  creative_method: z.string().min(1, 'La méthode créative est requise').max(500, 'La méthode créative ne peut pas dépasser 500 caractères'),
  
  // Infos créateur
  creator_firstname: z.string().min(1, 'Le prénom du créateur est requis'),
  creator_lastname: z.string().min(1, 'Le nom du créateur est requis'),
  creator_email: z.string().email('Email du créateur invalide'),
  creator_phone: z.string().max(30, 'Le téléphone ne peut pas dépasser 30 caractères').optional(),
  creator_mobile: z.string().min(1, 'Le mobile est requis').max(30, 'Le mobile ne peut pas dépasser 30 caractères'),
  creator_gender: z.string().min(1, 'Le genre du créateur est requis'),
  creator_country: z.string().min(1, 'Le pays est requis'),
  creator_address: z.string().min(1, 'L\'adresse est requise'),
  referral_source: z.string().max(255, 'La source de référence ne peut pas dépasser 255 caractères').optional(),
  terms_of_use: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter les conditions d\'utilisation'
  }),
  
  // Données optionnelles
  collaborators: z.array(collaboratorSchema).optional(),
  socials: z.array(socialSchema).optional()
});
