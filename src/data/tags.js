import { gql } from '@apollo/client';

export const QUERY_ALL_TAGS = gql`
  query AllTags {
    tags(first: 10000) {
      edges {
        node {
          id
          name
          slug
        }
      }
    }
  }
`;
