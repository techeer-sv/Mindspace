// WriteEditor/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import styles from '../../WriteModal.module.scss';
import { useRecoilValue } from 'recoil';
import {
  useUpdatePostMutation,
  useCreatePostMutation,
} from '@/hooks/queries/board';
import { nodeAtom } from '@/recoil/state/nodeAtom';
import { ViewEditProps } from '@/utils/types';

const WriteEditor = ({
  nodeData,
  onEditToggle,
  onClose,
  updateNodeInfo,
}: ViewEditProps) => {
  const editorRef = useRef(null);
  const nodeInfo = useRecoilValue(nodeAtom);

  const [edtedTitle, setEditedTitle] = useState(nodeData?.title);
  const [editedContent, setEditedContent] = useState(nodeData?.content);

  const handleEditorChange = () => {
    setEditedContent(editorRef.current.getInstance().getMarkdown());
  };

  const { mutate: updatePostMutation } = useUpdatePostMutation(() => {
    onEditToggle();
  });
  const [createPostErrorMessage, setCreatePostErrorMessage] =
    useState<string>('');

  const { mutate: createPostMutation } = useCreatePostMutation(() => {
    updateNodeInfo(nodeInfo?.id, true);
    onEditToggle();
  }, setCreatePostErrorMessage);

  const handleSubmit = () => {
    if (nodeInfo.isWritten) {
      updatePostMutation({
        id: nodeInfo.id as number,
        title: edtedTitle,
        content: editedContent,
      });
      updateNodeInfo(nodeInfo?.id, true);
    } else {
      createPostMutation({
        id: nodeInfo.id as number,
        title: edtedTitle,
        content: editedContent,
      });
      onEditToggle();
    }
  };

  return (
    <>
      <div className={styles.header}>
        <button className={styles.header__button} onClick={onClose}>
          <span className={styles.header__span}>x</span>
        </button>
        <div className={styles.header__left}>
          {nodeInfo.isWritten ? (
            <>
              <button className={styles.header__button} onClick={onEditToggle}>
                취소
              </button>
              <button className={styles.header__button} onClick={handleSubmit}>
                완료
              </button>
            </>
          ) : (
            <>
              <button className={styles.header__button} onClick={handleSubmit}>
                작성
              </button>
            </>
          )}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.content__title}>
          <input
            type="text"
            placeholder={`[${nodeInfo?.name}] 제목을 입력해주세요`}
            value={edtedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
        </div>
        <div className={styles.content__editor}>
          <div
            className={`${styles.content__editor} ${styles.editor__content}`}
          >
            <Editor
              ref={editorRef}
              initialValue={nodeData?.content}
              onChange={handleEditorChange}
              previewStyle="tab"
              height="100%"
              initialEditType="markdown"
              usageStatistics={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WriteEditor;
