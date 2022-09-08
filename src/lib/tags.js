import { getApolloClient } from 'lib/apollo-client';

import { QUERY_ALL_TAGS } from 'data/tags';

/**
 * getTagBySlug
 */

export async function getTagBySlug(slug) {
  const { tags } = await getAllTags();

  const tag = tags.find((tag) => tag.slug === slug);

  return {
    tag,
  };
}

/**
 * getAllTags
 */

export async function getAllTags() {
  const apolloClient = getApolloClient();

  let tagsData;

  try {
    tagsData = await apolloClient.query({
      query: QUERY_ALL_TAGS,
    });
  } catch (e) {
    console.log(`[tags][getAllTags] Failed to query tags data: ${e.message}`);
    throw e;
  }

  let tags = tagsData?.data.tags.edges.map(({ node = {} }) => node);

  return {
    tags,
  };
}
