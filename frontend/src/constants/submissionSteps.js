import CGUForm from '../components/forms/CGUForm.jsx';
import SubmissionForm from '../components/forms/SubmissionForm.jsx';
import FileUploadStep from '../components/submission/steps/FileUploadStep.jsx';
import CreatorStep from '../components/submission/steps/CreatorStep.jsx';

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
