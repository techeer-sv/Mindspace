import { PostProps } from 'utils/types';
import styles from './Post.module.scss';

function Post({ title, date, time }: PostProps) {
  return (
    <div className={styles.content}>
      <span>{title}</span>
      <div className={styles.content__datetime}>
        <span>{date}</span>
        <span className={styles.content__time}>{time}</span>
      </div>
    </div>
  );
}

export default Post;
