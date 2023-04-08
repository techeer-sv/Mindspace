import styles from './Modal.module.scss';
import Modal from 'react-modal';
import { ModalProps } from 'utils/types';

function NodeModal({
  isOpen,
  onRequestClose,
  onClick,
  nodeName,
  buttonName1,
  buttonName2,
}: ModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(166, 166, 200, 0.2)',
        },
        content: {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(166, 166, 200, 0.6)',
          borderRadius: '1rem',
          border: 'none',
          width: '28rem',
          height: '15rem',
        },
      }}
    >
      <button className={styles.header__button} onClick={onClick}>
        <span className={styles.header__span}>x</span>
      </button>
      <div className={styles.content}>
        <span className={styles.content__title}>{nodeName}</span>
        <div>
          <button className={styles.content__button}>{buttonName1}</button>
          <button className={styles.content__button}>{buttonName2}</button>
        </div>
      </div>
    </Modal>
  );
}

export default NodeModal;
