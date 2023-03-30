import { FormBoxProps } from 'utils/types';
import styles from './FormBox.module.scss';

function FormBox({ placeholder }: FormBoxProps) {
  return <input className={styles.form_box} placeholder={placeholder} />;
}

export default FormBox;
