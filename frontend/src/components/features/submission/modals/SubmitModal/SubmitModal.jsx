import { Modal } from '../../../../ui';
import Submit from '../../components/Submit/Submit';

const SubmitModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Soumission de film"
      size="xl"
      closeOnOverlayClick={false}
    >
      <Submit inModal={true} />
    </Modal>
  );
};

export default SubmitModal;
