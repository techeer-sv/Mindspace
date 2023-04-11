import React, { useState } from 'react';
import { Editor, Viewer } from '@toast-ui/react-editor';
import Modal from 'react-modal';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import styles from './WriteModal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onRequestClose: any;
}

const WriteModal = ({ isOpen, onRequestClose }: ModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [isEditing, setIsEditting] = useState(true);
  const editorRef = React.useRef<any>(null);

  const handleEditorChange = () => {
    setContent(editorRef.current.getInstance().getMarkdown());
  };

  const handleSubmit = () => {
    setIsEditting(false);
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
          <button
            className={styles.header__button}
            onClick={() => setIsEditting(true)}
          >
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
            disabled={!isEditing}
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
            {isEditing ? (
              <Editor
                initialValue={content}
                onChange={handleEditorChange}
                previewStyle="tab"
                height="100%"
                initialEditType="markdown"
                usageStatistics={false}
                ref={editorRef}
              />
            ) : (
              <div className={styles.content__viewer}>
                <Viewer initialValue={content} usageStatistics={false} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WriteModal;
