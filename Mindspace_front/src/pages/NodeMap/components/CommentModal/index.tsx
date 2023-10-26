import React, { useState } from 'react';
import styles from './CommentModal.module.scss';
import CommentIcon from '@/assets/icons/Comment.svg';
import SendCommentIcon from '@/assets/icons/SendComment.svg';
import { CommentModalProps } from '@/utils/types';

const CommentModal = ({
  isOpen,
  initialValue,
}: CommentModalProps) => {
  const [editing, setEditing] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [showReplies, setShowReplies] = useState<{ [key: number]: boolean }>({});
  const [editingReply, setEditingReply] = useState<number | null>(null);
  const [editedReplyContent, setEditedReplyContent] = useState<string>('');
  const [showReplyComment, setShowReplyComment] = useState<{ [key: number]: boolean }>({});
  const handleReplyEditClick = (id: number, content: string) => {
    setEditingReply(id);
    setEditedReplyContent(content);
  };

  const handleReplyContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedReplyContent(e.target.value);
  };

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

  const handleEditClick = (id: number, content: string) => {
    setEditing(id);
    setEditedContent(content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedContent(e.target.value);
  };

  const totalComments = initialValue.reduce((acc, comment) => {
    const replyCount = comment.replies ? comment.replies.length : 0;
    return acc + 1 + replyCount;
  }, 0);

  return (
        <div className={isOpen ? styles.comment : styles.hiddencomment}>
            <div className={styles.comment__header}>
                <div className={styles.comment__header__icon}>
                    <img src={CommentIcon} alt="Comment Icon"/>
                </div>
                <span className={styles.comment__header__text}>
                    댓글 {totalComments}
                </span>
            </div>
            <div className={styles.comment__input}>
                <input type="text" placeholder="Enter your comment"/>
                <div className={styles.comment__input__icon}>
                    <button>
                        <img src={SendCommentIcon} alt="Comment Icon"/>
                    </button>
                </div>
            </div>
            {initialValue.map(comment => (
                <div key={comment.id} className={styles.comment__content}>
                    <div className={styles.comment__content__header}>
                        <div className={styles.comment__content__nickname}>
                          <span className={styles.comment__content__nickname__text}>
                            {comment.nickname}
                          </span>
                        </div>
                        <div className={styles.comment__content__header__action}>
                            <button
                                className={styles.comment__content__header__action__replies}
                                onClick={() => toggleReplies(comment.id)}
                            >
                                {showReplies[comment.id] ? '닫기' : '답글'}
                            </button>
                            {comment.editable && (
                                <>
                                    <button
                                        className={styles.comment__content__header__action__edit}
                                        onClick={() => handleEditClick(comment.id, comment.content)}
                                    >
                                        수정
                                    </button>
                                    <button className={styles.comment__content__header__action__remove}>
                                        삭제
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className={styles.comment__content__box}>
                        {editing === comment.id ? (
                            <input
                                type="text"
                                value={editedContent}
                                onChange={handleContentChange}
                            />
                        ) : (
                            <span className={styles.comment__content__box__text}>
                                {comment.content}
                            </span>
                        )}
                    </div>
                    <div className={styles.comment__content__time}>
                        <span className={styles.comment__content__time__text}>
                          {comment.date}
                        </span>
                    </div>
                    {showReplies[comment.id] && (
                        <div className={styles.reply}>
                            {comment.replies && comment.replies.map(reply => (
                                <div key={reply.id} className={styles.reply__content}>
                                    <div className={styles.reply__content__header}>
                                        <div className={styles.reply__content__header__nickname}>
                                                <span className={styles.reply__content__nickname__text}>
                                                    {reply.nickname}
                                                </span>
                                        </div>
                                        <div className={styles.reply__content__header__action}>
                                            {reply.editable && (
                                                <>
                                                    <button
                                                        className={styles.reply__content__header__action__edit}
                                                        onClick={() => handleReplyEditClick(reply.id, reply.content)}
                                                    >
                                                        수정
                                                    </button>
                                                    <button className={styles.reply__content__header__action__remove}>
                                                        삭제
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.reply__content__box}>
                                        {editingReply === reply.id ? (
                                            <input
                                                type="text"
                                                value={editedReplyContent}
                                                onChange={handleReplyContentChange}
                                            />
                                        ) : (
                                            <span className={styles.reply__content__box__text}>
                                                    {reply.content}
                                                </span>
                                        )}
                                    </div>
                                    <div className={styles.reply__content__time}>
                                            <span className={styles.reply__content__time__text}>
                                                {reply.date}
                                            </span>
                                    </div>
                                </div>
                            ))}

                            <div className={styles.reply__input__button}>
                                <button onClick={() => toggleCommentInput(comment.id)}>댓글 달기</button>
                            </div>
                            {showReplyComment[comment.id] && (
                                <div className={styles.reply__input}>
                                    <input type="text" placeholder="Enter your comment"/>
                                    <div className={styles.reply__input__icon}>
                                        <button>
                                            <img src={SendCommentIcon} alt="Comment Icon"/>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
  );
};

export default CommentModal;