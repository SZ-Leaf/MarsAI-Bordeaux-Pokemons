import CGUForm from '../components/features/submission/forms/CGUForm/CGUForm';
import SubmissionForm from '../components/features/submission/forms/SubmissionForm/SubmissionForm';
import FileUploadStep from '../components/features/submission/steps/FileUploadStep/FileUploadStep';
import CreatorStep from '../components/features/submission/steps/CreatorStep/CreatorStep';

export const submissionSteps = [
  {
    number: 1,
    title: 'Conditions',
    component: CGUForm
  },
  {
    number: 2,
    title: 'Informations vidéo',
    component: SubmissionForm
  },
  {
    number: 3,
    title: 'Uploads',
    component: FileUploadStep
  },
  {
    number: 4,
    title: 'Réalisateur et Contributeurs',
    component: CreatorStep
  }
];

export const totalSteps = submissionSteps.length;
