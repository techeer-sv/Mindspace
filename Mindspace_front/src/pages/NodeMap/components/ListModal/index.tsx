import { useState, useEffect, useRef } from 'react';
import PostTable from '../PostTable';
import styles from './ListModal.module.scss';
import { ListModalProps } from '@/utils/types';
import { Viewer } from '@toast-ui/react-editor';
import CustomModal from '@/components/CustomModal';
import { usePostGetQuery } from '@/hooks/queries/board';

import { formatDateTime, DateTimeFormat } from '@/utils/dateTime';

function ListModal({ listModalOpen, onListRequestClose }: ListModalProps) {
  const [isSelectedTable, setIsSelectedTable] = useState(null);
  const viewerRef = useRef(null);
  const { data: postData, isLoading } = usePostGetQuery(isSelectedTable);

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
          <PostTable OnClickedId={handleSelecteBoard} />
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
            <div className={styles.post__content}>
              <div className={styles.post__content__wrapper}>
                <div className={styles.post__content__wrapper__header}>
                  <div className={styles.post__content__wrapper__header__text}>
                    <span
                      className={
                        styles.post__content__wrapper__header__text__title
                      }
                    >
                      {postData?.title}
                    </span>
                  </div>
                  <div className={styles.post__content__wrapper__info}>
                    <span className={styles.post__content__wrapper__info__name}>
                      {postData.userNickname}
                    </span>
                    <span className={styles.post__content__wrapper__info__date}>
                      {formatDateTime(postData.updatedAt, DateTimeFormat.Date)}
                    </span>
                  </div>
                </div>
                <div className={styles.post__viewer}>
                  <Viewer
                    ref={viewerRef}
                    initialValue={postData?.content}
                    usageStatistics={false}
                  />
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
