import gql from 'graphql-tag';

import AuthFragment from '../fragments/AuthFragment';

export default gql`
  mutation RefreshToken($refresh_token: String!) {
    renewToken(refresh_token: $refresh_token) {
      ...AuthFragment
    }
  }
  ${AuthFragment}
`;
