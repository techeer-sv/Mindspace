import styles from './../Auth.module.scss';
import logo from 'images/logo.svg';
import FormBox from '../components/FormBox';
import FormButton from '../components/FormButton';

function LogInPage() {
  return (
    <>
      <img className={styles.header} src={logo} />
      <div className={styles.content}>
        <div className={styles.content__login__box}>
          <span className={styles.content__title}>LOGIN</span>
          <FormBox placeholder="Email" />
          <FormBox placeholder="Password" />
          <div className={styles.button_wapper}>
            <FormButton url="/" text="LOGIN" />
            <FormButton url="/signup" text="SIGN UP" />
          </div>
        </div>
      </div>
    </>
  );
}
export default LogInPage;
