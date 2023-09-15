import { GetStaticPaths, GetStaticProps } from 'next';

import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Header from '../../components/Header';

interface PostProp {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: PostProp;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Header />
      <div className={commonStyles.container}>
        {/* Renderize o conteúdo do post aqui */}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const response = await prismic.query('', {});

  const paths = response.results.map(post => ({
    params: {
      slug: post.uid,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  let slug = params?.slug;

  if (Array.isArray(slug)) {
    [slug] = slug;
  }
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('nome_do_seu_tipo_de_post', slug, {});

  const post: PostProp = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(section => ({
        heading: section.heading,
        body: section.body,
      })),
    },
  };

  return {
    props: {
      post,
    },
  };
};
