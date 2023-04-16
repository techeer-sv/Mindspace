import PostTable from '../PostTable';
import Modal from 'react-modal';
import styles from '../Modal/Modal.module.scss';
import { ListModalProps } from 'utils/types';

function ListModal({ listModalOpen, onListRequestClose }: ListModalProps) {
  return (
    <Modal
      isOpen={listModalOpen}
      onRequestClose={onListRequestClose}
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
          width: '50rem',
          height: '38rem',
        },
      }}
    >
      <button className={styles.header__button} onClick={onListRequestClose}>
        <span className={styles.header__span}>x</span>
      </button>
      <PostTable />
    </Modal>
  );
}

export default ListModal;
