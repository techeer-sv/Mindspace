import { CommentButtonProps } from "@/constants/types";
import styles from "./Button.module.scss"
const Button = ({
                           text,
                           onClick
                       }: CommentButtonProps) => {
    return (
        <button onClick={onClick} className={styles.button}>
            {text}
        </button>
    );
};

export default Button;