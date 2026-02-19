import { Modal } from '../../../../ui';
import FormFieldModal from '../SocialModal/FormFieldModal';
import ModalActions from '../SocialModal/ModalActions';
import { useModalForm } from '../../../../../hooks/useModalForm.js';
import { collaboratorSchema } from '../../../../../schemas/submissionSchema.js';
import { genderOptions } from '../../../../../constants/formOptions.js';

const CollaboratorModal = ({ isOpen, onClose, collaborator, collaboratorIndex, onSave, errors }) => {
  const defaultValues = {
    firstname: '',
    lastname: '',
    email: '',
    gender: '',
    role: ''
  };

  const { formData, errors: localErrors, handleChange, handleSubmit } = useModalForm(
    collaborator,
    defaultValues,
    collaboratorSchema,
    onSave,
    isOpen,
    collaboratorIndex
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={collaboratorIndex !== null ? 'Modifier le contributeur' : 'Ajouter un contributeur'}
      size="lg"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormFieldModal
            label="Prénom"
            name="firstname"
            value={formData.firstname}
            onChange={(value) => handleChange('firstname', value)}
            error={localErrors.firstname}
            externalError={errors?.[`collaborators_${collaboratorIndex}_firstname`]}
            required
          />

          <FormFieldModal
            label="Nom"
            name="lastname"
            value={formData.lastname}
            onChange={(value) => handleChange('lastname', value)}
            error={localErrors.lastname}
            externalError={errors?.[`collaborators_${collaboratorIndex}_lastname`]}
            required
          />

          <FormFieldModal
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(value) => handleChange('email', value)}
            error={localErrors.email}
            externalError={errors?.[`collaborators_${collaboratorIndex}_email`]}
            required
          />

          <FormFieldModal
            label="Genre"
            name="gender"
            type="select"
            value={formData.gender}
            onChange={(value) => handleChange('gender', value)}
            error={localErrors.gender}
            externalError={errors?.[`collaborators_${collaboratorIndex}_gender`]}
            required
            options={genderOptions}
          />

          <div className="md:col-span-2">
            <FormFieldModal
              label="Rôle"
              name="role"
              type="textarea"
              value={formData.role}
              onChange={(value) => handleChange('role', value)}
              error={localErrors.role}
              externalError={errors?.[`collaborators_${collaboratorIndex}_role`]}
              required
              rows={2}
              maxLength={500}
              placeholder="Rôle dans la production (ex: Director, Producer, Editor)"
              showCharCount
            />
          </div>
        </div>

        <ModalActions
          onCancel={onClose}
          onConfirm={() => handleSubmit(onClose)}
          confirmText={collaboratorIndex !== null ? 'Modifier' : 'Ajouter'}
        />
      </div>
    </Modal>
  );
};

export default CollaboratorModal;
