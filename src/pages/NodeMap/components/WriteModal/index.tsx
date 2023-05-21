import React, { useEffect, useState } from 'react';
import { Editor, Viewer } from '@toast-ui/react-editor';
import { createPost, getPost, updatePost, deletePost } from '@/api/Post';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import styles from './WriteModal.module.scss';
import { WriteModalProps } from '@/utils/types';
import ResizableModal from '@/components/ResizebleModal';
import { nodeAtom } from '@/recoil/state/nodeAtom';
import { useRecoilValue } from 'recoil';

const WriteModal = ({
  isOpen,
  onRequestClose,
  updateNodeInfo,
}: WriteModalProps) => {
  const nodeInfo = useRecoilValue(nodeAtom);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isActive, setIsActive] = useState(nodeInfo.isActive);
  const [initTitle, setInitTitle] = useState(title);
  const [initEditedContent, setInitEditedContent] = useState(content);
  const [isEditing, setIsEditing] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [boardId, setBoardId] = useState(0);
  const editorRef = React.useRef(null);

  const initialize = () => {
    setTitle('');
    setContent('');
    setIsEditing(true);
  };

  const handleEditorChange = () => {
    setContent(editorRef.current.getInstance().getMarkdown());
  };

  const handleFirstWrite = async () => {
    try {
      await createPost(nodeInfo.id as number, title, content);
    } catch (error) {
      console.log(error);
    }
    setIsEditing(false);
    setIsActive(true);
    updateNodeInfo(nodeInfo?.id, true);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    try {
      await updatePost(boardId, title, content);
    } catch (error) {
      console.log(error);
    }
    setInitTitle(title);
    setInitEditedContent(content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await deletePost(boardId);
    } catch (error) {
      console.log(error);
    }
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
        try {
          const data = await getPost(boardId);
          setTitle(data.title);
          setContent(data.content);
          setInitTitle(data.title);
          setInitEditedContent(data.content);
          setBoardId(data.id);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
      setIsEditing(false);
    } else {
      initialize();
    }
  }, [boardId, isOpen, nodeInfo]);

  return (
    <ResizableModal isOpen={isOpen} onRequestClose={onRequestClose}>
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
                      <Viewer initialValue={content} usageStatistics={false} />
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
            <button className={styles.header__button} onClick={onRequestClose}>
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
    </ResizableModal>
  );
};

export default WriteModal;
