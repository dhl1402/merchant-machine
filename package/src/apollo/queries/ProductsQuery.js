import gql from 'graphql-tag';

export default gql`
  query Products($offset: Float, $limit: Float) {
    allProduct(offset: $offset, limit: $limit) {
      offset
      limit
      total
      data {
        id
        name
        price
        qrcode_data
        image_url
      }
    }
  }
`;
