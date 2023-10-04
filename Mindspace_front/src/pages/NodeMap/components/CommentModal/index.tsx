import React from 'react';
import styles from './CommentModal.module.scss';
import CommentIcon from '@/assets/icons/Comment.svg';
import SendCommentIcon from '@/assets/icons/SendComment.svg';
import { CommentModalProps } from '@/utils/types';

const CommentModal = ({
  isOpen,
  initialValue,
}: CommentModalProps) => {
  return (
        <div className={isOpen ? styles.comment : styles.hiddencomment}>
            <div className={styles.comment__header}>
                <div className={styles.comment__header__icon}>
                    <img src={CommentIcon} alt="Comment Icon" />
                </div>
                <span className={styles.comment__header__text}>댓글 {initialValue.length}</span>
            </div>
            <div className={styles.comment__input}>
                <input type="text" placeholder="Enter your comment" />
                <div className={styles.comment__input__icon}>
                    <button>
                        <img src={SendCommentIcon} alt="Comment Icon" />
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
                            <button className={styles.comment__content__header__action__edit}>
                                수정
                            </button>
                            <button className={styles.comment__content__header__action__remove}>
                                삭제
                            </button>
                        </div>
                    </div>
                    <div className={styles.comment__content__box}>
                        <span className={styles.comment__content__box__text}>
                            {comment.content}
                        </span>
                    </div>
                    <div className={styles.comment__content__time}>
                        <span className={styles.comment__content__time__text}>
                            {comment.date}
                        </span>
                    </div>
                </div>
            ))}
        </div>
  );
};

export default CommentModal;
