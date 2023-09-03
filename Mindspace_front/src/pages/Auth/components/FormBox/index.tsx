import { FormBoxProps } from '@/utils/types';
import styles from './FormBox.module.scss';

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
