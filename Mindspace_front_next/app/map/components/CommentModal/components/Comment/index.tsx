import {CommentViewProps} from "@/constants/types";
import styles from "./Comment.module.scss";
import React, {useState} from "react";
import Button from "app/components/Button";

const CommentView = ({
                         comment,
                         showRepliesButton,
                         showReplies,
                         toggleReplies
                     }: CommentViewProps) => {
    const [editing, setEditing] = useState<number | null>(null);
    const [editedContent, setEditedContent] = useState<string>('');

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
                    <input
                        type="text"
                        value={editedContent}
                        onChange={handleContentChange}
                    />
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