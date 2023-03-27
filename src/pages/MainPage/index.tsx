import styles from './MainPage.module.scss';
import MindSpaceText from 'images/MindSpaceText.png';

function MainPage() {
  return (
    <div className={styles.header}>
      <p className={styles.subtitle}>Mind Maps for Developers</p>
      <img className={styles.title} src={MindSpaceText} />
      <button className={styles.btn}>EXPLORE</button>
    </div>
  );
}

export default MainPage;
