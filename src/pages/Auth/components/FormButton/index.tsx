import { FormBoxProps } from 'utils/types';
import styles from './FormButton.module.scss';
import { Link } from 'react-router-dom';

function FormButton({ text, url }: FormBoxProps) {
  return (
    <Link className={styles.button_wapper} to={url}>
      <button className={styles.button}>{text}</button>
    </Link>
  );
}

export default FormButton;
