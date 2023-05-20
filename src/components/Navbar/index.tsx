import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MindSpaceText from 'images/MindSpaceText.png';
import styles from './Navbar.module.scss';

import { useRecoilState } from 'recoil';
import { isLoggedInAtom } from 'recoil/state/authAtom';
import {
  useUserNicknameQuery,
  useClearUserNicknameCache,
} from 'hooks/queries/user';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = useRecoilState(isLoggedInAtom);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const { data: userNickname } = useUserNicknameQuery(isLoggedIn);

  const logout = () => {
    setLoggedIn(false);
    alert('로그아웃 되었습니다');
    navigate('/');
    localStorage.clear();
  };

  useEffect(() => {
    const handleResize = () => {
      setIsNavExpanded(false);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useClearUserNicknameCache(isLoggedIn);

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.navbar__title}>
        <img src={MindSpaceText} alt="logo" />
      </Link>
      <button
        className={styles.navbar__hamburger}
        onClick={() => {
          setIsNavExpanded(!isNavExpanded);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="yellow"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
      <div
        className={
          isNavExpanded
            ? `${styles.navbar__menu} ${styles['navbar__menu--expanded']}`
            : styles.navbar__menu
        }
      >
        <ul>
          {isLoggedIn ? (
            <>
              <li
                className={
                  isNavExpanded
                    ? `${styles['navbar__menu--expanded__text']}`
                    : styles.navbar__menu__text
                }
              >
                <span>{userNickname}</span>
              </li>
              <li>
                <span
                  onClick={() => {
                    logout();
                  }}
                >
                  logout
                </span>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/signin">SignIn</Link>
              </li>
              <li>
                <Link to="/signup">SignUp</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
