import { GetStaticProps } from 'next';
import Link from 'next/link';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string | null;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  return (
    <div className={commonStyles.container}>
      <img src="/logo.svg" alt="logo" className={styles.logo} />
      <main className={styles.posts}>
        {postsPagination.results.map(post => (
          <Link key={post.uid} href={`/post/${post.uid}`}>
            <a>
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <div className={styles.info}>
                <time>{post.first_publication_date}</time>
                <span>{post.data.author}</span>
              </div>
            </a>
          </Link>
        ))}
      </main>
      {postsPagination.next_page && (
        <button type="button" className={styles.loadMore}>
          Carregar mais posts
        </button>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const response = await prismic.query('', {
    pageSize: 1, // número desejado de posts por página
  });

  const postsPagination: PostPagination = {
    next_page: response.next_page,
    results: response.results.map(post => ({
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    })),
  };

  return {
    props: {
      postsPagination,
    },
  };
};
