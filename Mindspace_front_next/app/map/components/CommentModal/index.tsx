import React, {useState} from "react";
import styles from "./CommentModal.module.scss";
import {CommentModalProps} from "@/constants/types";
import CommentView from "@/map/components/CommentModal/components/Comment";
import CommentInput from "@/map/components/CommentModal/components/CommentInput";

const CommentModal = ({
                          isOpen,
                          initialValue,
                          boardId,
                      }: CommentModalProps) => {
    const [showReplies, setShowReplies] = useState<{ [key: number]: boolean }>({});
    const [showReplyComment, setShowReplyComment] = useState<{ [key: number]: boolean }>({});
    const toggleReplies = (commentId: number) => {
        setShowReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const toggleCommentInput = (commentId: number) => {
        setShowReplyComment(prev => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const totalComments = initialValue?.data?.reduce((acc, comment) => {
        const replyCount = comment.replies ? comment.replies.length : 0;
        return acc + 1 + replyCount;
    }, 0);


    return (
        <div className={isOpen ? styles.comment : styles.hiddencomment}>
            <div className={styles.comment__header}>
                <div className={styles.comment__header__icon}>
                    <img src={"/icons/Comment.svg"} alt="Comment Icon"/>
                </div>
                <span className={styles.comment__header__text}>
                    댓글 {totalComments}
                </span>
            </div>
            <CommentInput
                boardId={boardId}
                isEditing={false}
             />
            {initialValue?.data?.map(comment => (
                <React.Fragment key={comment.id}>
                    <CommentView
                        comment={comment}
                        showRepliesButton={true}
                        showReplies={showReplies[comment.id]}
                        toggleReplies={toggleReplies}
                        boardId={boardId}
                    />
                    {showReplies[comment.id] && (
                        <div className={styles.reply}>
                            {comment.replies && comment.replies.map(reply => (
                                <CommentView
                                    comment={reply}
                                    showRepliesButton={false}
                                    showReplies={showReplies[comment.id]}
                                    toggleReplies={toggleReplies}
                                    boardId={boardId}
                                />
                            ))}

                            <div className={styles.reply__input__button}>
                                <button onClick={() => toggleCommentInput(comment.id)}>댓글 달기</button>
                            </div>

                            {showReplyComment[comment.id] && (
                                <CommentInput
                                    boardId={boardId}
                                    commentId={comment.id}
                                    isEditing={false}
                                />
                            )}
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default CommentModal;