import styles from './MainPage.module.scss';
import MindSpaceText from 'images/MindSpaceText.png';

function MainPage() {
  return (
    <div className={styles.content}>
      <div className={styles.content__subtitle}>
        <span>Mind Maps for Developers</span>
      </div>
      <div className={styles.content__title}>
        <img src={MindSpaceText} />
      </div>
      <button className={styles.content__button_wrapper}>EXPLORE</button>
    </div>
  );
}

export default MainPage;
