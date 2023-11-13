import {CommentViewProps} from "@/constants/types";
import styles from "./Comment.module.scss";
import React, {useState} from "react";
import Button from "app/components/Button";
import CommentInput from "@/map/components/CommentModal/components/CommentInput";
import {useDeleteCommentMutation} from "@/api/hooks/queries/comment";

const CommentView = ({
                         comment,
                         showRepliesButton,
                         showReplies,
                         toggleReplies,
                         boardId,
                         onDeleteSuccess,
                     }: CommentViewProps) => {
    const [editing, setEditing] = useState<number | null>(null);

    const handleEditSuccess = (updatedContent: string) => {
        comment.content = updatedContent;
        setEditing(null);
    };

    const toggleEdit = (id: number) => {
        if (editing === id) {
            setEditing(null); // 이미 편집 중인 경우 편집 모드 종료
        } else {
            setEditing(id); // 편집 모드 활성화
        }
    };

    const successAction = () => {
        alert("댓글이 성공적으로 삭제되었습니다.");
        onDeleteSuccess(comment.id);
    };

    const errorAction = (message: string) => {
        alert("댓글 삭제에 실패했습니다. 오류: " + message);
    };

    const {mutate: deleteCommentMutation} = useDeleteCommentMutation(
        successAction,
        errorAction
    );

    const handleSubmit = (id: number, isReply?: boolean) => {
        deleteCommentMutation(id, {
            onSuccess: () => {
                if (isReply) {
                    onDeleteSuccess(id); // 대댓글 삭제 성공 시 호출
                }
            }
        });
    }

    return (
        <div key={comment.id} className={styles.content}>
            <div className={styles.content__header}>
                <div className={styles.content__nickname}>
                      <span className={styles.content__nickname__text}>
                        {comment.userNickname}
                      </span>
                </div>
                <div className={styles.content__header__action}>
                    {
                        showRepliesButton && (
                            <Button
                                text={showReplies ? '닫기' : '답글'}
                                onClick={() => toggleReplies(comment.id)}
                            />
                        )
                    }
                    {comment.editable && (
                        <>
                            <Button
                                text={editing === comment.id ? "닫기" : "수정"}
                                onClick={() => toggleEdit(comment.id)}
                            />
                            <Button
                                text={"삭제"}
                                onClick={() => handleSubmit(comment.id)}
                            />
                        </>
                    )}
                </div>
            </div>
            <div className={styles.content__box}>
                {editing === comment.id ? (
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
                    <span className={styles.content__box__text}>
                        {comment.content}
                    </span>
                )}
            </div>
            <div className={styles.content__time}>
                <span className={styles.content__time__text}>
                  {comment.updatedAt}
                </span>
            </div>
        </div>
    )
}

export default CommentView;