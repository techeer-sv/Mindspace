import styles from './../Auth.module.scss';
import logo from 'images/logo.svg';
import FormBox from '../components/FormBox';
import FormButton from '../components/FormButton';

function SignUpPage() {
  return (
    <>
      <img className={styles.header} src={logo} />
      <div className={styles.content}>
        <div className={styles.content__signup__box}>
          <span className={styles.content__title}>Create Account</span>
          <FormBox placeholder="Email" />
          <FormBox placeholder="Nickname" />
          <FormBox placeholder="Password" />
          <FormBox placeholder="Password Check" />
          <div className={styles.button_wapper}>
            <FormButton url="/signin" text="SIGN UP" />
          </div>
        </div>
      </div>
    </>
  );
}
export default SignUpPage;
