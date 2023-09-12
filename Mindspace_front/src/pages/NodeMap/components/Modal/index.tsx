import { useState } from 'react';
import styles from './Modal.module.scss';
import Modal from 'react-modal';
import WriteModal from '@/pages/NodeMap/components/WriteModal';
import { ModalProps } from '@/utils/types';
import ListModal from '../ListModal';
import { useRecoilValue } from 'recoil';
import { nodeAtom } from '@/recoil/state/nodeAtom';

function NodeModal({ isOpen, onRequestClose, updateNodeInfo }: ModalProps) {
  const [writeModalIsOpen, setWriteModalIsOpen] = useState(false);

  const openWriteModal = () => {
    setWriteModalIsOpen(true);
    onRequestClose();
  };

  const [listModalIsOpen, setListModalIsOpen] = useState(false);
  const handleClickLIst = () => {
    setListModalIsOpen(true);
    onRequestClose();
  };

  const selectedNodeInfo = useRecoilValue(nodeAtom);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={{
          overlay: {
            backgroundColor: 'rgba(166, 166, 200, 0.17)',
          },
          content: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '1rem',
            border: '1px solid white',
            width: '50%',
            maxWidth: '40rem',
            height: '20rem',
          },
        }}
      >
        <button className={styles.header__button} onClick={onRequestClose}>
          <span className={styles.header__span}>x</span>
        </button>
        <div className={styles.content}>
          <span className={styles.content__title}>{selectedNodeInfo.name}</span>
          <div>
            <button onClick={openWriteModal} className={styles.content__button}>
              {selectedNodeInfo.isWritten ? '조회' : '작성'}
            </button>
            <button
              onClick={handleClickLIst}
              className={styles.content__button}
            >
              목록 조회
            </button>
          </div>
        </div>
      </Modal>
      <WriteModal
        isOpen={writeModalIsOpen}
        updateNodeInfo={updateNodeInfo}
        onRequestClose={() => setWriteModalIsOpen(false)}
      />
      {/* 글 목록 리스트 모달 */}
      <ListModal
        listModalOpen={listModalIsOpen}
        onListRequestClose={() => setListModalIsOpen(false)}
      />
    </>
  );
}

export default NodeModal;
