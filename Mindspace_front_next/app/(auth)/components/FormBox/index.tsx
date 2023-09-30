import styles from "./FormBox.module.scss";

interface FormBoxProps {
  type?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  url?: string;
  text?: string;
}

function FormBox({ placeholder, type, value, onChange }: FormBoxProps) {
  return (
    <input
      type={type}
      value={value}
      className={styles.form_box}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
}

export default FormBox;
