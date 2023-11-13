import {CommentInputProps} from "@/constants/types";
import React, {useState} from "react";
import {useCreateCommentMutation} from "@/api/hooks/queries/comment";
import styles from "@/map/components/CommentModal/CommentModal.module.scss";

const CommentInput = ({
                          boardId,
                          commentId,
                      }: CommentInputProps) => {
    const [editedComment, setEditedComment] = useState<string>("");
    const successAction = () => {
        alert("댓글이 성공적으로 추가되었습니다.");
        setEditedComment("");
    };

    const errorAction = (message: string) => {
        alert("댓글 추가에 실패했습니다. 오류: " + message);
    };

    const {mutate: createCommentMutation} = useCreateCommentMutation(
        successAction,
        errorAction
    );

    const handleSubmit = () => {
        if (!editedComment.trim()) {
            alert("댓글을 입력해주세요.");
            return;
        } else if (!commentId) {
            createCommentMutation({
                boardId: boardId,
                content: editedComment,
            })
        } else {
            createCommentMutation({
                boardId: boardId,
                commentId: commentId,
                content: editedComment,
            })
        }
    };

    return (
        <div className={styles.comment__input}>
            <input type="text" placeholder="Enter your comment" onChange={(e) => {
                setEditedComment(e.target.value);
            }}/>
            <div className={styles.comment__input__icon}>
                <button onClick={handleSubmit}>
                    <img src={"/icons/SendComment.svg"} alt="Comment Icon"/>
                </button>
            </div>
        </div>
    )
}

export default CommentInput;