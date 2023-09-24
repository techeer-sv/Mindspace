import { useState, useEffect, useRef } from 'react';
import PostTable from '../PostTable';
import styles from './ListModal.module.scss';
import { ListModalProps } from '@/utils/types';
import { Viewer } from '@toast-ui/react-editor';
import CustomModal from '@/components/CustomModal';
import { usePostGetQuery } from '@/hooks/queries/board';

import { formatDateTime, DateTimeFormat } from '@/utils/dateTime';
import CommentIcon from '../../../../asset/icon/Comment.svg';
import SendCommentIcon from '../../../../asset/icon/SendComment.svg';

function ListModal({ listModalOpen, onListRequestClose }: ListModalProps) {
  const [isSelectedTable, setIsSelectedTable] = useState(null);
  const viewerRef = useRef(null);
  const { data: postData, isLoading } = usePostGetQuery(isSelectedTable);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const toggleCommentModal = () => {
    setCommentModalOpen(prev => !prev);
  };

  const handleSelecteBoard = (id: number) => {
    setIsSelectedTable(id);
  };

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.getInstance().setMarkdown(postData?.content);
    }
  }, [postData?.content]);

  return (
    <CustomModal
      isOpen={listModalOpen}
      onRequestClose={onListRequestClose}
      resizable
      style={{
        padding: '1rem',
      }}
    >
      {!isSelectedTable ? (
        <>
          <button
            className={styles.header__button}
            onClick={onListRequestClose}
          >
            <span className={styles.header__span}>x</span>
          </button>
          <PostTable onClickedId={handleSelecteBoard} />
        </>
      ) : (
        !isLoading && (
          <>
            <button
              className={styles.header__button}
              onClick={() => {
                setIsSelectedTable(null);
              }}
            >
              <span className={styles.post__button}>Back</span>
            </button>
            <div className={styles.post__wrapper}>
            <div className={styles.post__wrapper__content}>
              <div className={styles.post__wrapper__content__wrapper}>
                <div className={styles.post__wrapper__content__wrapper__header}>
                  <div className={styles.post__wrapper__content__wrapper__header__text}>
                    <span
                      className={
                        styles.post__wrapper__content__wrapper__header__text__title
                      }
                    >
                      {postData?.title}
                    </span>
                  </div>
                  <div className={styles.post__wrapper__content__wrapper__info}>
                      <div className={styles.post__wrapper__content__wrapper__info__box}>
                        <button onClick={toggleCommentModal} className={styles.post__wrapper__content__wrapper__info__box__button}>댓글</button>
                      </div>
                    <span className={styles.post__wrapper__content__wrapper__info__name}>
                      {postData.userNickname}
                    </span>
                    <span className={styles.post__wrapper__content__wrapper__info__date}>
                      {formatDateTime(postData.updatedAt, DateTimeFormat.Date)}
                    </span>
                  </div>

                </div>
                <div className={styles.post__wrapper__viewer}>
                  <Viewer
                    ref={viewerRef}
                    initialValue={postData?.content}
                    usageStatistics={false}
                  />
                </div>
              </div>
            </div>
              <div className={commentModalOpen ? styles.post__wrapper__comment : styles.post__wrapper__hiddencomment}>
                <div className={styles.post__wrapper__comment__header}>
                    <div className={styles.post__wrapper__comment__header__icon}>
                      <img src={CommentIcon} alt="Comment Icon" />
                    </div>
                    <span className={styles.post__wrapper__comment__header__text}>댓글 3</span>
                </div>
                <div className={styles.post__wrapper__comment__input}>
                  <input type="text" placeholder="Enter your comment" />
                    <div className={styles.post__wrapper__comment__input__icon}>
                      <button>
                        <img src={SendCommentIcon} alt="Comment Icon" />
                      </button>
                    </div>
                </div>
                <div className={styles.post__wrapper__comment__content}>
                  <div className={styles.post__wrapper__comment__content__nickname}>
                    <span className={styles.post__wrapper__comment__content__nickname__text}>
                      바라밥밥
                    </span>
                  </div>
                  <div className={styles.post__wrapper__comment__content__box}>
                    <span className={styles.post__wrapper__comment__content__box__text}>
                      잘 쓰셨네요.
                    </span>
                  </div>
                  <div className={styles.post__wrapper__comment__content__time}>
                    <span className={styles.post__wrapper__comment__content__time__text}>
                      5분전
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      )}
    </CustomModal>
  );
}

export default ListModal;
