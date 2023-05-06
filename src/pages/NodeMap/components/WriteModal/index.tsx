import React, { useEffect, useState } from 'react';
import { Editor, Viewer } from '@toast-ui/react-editor';
import Modal from 'react-modal';
import { createPost, getPost, updatePost, deletePost } from 'api/Post';
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
  const [isLoading, setIsLoading] = useState(true);
  const editorRef = React.useRef(null);

  const [modalWidth, setModalWidth] = useState(800);
  const [modalHeight, setModalHeight] = useState(600);
  const [isResizing, setIsResizing] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: any) => {
    setIsResizing(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      if (isResizing) {
        setModalWidth((prevWidth) => prevWidth + (e.clientX - mousePosition.x));
        setModalHeight(
          (prevHeight) => prevHeight + (e.clientY - mousePosition.y),
        );
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, mousePosition]);

  const initialize = () => {
    setTitle('');
    setContent('');
    setIsEditing(true);
  };

  const handleEditorChange = () => {
    setContent(editorRef.current.getInstance().getMarkdown());
  };

  const handleFirstWrite = async () => {
    await createPost(nodeInfo.id as number, title, content);
    setIsEditing(false);
    setIsActive(true);
    updateNodeInfo(nodeInfo?.id, true);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    await updatePost(nodeInfo.id as number, title, content);
    setInitTitle(title);
    setInitEditedContent(content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deletePost(nodeInfo.id as number);
    updateNodeInfo(nodeInfo?.id, false);
    setIsActive(false);
    onRequestClose();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setContent(initEditedContent);
    setTitle(initTitle);
  };

  useEffect(() => {
    setIsLoading(true);
    setIsActive(nodeInfo.isActive);

    if (isOpen && nodeInfo?.isActive) {
      const fetchData = async () => {
        const data = await getPost(nodeInfo.id as number);

        setTitle(data.title);
        setContent(data.content);
        setInitTitle(data.title);
        setInitEditedContent(data.content);

        setIsLoading(false);
      };

      fetchData();
      setIsEditing(false);
    } else {
      initialize();
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
          width: `${modalWidth}px`,
          height: `${modalHeight}px`,
          padding: '1rem', // 패딩 추가
        },
      }}
    >
      <div style={{ position: 'relative', height: '100%' }}>
        {/* 기존 모달 내용 */}

        {isActive ? (
          <>
            <div className={styles.header}>
              <button
                className={styles.header__button}
                onClick={onRequestClose}
              >
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
                      수정
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
                    !isLoading && (
                      <div className={styles.content__viewer}>
                        <Viewer
                          initialValue={content}
                          usageStatistics={false}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.header}>
              <button
                className={styles.header__button}
                onClick={onRequestClose}
              >
                <span className={styles.header__span}>x</span>
              </button>
              <div className={styles.header__left}>
                <button
                  className={styles.header__button}
                  onClick={handleFirstWrite}
                >
                  작성
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
                </div>
              </div>
            </div>
          </>
        )}

        <div className={styles.resizer} onMouseDown={handleMouseDown}></div>
      </div>
    </Modal>
  );
};

export default WriteModal;
