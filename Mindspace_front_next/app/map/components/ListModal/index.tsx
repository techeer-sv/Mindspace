import { useState, useEffect, useRef } from "react";
import PostTable from "../PostTable";
import styles from "./ListModal.module.scss";
import { ListModalProps } from "@/constants/types";
import { Viewer } from "@toast-ui/react-editor";
import CustomModal from "@/components/CustomModal";
import { usePostGetQuery } from "@/hooks/queries/board";

import { formatDateTime, DateTimeFormat } from "@/utils/dateTime";
// import CommentModal from "@/pages/NodeMap/components/CommentModal";

function ListModal({ listModalOpen, onListRequestClose }: ListModalProps) {
  const [isSelectedTable, setIsSelectedTable] = useState<number>();
  const viewerRef = useRef<Viewer>(null);
  const { data: postData, isLoading } = usePostGetQuery(isSelectedTable);
  // const [commentModalOpen, setCommentModalOpen] = useState(false);
  // const commentData = [
  //   {
  //     id: 1,
  //     nickname: "작성자1",
  //     content: "댓글 내용1",
  //     date: "5분전",
  //   },
  //   {
  //     id: 2,
  //     nickname: "작성자2",
  //     content: "댓글 내용2",
  //     date: "10분전",
  //   },
  // ];
  // const toggleCommentModal = () => {
  //   setCommentModalOpen((prev) => !prev);
  // };

  const handleSelectBoard = (id: number) => {
    setIsSelectedTable(id);
    // setCommentModalOpen(false);
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
        padding: "1rem",
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
          <PostTable onClickedId={handleSelectBoard} />
        </>
      ) : (
        !isLoading && (
          <>
            <button
              className={styles.header__button}
              onClick={() => {
                setIsSelectedTable(undefined);
              }}
            >
              <span className={styles.post__button}>Back</span>
            </button>
            <div className={styles.post__wrapper}>
              <div className={styles.post__wrapper__content}>
                <div className={styles.post__wrapper__content__wrapper}>
                  <div
                    className={styles.post__wrapper__content__wrapper__header}
                  >
                    <div
                      className={
                        styles.post__wrapper__content__wrapper__header__text
                      }
                    >
                      <span
                        className={
                          styles.post__wrapper__content__wrapper__header__text__title
                        }
                      >
                        {postData?.title}
                      </span>
                    </div>
                    <div
                      className={styles.post__wrapper__content__wrapper__info}
                    >
                      <div
                        className={
                          styles.post__wrapper__content__wrapper__info__box
                        }
                      >
                        <button
                          // onClick={toggleCommentModal}
                          className={
                            styles.post__wrapper__content__wrapper__info__box__button
                          }
                        >
                          댓글
                        </button>
                      </div>
                      <span
                        className={
                          styles.post__wrapper__content__wrapper__info__name
                        }
                      >
                        {postData.userNickname}
                      </span>
                      <span
                        className={
                          styles.post__wrapper__content__wrapper__info__date
                        }
                      >
                        {formatDateTime(
                          postData.updatedAt,
                          DateTimeFormat.Date,
                        )}
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
              {/* <CommentModal
                isOpen={commentModalOpen}
                initialValue={commentData}
              /> */}
            </div>
          </>
        )
      )}
    </CustomModal>
  );
}

export default ListModal;
