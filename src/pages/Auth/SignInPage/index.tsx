import styles from './../Auth.module.scss';
import FormBox from '../components/FormBox';
import FormButton from '../components/FormButton';
import Navbar from 'components/Navbar';

function SignInPage() {
  return (
    <>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.content__signin__box}>
          <span className={styles.content__title}>SIGN IN</span>
          <FormBox placeholder="Email" />
          <FormBox placeholder="Password" />
          <div className={styles.button_wapper}>
            <FormButton url="/" text="SIGN IN" />
            <FormButton url="/signup" text="SIGN UP" />
          </div>
        </div>
      </div>
    </>
  );
}
export default SignInPage;
