import { useState, useEffect } from 'react';
import PostTable from '../PostTable';
import styles from './ListModal.module.scss';
import { ListModalProps } from '@/utils/types';
import { Viewer } from '@toast-ui/react-editor';
import ResizableModal from '@/components/ResizebleModal';
import { usePostGetQuery } from '@/hooks/queries/board';

function ListModal({ listModalOpen, onListRequestClose }: ListModalProps) {
  const [isSelectedTable, setIsSelectedTable] = useState(null);

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [dataIsLoading, setDataIsLoading] = useState(false);

  const { data: postData, isLoading } = usePostGetQuery(isSelectedTable);

  useEffect(() => {
    if (postData) {
      if (isLoading) {
        alert('로딩중입니다. 잠시만 기다려주세요.');
      } else {
        const datatimeString = postData.updatedAt;
        const [datePart, timePart] = datatimeString.split('T');
        const timeString = timePart.split('.')[0];
        setContent(postData.content);
        setName(postData.userNickname);
        setTitle(postData.title);

        setDate(datePart);
        setTime(timeString);
        setDataIsLoading(true);
      }
    }
  }, [isSelectedTable, postData, isLoading]);

  const handleSelecteBoard = (id: number) => {
    setIsSelectedTable(id);
  };

  return (
    <ResizableModal isOpen={listModalOpen} onRequestClose={onListRequestClose}>
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
        dataIsLoading && (
          <>
            <button
              className={styles.header__button}
              onClick={() => {
                setDataIsLoading(false);
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
                      {title}
                    </span>
                    <div
                      className={
                        styles.post__content__wrapper__header__text__nickname
                      }
                    >
                      <span>{name}</span>
                    </div>
                  </div>
                  <div className={styles.post__content__wrapper__dateTime}>
                    <span
                      className={styles.post__content__wrapper__dateTime__date}
                    >
                      {date}
                    </span>
                    <span>{time}</span>
                  </div>
                </div>
                <div className={styles.post__viewer}>
                  <Viewer initialValue={content} usageStatistics={false} />
                </div>
              </div>
            </div>
          </>
        )
      )}
    </ResizableModal>
  );
}

export default ListModal;
