import { CommentButtonProps } from "@/constants/types";
import styles from "./CommentButton.module.scss"
const CommentButton = ({
                           text,
                           onClick
                       }: CommentButtonProps) => {
    return (
        <button onClick={onClick} className={styles.button}>
            {text}
        </button>
    );
};

export default CommentButton;