import styles from "./FormButton.module.scss";

interface FormButtonProps {
  clickAction?: () => void;
  text?: string;
}

function FormButton({ text, clickAction }: FormButtonProps) {
  return (
    <div className={styles.button_wapper}>
      <button onClick={clickAction} className={styles.button}>
        {text}
      </button>
    </div>
  );
}

export default FormButton;
