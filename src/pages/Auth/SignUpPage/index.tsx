import styles from './../Auth.module.scss';
import FormBox from '../components/FormBox';
import FormButton from '../components/FormButton';
import Navbar from 'components/Navbar';
import { useState } from 'react';

function SignUpPage() {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  return (
    <>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.content__signup__box}>
          <span className={styles.content__title}>Create Account</span>
          <FormBox type="text" placeholder="Email" />
          <FormBox type="text" placeholder="Nickname" />
          <FormBox
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
          />
          <FormBox
            type="password"
            value={passwordConfirm}
            onChange={(e) => {
              setPasswordConfirm(e.target.value);
            }}
            placeholder="Password Check"
          />
          <div className={styles.confirm}>
            {password !== passwordConfirm && (
              <div>비밀번호가 일치하지 않습니다!</div>
            )}
            {password === passwordConfirm && <div>비밀번호 일치</div>}
          </div>
          <div className={styles.button_wapper}>
            <FormButton url="/signin" text="SIGN UP" />
          </div>
        </div>
      </div>
    </>
  );
}
export default SignUpPage;
