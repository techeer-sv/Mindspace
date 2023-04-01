import styles from './MainPage.module.scss';
import MindSpaceText from 'images/MindSpaceText.png';
import { Link } from 'react-router-dom';

function MainPage() {
  return (
    <div className={styles.content}>
      <div className={styles.content__subtitle}>
        <span>Mind Maps for Developers</span>
      </div>
      <div className={styles.content__title}>
        <img src={MindSpaceText} />
      </div>
      <Link to="/map">
        <button className={styles.content__button}>EXPLORE</button>
      </Link>
    </div>
  );
}

export default MainPage;
