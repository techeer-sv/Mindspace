import styles from './MainPage.module.scss';
import MindSpaceText from '@/images/MindSpaceText.png';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isLoggedInAtom } from '@/recoil/state/authAtom';

function MainPage() {
  const navigate = useNavigate();
  const isLoggedIn = useRecoilValue(isLoggedInAtom);

  const handleMove = () => {
    if (isLoggedIn) {
      navigate('/map');
    } else {
      navigate('/signin');
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.content__subtitle}>
        <span>Mind Maps for Developers</span>
      </div>
      <div className={styles.content__title}>
        <img src={MindSpaceText} />
      </div>

      <button onClick={handleMove} className={styles.content__button}>
        EXPLORE
      </button>
    </div>
  );
}

export default MainPage;
