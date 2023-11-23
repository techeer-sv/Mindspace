import { CommentViewProps } from "@/constants/types";
import styles from "./CommentView.module.scss";
import React, { useState } from "react";
import Button from "app/components/Button";
import CommentInput from "@/map/components/CommentModal/components/CommentInput";
import { useDeleteCommentMutation } from "@/api/hooks/queries/comment";
import { prefixes } from "next/dist/build/output/log";

const CommentView = ({
  comment,
  showRepliesButton,
  showReplies,
  toggleReplies,
  boardId,
}: CommentViewProps) => {
  const [editing, setEditing] = useState<boolean>(false);

  const handleEditSuccess = () => {
    setEditing(false);
  };

  const toggleEdit = () => {
    setEditing((prev) => !prev);
  };

  const successAction = () => {
    alert("댓글이 성공적으로 삭제되었습니다.");
  };

  const errorAction = (message: string) => {
    alert("댓글 삭제에 실패했습니다. 오류: " + message);
  };

  const { mutate: deleteCommentMutation } = useDeleteCommentMutation(
    boardId,
    successAction,
    errorAction,
  );

  const handleSubmit = (id: number, isReply?: boolean) => {
    deleteCommentMutation(id);
  };

  return (
    <div key={comment.id} className={styles.content}>
      <div className={styles.content__header}>
        <div className={styles.content__nickname}>
          <span className={styles.content__nickname__text}>
            {comment.userNickname}
          </span>
        </div>
        <div className={styles.content__header__action}>
          {showRepliesButton && (
            <Button
              text={showReplies ? "닫기" : "답글"}
              onClick={() => toggleReplies(comment.id)}
            />
          )}
          {comment.editable && (
            <>
              <Button text={editing ? "닫기" : "수정"} onClick={toggleEdit} />
              <Button text={"삭제"} onClick={() => handleSubmit(comment.id)} />
            </>
          )}
        </div>
      </div>
      <div className={styles.content__box}>
        {editing ? (
          <>
            <CommentInput
              boardId={boardId}
              commentId={comment.id}
              isEditing={true}
              initialComment={comment.content}
              onEditSuccess={handleEditSuccess}
            />
          </>
        ) : (
          <span className={styles.content__box__text}>{comment.content}</span>
        )}
      </div>
      <div className={styles.content__time}>
        <span className={styles.content__time__text}>{comment.updatedAt}</span>
      </div>
    </div>
  );
};

export default CommentView;
