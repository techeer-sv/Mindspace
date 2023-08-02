/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Editor, Viewer } from '@toast-ui/react-editor';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import styles from './WriteModal.module.scss';
import { WriteModalProps } from '@/utils/types';
import ResizableModal from '@/components/ResizebleModal';
import { nodeAtom } from '@/recoil/state/nodeAtom';
import { useRecoilValue } from 'recoil';
import {
  useUserPostGetQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from '@/hooks/queries/board';

const WriteModal = ({
  isOpen,
  onRequestClose,
  updateNodeInfo,
}: WriteModalProps) => {
  const nodeInfo = useRecoilValue(nodeAtom);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isWritten, setIsWritten] = useState(nodeInfo.isWritten);
  const [initTitle, setInitTitle] = useState(title);
  const [initEditedContent, setInitEditedContent] = useState(content);
  const [isEditing, setIsEditing] = useState(true);
  const [dataIsLoading, setDataIsLoading] = useState(true);
  const [boardId, setBoardId] = useState(0);
  const editorRef = React.useRef(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const initialize = () => {
    setTitle('');
    setContent('');
    setIsEditing(true);
  };

  const handleEditorChange = () => {
    setContent(editorRef.current.getInstance().getMarkdown());
  };

  const [createPostErrorMessage, setCreatePostErrorMessage] =
    useState<string>('');

  const { mutate: createPostMutation } = useCreatePostMutation(() => {
    setDataIsLoading(false);
    setIsEditing(false);
    setIsWritten(true);
    updateNodeInfo(nodeInfo?.id, true);
  }, setCreatePostErrorMessage);

  const handleFirstWrite = () => {
    createPostMutation({
      id: nodeInfo.id as number,
      title: title,
      content: content,
    });
  };

  const { mutate: updatePostMutation } = useUpdatePostMutation(() => {
    setInitTitle(title);
    setInitEditedContent(content);
    setIsEditing(false);
  });

  const handleSubmit = () => {
    updatePostMutation({
      id: nodeInfo.id as number,
      title: title,
      content: content,
    });
  };

  const [deletePostErrorMessage, setDeletePostErrorMessage] =
    useState<string>('');

  const { mutate: deletePostMutation } = useDeletePostMutation(() => {
    updateNodeInfo(nodeInfo?.id, false);
    setIsWritten(false);
    onRequestClose();
  }, setDeletePostErrorMessage);

  const handleDelete = () => {
    deletePostMutation({
      id: nodeInfo.id as number,
    });
  };

  useEffect(() => {
    if (createPostErrorMessage) {
      alert(createPostErrorMessage);
      setCreatePostErrorMessage('');
    }
    if (deletePostErrorMessage) {
      alert(deletePostErrorMessage);
      setDeletePostErrorMessage('');
    }
  }, [createPostErrorMessage, deletePostErrorMessage]);

  const handleCancel = () => {
    setIsEditing(false);
    setContent(initEditedContent);
    setTitle(initTitle);
  };

  const { data: postData, isLoading } = useUserPostGetQuery(
    nodeInfo.id as number,
    isOpen,
    nodeInfo?.isWritten,
  );

  useEffect(() => {
    setIsEditing(false);
    setIsWritten(nodeInfo.isWritten);

    if (isOpen && nodeInfo?.isWritten) {
      if (isLoading) {
        alert('로딩중입니다. 잠시만 기다려주세요.');
      } else if (postData) {
        const datatimeString = postData.updatedAt;
        const [datePart, timePart] = datatimeString.split('T');
        const timeString = timePart.split('.')[0];
        setTitle(postData.title);
        setContent(postData.content);
        setInitTitle(postData.title);
        setInitEditedContent(postData.content);
        setBoardId(postData.id);
        setDate(datePart);
        setTime(timeString);
      }
    } else {
      initialize();
    }
  }, [boardId, isOpen, nodeInfo, isLoading]);

  return (
    <ResizableModal isOpen={isOpen} onRequestClose={onRequestClose}>
      {isWritten ? (
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
              {!isEditing && (
                <div className={styles.content__dateTime}>
                  <span className={styles.content__date}>{date}</span>
                  <span className={styles.content__time}>{time}</span>
                </div>
              )}
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
                  !dataIsLoading && (
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
