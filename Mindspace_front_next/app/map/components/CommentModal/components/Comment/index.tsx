import {CommentViewProps} from "@/constants/types";
import styles from "./Comment.module.scss";
import React, {useState} from "react";
import Button from "app/components/Button";
import CommentInput from "@/map/components/CommentModal/components/CommentInput";

const CommentView = ({
                         comment,
                         showRepliesButton,
                         showReplies,
                         toggleReplies,
                         boardId,
                     }: CommentViewProps) => {
    const [editing, setEditing] = useState<number | null>(null);
    const [editedContent, setEditedContent] = useState<string>('');
    const [commentContent, setCommentContent] = useState<string>(comment.content);

    const handleEditSuccess = (updatedContent: string) => {
        comment.content = updatedContent; // 로컬 상태 업데이트
        setEditing(null); // 편집 모드 종료
    };

    const handleEditClick = (id: number, content: string) => {
        setEditing(id);
        setEditedContent(content);
    };
    const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedContent(e.target.value);
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
                                text={"수정"}
                                onClick={() => handleEditClick(comment.id, comment.content)}
                            />
                            <Button
                                text={"삭제"}
                                onClick={() => handleEditClick(comment.id, comment.content)}
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