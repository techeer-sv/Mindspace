import styles from './../Auth.module.scss';
import FormBox from '../components/FormBox';
import FormButton from '../components/FormButton';
import Navbar from 'components/Navbar';

function SignUpPage() {
  return (
    <>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.content__signup__box}>
          <span className={styles.content__title}>Create Account</span>
          <FormBox type="text" placeholder="Email" />
          <FormBox type="text" placeholder="Nickname" />
          <FormBox type="password" placeholder="Password" />
          <FormBox type="password" placeholder="Password Check" />
          <div className={styles.button_wapper}>
            <FormButton url="/signin" text="SIGN UP" />
          </div>
        </div>
      </div>
    </>
  );
}
export default SignUpPage;
