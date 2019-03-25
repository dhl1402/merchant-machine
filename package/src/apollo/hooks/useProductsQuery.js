import { get } from 'lodash';
import { useQuery } from 'react-apollo';
import update from 'immutability-helper';

import ProductsQuery from '../queries/ProductsQuery';

export default ({
  offset = 0,
  limit,
  onCompleted = () => {},
  onError = () => {},
  ...params
}) => {
  const queryResult = useQuery({
    query: ProductsQuery,
    variables: { offset, limit },
    notifyOnNetworkStatusChange: true,
    onCompleted,
    onError,
    ...params,
  });

  const total = get(queryResult.data, 'allProduct.total', 0);
  const listProduct = get(queryResult.data, 'allProduct.data', []) || [];
  const hasMore = listProduct.length < total;
  const data = get(queryResult.data, 'allProduct', {});

  const fetchMore = () => {
    queryResult.fetchMore({
      variables: { offset: listProduct.length },
      updateQuery: (prevData, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prevData;
        }
        return update(prevData, {
          allProduct: {
            total: { $set: fetchMoreResult.allProduct.total },
            data: { $push: fetchMoreResult.allProduct.data },
          },
        });
      },
    });
  };

  return { ...queryResult, data, hasMore, fetchMore };
};
