import { useState, useEffect } from 'react';
import PostTable from '../PostTable';
import styles from './ListModal.module.scss';
import { ListModalProps } from '@/utils/types';
import { getPostData } from '@/api/Post';
import { Viewer } from '@toast-ui/react-editor';
import ResizableModal from '@/components/ResizebleModal';

function ListModal({ listModalOpen, onListRequestClose }: ListModalProps) {
  const [isSelectedTable, setIsSelectedTable] = useState(null);

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPostData(isSelectedTable);
        if (res) {
          const datatimeString = res.updatedAt;
          const [datePart, timePart] = datatimeString.split('T');
          const timeString = timePart.split('.')[0];
          setContent(res.content);
          setName(res.userNickname);
          setTitle(res.title);
          console.log(res.content);

          setDate(datePart);
          setTime(timeString);
          setIsLoading(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [isSelectedTable]);

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
        isLoading && (
          <>
            <button
              className={styles.header__button}
              onClick={() => {
                setIsLoading(false);
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
                  {isLoading && (
                    <Viewer initialValue={content} usageStatistics={false} />
                  )}
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
