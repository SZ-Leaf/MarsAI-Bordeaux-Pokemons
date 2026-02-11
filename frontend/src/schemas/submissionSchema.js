import { z } from 'zod';

const nameSchema = z.string()
  .min(1, "Requis")
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Lettres uniquement");

const emailSchema = z.string()
  .min(1, "Requis")
  .email("Email invalide");

const phoneSchema = z.string()
  .refine(
    (val) => {
      if (!val || val.trim() === '') return false;
      const cleaned = val.replace(/[\s\-\(\)\+]/g, '');
      return /^\d{8,15}$/.test(cleaned);
    },
    "Numéro de téléphone invalide"
  );

const optionalPhoneSchema = z.string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === '') return true;
      const cleaned = val.replace(/[\s\-\(\)\+]/g, '');
      return /^\d{8,15}$/.test(cleaned);
    },
    "Numéro de téléphone invalide"
  );

const urlSchema = z.string()
  .min(1, "Requis")
  .url("URL invalide")
  .refine((val) => val.startsWith('https://'), "L'URL doit commencer par https://");

const collaboratorSchema = z.object({
  firstname: nameSchema,
  lastname: nameSchema,
  email: emailSchema,
  gender: z.string().min(1, "Requis"),
  role: z.string().min(1, "Requis").max(500, "Maximum 500 caractères")
});

const socialSchema = z.object({
  network_id: z.number().min(1, "Le réseau social est requis"),
  url: urlSchema.max(500, "Maximum 500 caractères")
});

// Schéma complet de soumission
export const submissionSchema = z.object({
  // Étape 1 : CGU
  termsAccepted: z.boolean().refine(val => val === true, "Vous devez accepter les conditions d'utilisation"),
  ageConfirmed: z.boolean().refine(val => val === true, "Vous devez confirmer avoir 18 ans ou plus"),
  
  // Étape 2 : Métadonnées vidéo
  english_title: z.string().min(1, "Requis").max(255, "Maximum 255 caractères"),
  original_title: z.string().max(255, "Maximum 255 caractères").optional().or(z.literal('')),
  language: z.string().min(1, "Requis"),
  english_synopsis: z.string().min(1, "Requis").max(300, "Maximum 300 caractères"),
  original_synopsis: z.string().max(300, "Maximum 300 caractères").optional().or(z.literal('')),
  classification: z.enum(['Full AI', 'Semi-AI'], { 
    errorMap: () => ({ message: "Requis" }) 
  }),
  tech_stack: z.string().min(1, "Requis").max(500, "Maximum 500 caractères"),
  creative_method: z.string().min(1, "Requis").max(500, "Maximum 500 caractères"),
  
  // Étape 3 : Fichiers (validation basique - la validation détaillée reste dans validation.js)
  video: z.any().refine(val => val !== null && val !== undefined, "Requis"),
  cover: z.any().refine(val => val !== null && val !== undefined, "Requis"),
  subtitles: z.any().optional().nullable(),
  gallery: z.array(z.any()).max(3, "Maximum 3 images").optional(),
  
  // Étape 4 : Infos créateur
  creator_firstname: nameSchema,
  creator_lastname: nameSchema,
  creator_email: emailSchema,
  creator_phone: optionalPhoneSchema,
  creator_mobile: phoneSchema,
  creator_gender: z.string().min(1, "Requis"),
  creator_country: z.string().min(1, "Requis"),
  creator_address: z.string().min(1, "Requis"),
  referral_source: z.enum([
    'Friend',
    'Social Media',
    'Advertisement',
    'Newsletter',
    'Recommendation',
    'Event',
    'Other'
  ], { 
    errorMap: () => ({ message: "Requis" }) 
  }),
  
  // Contributeurs et liens sociaux
  collaborators: z.array(collaboratorSchema).optional(),
  socials: z.array(socialSchema).optional()
});

// Schémas par étape pour validation progressive
export const step1Schema = submissionSchema.pick({
  termsAccepted: true,
  ageConfirmed: true
});

export const step2Schema = submissionSchema.pick({
  english_title: true,
  original_title: true,
  language: true,
  english_synopsis: true,
  original_synopsis: true,
  classification: true,
  tech_stack: true,
  creative_method: true
});

export const step3Schema = submissionSchema.pick({
  video: true,
  cover: true,
  subtitles: true,
  gallery: true
});

export const step4Schema = submissionSchema.pick({
  creator_firstname: true,
  creator_lastname: true,
  creator_email: true,
  creator_phone: true,
  creator_mobile: true,
  creator_gender: true,
  creator_country: true,
  creator_address: true,
  referral_source: true,
  collaborators: true,
  socials: true
});

export const formatZodErrors = (zodError) => {
  const errors = {};
  
  // Vérification défensive : s'assurer que zodError et zodError.errors existent
  if (!zodError || !zodError.errors || !Array.isArray(zodError.errors)) {
    console.error('Format d\'erreur Zod invalide:', zodError);
    return errors;
  }
  
  zodError.errors.forEach(err => {
    // Gérer les paths imbriqués (ex: collaborators.0.firstname -> collaborator_0_firstname)
    const path = err.path.join('_');
    errors[path] = err.message;
  });
  return errors;
};

// Exporter les schémas individuels pour réutilisation
export { collaboratorSchema, socialSchema, nameSchema, emailSchema, urlSchema };

export default submissionSchema;
