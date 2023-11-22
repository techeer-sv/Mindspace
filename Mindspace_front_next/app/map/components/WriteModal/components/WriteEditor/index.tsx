"use client";
import React, { useState, useEffect, useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import styles from "../../WriteModal.module.scss";
import { useRecoilValue } from "recoil";
import {
  useUpdateBoardMutation,
  useCreateBoardMutation,
  useUploadImageMutation,
} from "@/api/hooks/queries/board";
import { nodeAtom } from "@/recoil/state/nodeAtom";
import { WriteEditorProps } from "@/constants/types";

const WriteEditor = ({
  nodeData,
  onEditToggle,
  onClose,
  updateNodeInfo,
}: WriteEditorProps) => {
  const editorRef = useRef<Editor>(null);
  const nodeInfo = useRecoilValue(nodeAtom);

  const [editedTitle, setEditedTitle] = useState(nodeData?.title);
  const [editedContent, setEditedContent] = useState(nodeData?.content);

  const handleEditorChange = () => {
    setEditedContent(editorRef?.current?.getInstance().getMarkdown());
  };

  const { mutate: updateBoardMutation } = useUpdateBoardMutation(() => {
    onEditToggle();
  });
  const [createBoardErrorMessage, setCreateBoardErrorMessage] =
    useState<string>("");

  const { mutate: createBoardMutation } = useCreateBoardMutation(() => {
    updateNodeInfo(nodeInfo?.id, true);
    onEditToggle();
  }, setCreateBoardErrorMessage);

  const handleSubmit = () => {
    if (nodeInfo.isWritten) {
      updateBoardMutation({
        id: nodeInfo.id as number,
        title: editedTitle ?? "",
        content: editedContent ?? "",
      });
      updateNodeInfo(nodeInfo?.id, true);
    } else {
      createBoardMutation({
        id: nodeInfo.id as number,
        title: editedTitle ?? "",
        content: editedContent ?? "",
      });
      onEditToggle();
    }
  };

  useEffect(() => {
    if (createBoardErrorMessage) {
      alert(createBoardErrorMessage);
      setCreateBoardErrorMessage("");
    }
  }, [createBoardErrorMessage]);

  const updateEditorContent = (newContent: string) => {
    const currentContent = editorRef?.current?.getInstance().getMarkdown();

    editorRef?.current
      ?.getInstance()
      .setMarkdown(`${currentContent}\n${newContent}`);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer.files);
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        await new Promise<void>((resolve, reject) => {
          uploadImageMutation(file, {
            onSuccess: (data) => {
              const markdownImageLink = `![${file.name}](${data.imageUrl})`;
              updateEditorContent(markdownImageLink);
              resolve();
            },
            onError: (error) => {
              console.log(error);
              updateEditorContent("이미지 업로드에 실패했습니다.");
              reject();
            },
          });
        });
      }
    }
  };

  const {
    mutate: uploadImageMutation,
    isLoading: isImageUploading,
    isError: isImageUploadError,
  } = useUploadImageMutation();

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
            placeholder={`[${nodeInfo?.name}] 제목을 입력해 주세요`}
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
        </div>
        <div className={styles.content__editor}>
          <div
            className={`${styles.content__editor} ${styles.editor__content}`}
            onDropCapture={handleDrop}
          >
            <Editor
              ref={editorRef}
              initialValue={nodeData?.content ?? " "}
              placeholder="내용을 입력해 주세요"
              onChange={handleEditorChange}
              previewStyle="tab"
              height="100%"
              initialEditType="markdown"
              usageStatistics={false}
            />
          </div>
        </div>

        <div className={styles.content__editor__message}>
          {isImageUploading && (
            <span className={styles.content__editor__message__loading}>
              이미지 업로드 중...
            </span>
          )}
          {isImageUploadError && (
            <span className={styles.content__editor__message__error}>
              이미지 업로드에 실패하였습니다.
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default WriteEditor;
