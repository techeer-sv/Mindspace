import { CommentInputProps } from "@/constants/types";
import React, { useState } from "react";
import {
  useCreateCommentMutation,
  useUpdateCommentMutation,
} from "@/api/hooks/queries/comment";
import styles from "@/map/components/CommentModal/components/CommentInput/CommentInput.module.scss";

const CommentInput = ({
  boardId,
  commentId,
  isEditing,
  initialComment,
  onEditSuccess,
}: CommentInputProps) => {
  const [editedComment, setEditedComment] = useState<string>(
    initialComment || "",
  );
  const successCreateAction = () => {
    alert("댓글이 성공적으로 추가되었습니다.");
    setEditedComment("");
  };

  const errorCreateAction = (message: string) => {
    alert("댓글 추가에 실패했습니다. 오류: " + message);
  };

  const successUpdateAction = () => {
    alert("댓글이 성공적으로 수정되었습니다.");
    if (onEditSuccess) {
      onEditSuccess(editedComment);
    }
  };

  const errorUpdateAction = (message: string) => {
    alert("댓글 수정에 실패했습니다. 오류: " + message);
  };

  const { mutate: updateCommentMutation } = useUpdateCommentMutation(
    successUpdateAction,
    errorUpdateAction,
  );

  const { mutate: createCommentMutation } = useCreateCommentMutation(
    successCreateAction,
    errorCreateAction,
  );

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  // 대댓글
  const createReplyComment = (
    boardId: number,
    commentId: number,
    content: string,
  ) => {
    createCommentMutation({
      boardId: boardId,
      commentId: commentId,
      content: content,
    });
  };

  // 댓글
  const createNewComment = (boardId: number, content: string) => {
    createCommentMutation({
      boardId: boardId,
      content: content,
    });
  };

  const handleSubmit = () => {
    if (!editedComment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }
    if (isEditing) {
      updateCommentMutation({
        commentId: commentId,
        content: editedComment,
        boardId: boardId,
      });
      return;
    }
    if (!commentId) {
      createNewComment(boardId, editedComment);
      return;
    }
    createReplyComment(boardId, commentId, editedComment);
  };

  return (
    <div className={styles.input}>
      <input
        type="text"
        placeholder="Enter your comment"
        value={editedComment}
        onChange={(e) => {
          setEditedComment(e.target.value);
        }}
        onKeyPress={handleKeyPress}
      />
      <div className={styles.input__icon}>
        <button onClick={handleSubmit}>
          <img src={"/icons/SendComment.svg"} alt="Comment Icon" />
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
