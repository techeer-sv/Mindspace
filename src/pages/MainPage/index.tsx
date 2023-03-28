import styles from './MainPage.module.scss';
import MindSpaceText from 'images/MindSpaceText.png';

function MainPage() {
  return (
    <div className={styles.header}>
      <div className={styles.subtitle}>
        <span>Mind Maps for Developers</span>
      </div>
      <div className={styles.title}>
        <img src={MindSpaceText} />
      </div>
      <button className={styles.btn}>EXPLORE</button>
    </div>
  );
}

export default MainPage;
