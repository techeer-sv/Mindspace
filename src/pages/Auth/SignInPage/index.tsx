import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormBox from '../components/FormBox';
import FormButton from '../components/FormButton';
import Navbar from '@/components/Navbar';
import { getAccessToken } from '@/api/Auth';
import styles from './../Auth.module.scss';

import { useSetRecoilState } from 'recoil';
import { isLoggedInAtom } from '@/recoil/state/authAtom';

import { useMutation } from 'react-query';

function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const setLoggedIn = useSetRecoilState(isLoggedInAtom);

  const loginMutation = useMutation(getAccessToken, {
    onSuccess: (accessToken) => {
      localStorage.setItem('accessToken', accessToken);
      setLoggedIn(true);
      navigate('/');
    },
    onError: (error: Error) => {
      setErrorMessage('에러가 발생하였습니다 (임시문구)');
    },
  });

  const checkIsValid = () => {
    if (email === '') {
      setErrorMessage('이메일을 입력해 주세요');
      return false;
    }

    if (password === '') {
      setErrorMessage('비밀번호를 입력해 주세요');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const submitForm = () => {
    if (checkIsValid()) {
      loginMutation.mutate({ email, password });
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.content__signin__box}>
          <span className={styles.content__title}>SIGN IN</span>
          <FormBox
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="text"
            placeholder="Email"
          />
          <FormBox
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            placeholder="Password"
          />
          <div className={styles.error}>{errorMessage}</div>
          <div className={styles.button_wapper}>
            <FormButton clickAction={submitForm} text="SIGN IN" />
            <FormButton
              clickAction={() => navigate('/signup')}
              text="SIGN UP"
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default SignInPage;
