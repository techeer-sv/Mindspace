import styles from './../Auth.module.scss';
import logo from 'images/logo.svg';
import FormBox from '../components/FormBox';
import FormButton from '../components/FormButton';

// login , sign up으로 수정
function SignUpPage() {
  return (
    <>
      <img className={styles.header} src={logo} />
      <div className={styles.content}>
        <div className={styles.content__box}>
          <span className={styles.content__title}>Create Acount</span>
          <FormBox placeholder="Email" />
          <FormBox placeholder="Nickname" />
          <FormBox placeholder="Password" />
          <FormBox placeholder="Password Check" />
          <FormButton url="/login" text="SIGN UP" />
        </div>
      </div>
    </>
  );
}
export default SignUpPage;
