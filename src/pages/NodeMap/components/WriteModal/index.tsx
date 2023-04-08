import React, { useState } from 'react';
import { Editor } from '@toast-ui/react-editor';
import Modal from 'react-modal';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import styles from './WriteModal.module.scss';

// modal
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
          height: '35rem',
        },
      }}
    >
      <button className={styles.header__button} onClick={onRequestClose}>
        <span className={styles.header__span}>x</span>
      </button>
      <div className={styles.content}>
        <div className={styles.content__title}>
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.content__editor}>
          <Editor
            onChange={handleEditorChange}
            previewStyle="vertical"
            height="300px"
            initialEditType="wysiwyg"
            ref={editorRef}
          />
        </div>
        <div className={styles.content__preview}>
          <h3>미리보기</h3>
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
      </div>
    </Modal>
  );
};

export default WriteModal;
