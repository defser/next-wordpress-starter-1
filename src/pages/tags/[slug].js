import usePageMetadata from 'hooks/use-page-metadata';

import TemplateArchive from 'templates/archive';
import Title from 'components/Title';
import { getTagBySlug } from 'lib/tags';
import { getPostsByTagSlug } from 'lib/posts';

export default function Tag({ tag, posts }) {
  const { name, slug } = tag;

  const { metadata } = usePageMetadata({
    metadata: {
      ...tag,
      description: `Read ${posts.length} posts with tag ${name}`,
    },
  });

  return (
    <>
      <TemplateArchive
        title={name}
        Title={<Title title={name} />}
        posts={posts}
        slug={slug}
        path={'/tags/'}
        metadata={metadata}
      />
    </>
  );
}

export async function getStaticProps({ params = {} } = {}) {
  const { tag } = await getTagBySlug(params?.slug);

  if (!tag) {
    return {
      props: {},
      notFound: true,
    };
  }

  const { posts } = await getPostsByTagSlug({
    slug: tag?.slug,
    queryIncludes: 'archive',
  });

  return {
    props: {
      tag,
      posts,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
