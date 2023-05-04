import { FormBoxProps } from 'utils/types';
import styles from './FormBox.module.scss';

function FormBox({ placeholder, type }: FormBoxProps) {
  return (
    <input type={type} className={styles.form_box} placeholder={placeholder} />
  );
}

export default FormBox;
