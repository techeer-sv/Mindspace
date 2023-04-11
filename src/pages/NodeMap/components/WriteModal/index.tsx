import React, { useState } from 'react';
import { Editor } from '@toast-ui/react-editor';
import Modal from 'react-modal';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import styles from './WriteModal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onRequestClose: any;
}

const WriteModal = ({ isOpen, onRequestClose }: ModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const editorRef = React.useRef<any>(null);
  const handleEditorChange = () => {
    setContent(editorRef.current.getInstance().getMarkdown());
  };

  const handleSubmit = () => {
    console.log('제목: ', title);
    console.log('내용: ', content);
  };

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
          width: '80vw',
          height: '80vh',
        },
      }}
    >
      <div className={styles.header}>
        <button className={styles.header__button} onClick={onRequestClose}>
          <span className={styles.header__span}>x</span>
        </button>
        <div className={styles.header__left}>
          <button className={styles.header__button} onClick={handleSubmit}>
            삭제
          </button>
          <button className={styles.header__button} onClick={handleSubmit}>
            글쓰기
          </button>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.content__title}>
          <input
            type="text"
            placeholder="[JPA] 제목을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.content__editor}>
          <div
            className={`${styles.content__editor} ${styles.editor__content}`}
          >
            <Editor
              onChange={handleEditorChange}
              previewStyle="tab"
              height="100%"
              initialEditType="markdown"
              ref={editorRef}
              usageStatistics={false}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WriteModal;
