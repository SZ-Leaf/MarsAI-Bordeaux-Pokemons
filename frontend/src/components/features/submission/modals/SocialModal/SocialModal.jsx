import { Modal } from '../../../../ui';
import FormFieldModal from './FormFieldModal';
import ModalActions from './ModalActions';
import { useModalForm } from '../../../../../hooks/useModalForm.js';
import { socialSchema } from '../../../../../schemas/submissionSchema.js';
import { socialNetworks } from '../../../../../constants/formOptions.js';

const SocialModal = ({ isOpen, onClose, social, socialIndex, onSave, errors }) => {
  const defaultValues = {
    network_id: '',
    url: ''
  };

  const { formData, errors: localErrors, handleChange, handleSubmit } = useModalForm(
    social,
    defaultValues,
    socialSchema,
    onSave,
    isOpen,
    socialIndex
  );

  const handleNetworkChange = (value) => {
    handleChange('network_id', value === '' ? '' : parseInt(value));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={socialIndex !== null ? 'Modifier le lien réseau social' : 'Ajouter un lien réseau social'}
      size="lg"
    >
      <div className="space-y-4">
        <FormFieldModal
          label="Réseau social"
          name="network_id"
          type="select"
          value={formData.network_id || ''}
          onChange={handleNetworkChange}
          error={localErrors.network_id}
          externalError={errors?.[`socials_${socialIndex}_network_id`]}
          required
          options={[
            { value: '', label: 'Sélectionner un réseau' },
            ...socialNetworks.map(network => ({
              value: network.id,
              label: network.label
            }))
          ]}
        />

        <FormFieldModal
          label="URL"
          name="url"
          type="url"
          value={formData.url}
          onChange={(value) => handleChange('url', value)}
          error={localErrors.url}
          externalError={errors?.[`socials_${socialIndex}_url`]}
          required
          placeholder="https://exemple.com"
          helpText={!localErrors.url && formData.url ? "L'URL doit commencer par https://" : ''}
        />

        <ModalActions
          onCancel={onClose}
          onConfirm={() => handleSubmit(onClose)}
          confirmText={socialIndex !== null ? 'Modifier' : 'Ajouter'}
        />
      </div>
    </Modal>
  );
};

export default SocialModal;
