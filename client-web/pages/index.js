import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.scss'
import api from '../utils/api';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function Home() {
  const [users, setUsers] = useState();
  const [user, setUser] = useState();
  const { t } = useTranslation('common');

  useEffect(async () => {
    const response = await api({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/authentication`,
      params: {
        strategy: 'local',
        email: 'lt@example.com',
        password: 'secret'
      }
    });

    localStorage.authToken = response.data.accessToken;

    const usersData = await api({
      method: 'get',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/users`
    });
    console.log('heyhey', usersData.data)
    setUsers(usersData.data);

    console.log('hiya hiya');
    console.log(`${process.env.NEXT_PUBLIC_BASE_URL}`);

  }, []);

  useEffect(async () => {
    if (users?.data) {  
      console.log('users data is ', users)
      const userData = await api({
        method: 'get',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/users/${users.data[0]._id}`
      });

      setUser(userData.data);
    }
  }, [users]);

  return (
    <>
      <h1 className={styles.title}>
        {t('index.Welcome to the application')}  
      </h1>

      <p className={styles.description}>
        Get started by editing{' '}
        <code className={styles.code}>pages/index.js</code>
        <br />Users: {JSON.stringify(users)};
      </p>

      <p className={styles.description}>
        Sign in:
        <Link href="/signin">Sign in</Link>
      </p>

      <div className={styles.grid}>
        <a href="https://nextjs.org/docs" className={styles.card}>
          <h2>Documentation &rarr;</h2>
          <p>Find in-depth information about Next.js features and API.</p>
          <br />User data: {JSON.stringify(user)};
        </a>

        <a href="https://nextjs.org/learn" className={styles.card}>
          <h2>Learn &rarr;</h2>
          <p>Learn about Next.js in an interactive course with quizzes!</p>
        </a>

        <a
          href="https://github.com/vercel/next.js/tree/master/examples"
          className={styles.card}
        >
          <h2>Examples &rarr;</h2>
          <p>Discover and deploy boilerplate example Next.js projects.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          className={styles.card}
        >
          <h2>Deploy &rarr;</h2>
          <p>
            Instantly deploy your Next.js site to a public URL with Vercel.
          </p>
        </a>
      </div>
    </>
  )
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    }
  }
}