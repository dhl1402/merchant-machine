import { get } from 'lodash';
import { useQuery } from 'react-apollo';
import update from 'immutability-helper';

import TransactionsQuery from '../queries/TransactionsQuery';

export default ({
  offset = 0,
  limit,
  onCompleted = () => {},
  onError = () => {},
  ...params
}) => {
  const queryResult = useQuery({
    query: TransactionsQuery,
    variables: { offset, limit },
    notifyOnNetworkStatusChange: true,
    onCompleted,
    onError,
    ...params,
  });

  const total = get(queryResult.data, 'allTransaction.total', 0);
  const listTrans = get(queryResult.data, 'allTransaction.data', []) || [];
  const hasMore = listTrans.length < total;
  const data = get(queryResult.data, 'allTransaction', {});

  const fetchMore = () => {
    queryResult.fetchMore({
      variables: { offset: listTrans.length },
      updateQuery: (prevData, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prevData;
        }
        return update(prevData, {
          allTransaction: {
            total: { $set: fetchMoreResult.allTransaction.total },
            data: { $push: fetchMoreResult.allTransaction.data },
          },
        });
      },
    });
  };

  return { ...queryResult, data, hasMore, fetchMore };
};
