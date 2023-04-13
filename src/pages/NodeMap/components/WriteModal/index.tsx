import React, { useEffect, useState } from 'react';
import { Editor, Viewer } from '@toast-ui/react-editor';
import Modal from 'react-modal';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import styles from './WriteModal.module.scss';
import { WriteModalProps } from 'utils/types';

const WriteModal = ({
  isOpen,
  onRequestClose,
  nodeInfo,
  updateNodeInfo,
}: WriteModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isActive, setIsActive] = useState(nodeInfo.isActive);
  const [initTitle, setInitTitle] = useState(title);
  const [initEditedContent, setInitEditedContent] = useState(content);

  const [isEditing, setIsEditing] = useState(true);
  const editorRef = React.useRef(null);

  const handleEditorChange = () => {
    setContent(editorRef.current.getInstance().getMarkdown());
  };

  const handleFirstWrite = () => {
    console.log('first');
    // 처음 글쓰기 api 요청
    setIsEditing(false);
    setIsActive(true);
    updateNodeInfo(nodeInfo?.id, true);

    console.log('제목: ', title);
    console.log('내용: ', content);
  };

  const handleSubmit = () => {
    // 글수정 api요청
    console.log('제목: ', title);
    console.log('내용: ', content);

    setInitTitle(title);
    setInitEditedContent(content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    // 글 삭제 api요청
    console.log('삭제');
    updateNodeInfo(nodeInfo?.id, false);
    setIsActive(false);

    // + isActive 요소 false처리
    onRequestClose();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setContent(initEditedContent);
    setTitle(initTitle);
  };

  useEffect(() => {
    setIsActive(nodeInfo.isActive);

    if (nodeInfo?.isActive) {
      // 특정 id에 대한 api호출

      setTitle('Vite란 무엇인가?');
      setContent('Vite란 ~~~');

      setInitTitle('Vite란 무엇인가?');
      setInitEditedContent('Vite란 ~~~');

      setIsEditing(false);
    } else {
      console.log('??');
      setTitle('');
      setContent('');
      setIsEditing(true);
    }
  }, [isOpen, nodeInfo]);

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
      {isActive ? (
        <>
          <div className={styles.header}>
            <button className={styles.header__button} onClick={onRequestClose}>
              <span className={styles.header__span}>x</span>
            </button>
            <div className={styles.header__left}>
              {isEditing ? (
                <>
                  <button
                    className={styles.header__button}
                    onClick={handleCancel}
                  >
                    취소
                  </button>
                  <button
                    className={styles.header__button}
                    onClick={handleSubmit}
                  >
                    완료
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={styles.header__button}
                    onClick={handleDelete}
                  >
                    삭제
                  </button>
                  <button
                    className={styles.header__button}
                    onClick={() => setIsEditing(true)}
                  >
                    글 수정
                  </button>
                </>
              )}
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.content__title}>
              <input
                disabled={!isEditing}
                type="text"
                placeholder={`[${nodeInfo?.name}] 제목을 입력해주세요`}
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
        </>
      ) : (
        <>
          <div className={styles.header}>
            <button className={styles.header__button} onClick={onRequestClose}>
              <span className={styles.header__span}>x</span>
            </button>
            <div className={styles.header__left}>
              <button
                className={styles.header__button}
                onClick={handleFirstWrite}
              >
                글 작성
              </button>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.content__title}>
              <input
                disabled={!isEditing}
                type="text"
                placeholder={`[${nodeInfo?.name}] 제목을 입력해주세요`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className={styles.content__editor}>
              <div
                className={`${styles.content__editor} ${styles.editor__content}`}
              >
                <Editor
                  initialValue={content}
                  onChange={handleEditorChange}
                  previewStyle="tab"
                  height="100%"
                  initialEditType="markdown"
                  usageStatistics={false}
                  ref={editorRef}
                />
                )
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default WriteModal;
