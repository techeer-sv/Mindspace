import {useState, useEffect, useRef} from "react";
import BoardTable from "../BoardTable";
import styles from "./ListModal.module.scss";
import {ListModalProps} from "@/constants/types";
import {Viewer} from "@toast-ui/react-editor";
import CustomModal from "@/components/CustomModal";
import {useBoardGetQuery, useUserBoardGetQuery} from "@/api/hooks/queries/board";

import {formatDateTime, DateTimeFormat} from "@/utils/dateTime";
import CommentModal from "../CommentModal";
import {useBoardCommentGetQuery} from "@/api/hooks/queries/comment";

function ListModal({listModalOpen, onListRequestClose}: ListModalProps) {
    const [isSelectedTable, setIsSelectedTable] = useState<number>();
    const viewerRef = useRef<Viewer>(null);
    const {data: boardData, isLoading} = useBoardGetQuery(isSelectedTable);
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    // const commentData = [
    //   {
    //     id: 1,
    //     nickname: '작성자1',
    //     content: '댓글 내용1',
    //     date: '5분전',
    //     editable: true,
    //     replies: [
    //       {
    //         id: 3,
    //         nickname: '작성자3',
    //         content: '대댓글 내용1',
    //         date: '15분전',
    //         editable: false,
    //       },
    //       {
    //         id: 4,
    //         nickname: '작성자4',
    //         content: '대댓글 내용1',
    //         date: '15분전',
    //         editable: true,
    //       },
    //     ],
    //   },
    //   {
    //     id: 2,
    //     nickname: '작성자2',
    //     content: '댓글 내용2',
    //     date: '10분전',
    //     editable: false,
    //     replies: [],
    //   },
    // ];

    const toggleCommentModal = () => {
        setCommentModalOpen((prev) => !prev);
    };

    const handleSelectBoard = (id: number) => {
        setIsSelectedTable(id);
        setCommentModalOpen(false);
    };

    useEffect(() => {
        if (viewerRef.current) {
            viewerRef.current.getInstance().setMarkdown(boardData?.content);
        }
    }, [boardData?.content]);

    const {
        data: commentData,
    } = useBoardCommentGetQuery(
        isSelectedTable
    );

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
                    <BoardTable onClickedId={handleSelectBoard}/>
                </>
            ) : (
                !isLoading && (
                    <>
                        <div className={styles.header}>
                            <button
                                className={styles.header__button}
                                onClick={() => {
                                    setIsSelectedTable(undefined);
                                }}
                            >
                                <span className={styles.post__button}>Back</span>
                            </button>
                            <button
                                className={styles.header__button}
                                onClick={toggleCommentModal}
                            >
              <span className={styles.post__button}>
                {commentModalOpen ? '닫기' : '댓글'}
              </span>
                            </button>
                        </div>
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
                        {boardData?.title}
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
                                            </div>
                                            <span
                                                className={
                                                    styles.post__wrapper__content__wrapper__info__name
                                                }
                                            >
                        {boardData.userNickname}
                      </span>
                                            <span
                                                className={
                                                    styles.post__wrapper__content__wrapper__info__date
                                                }
                                            >
                        {formatDateTime(
                            boardData.updatedAt,
                            DateTimeFormat.Date,
                        )}
                      </span>
                                        </div>
                                    </div>
                                    <div className={styles.post__wrapper__viewer}>
                                        <Viewer
                                            ref={viewerRef}
                                            initialValue={boardData?.content}
                                            usageStatistics={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <CommentModal
                                isOpen={commentModalOpen}
                                initialValue={commentData}
                            />
                        </div>
                    </>
                )
            )}
        </CustomModal>
    );
}

export default ListModal;
