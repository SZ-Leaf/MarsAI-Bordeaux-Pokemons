import Modal from './Modal.jsx';
import Submit from '../../pages/Submit.jsx';

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
