import gql from 'graphql-tag';

import AuthFragment from '../fragments/AuthFragment';

export default gql`
  mutation Init($id: String!, $machine_id: String!, $ts: Float!, $hash: String!) {
    init(id: $id, machine_id: $machine_id, ts: $ts, hash: $hash) {
      ...AuthFragment
    }
  }
  ${AuthFragment}
`;
