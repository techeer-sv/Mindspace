import { useState } from 'react';
import styles from './Modal.module.scss';
import Modal from 'react-modal';
import { Node } from 'utils/types';
import WriteModal from 'pages/NodeMap/components/WriteModal';
import {} from 'utils/types';
import PostTable from '../PostTable';
import ListModal from '../ListModal';

// modal
export interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  nodeName: string;
  selectedNodeInfo: Node;
  updateNodeInfo: (id: number | string, isActive: boolean) => void;
  clickListModal: () => void;
  listModalOpen: boolean;
  onListRequestClose: () => void;
}

function NodeModal({
  isOpen,
  onRequestClose,
  nodeName,
  selectedNodeInfo,
  updateNodeInfo,
  clickListModal,
  listModalOpen,
  onListRequestClose,
}: ModalProps) {
  const [writeModalIsOpen, setWriteModalIsOpen] = useState(false);

  const openWriteModal = () => {
    setWriteModalIsOpen(true);
    onRequestClose();
  };

  return (
    <>
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
        <button className={styles.header__button} onClick={onRequestClose}>
          <span className={styles.header__span}>x</span>
        </button>
        <div className={styles.content}>
          <span className={styles.content__title}>{nodeName}</span>
          <div>
            <button onClick={openWriteModal} className={styles.content__button}>
              작성
            </button>
            <button onClick={clickListModal} className={styles.content__button}>
              조회
            </button>
          </div>
        </div>
      </Modal>
      <WriteModal
        nodeInfo={selectedNodeInfo}
        isOpen={writeModalIsOpen}
        updateNodeInfo={updateNodeInfo}
        onRequestClose={() => setWriteModalIsOpen(false)}
      />
      {/* 글 목록 리스트 모달 */}
      <ListModal
        listModalOpen={listModalOpen}
        onListRequestClose={onListRequestClose}
      />
    </>
  );
}

export default NodeModal;
