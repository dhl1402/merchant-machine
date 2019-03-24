import gql from 'graphql-tag';

export default gql`
  fragment AuthFragment on MachineInit {
    id
    name
    access_token
    refresh_token
  }
`;
