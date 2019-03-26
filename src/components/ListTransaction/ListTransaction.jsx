import React, { useState } from 'react';
import { string } from 'prop-types';
import { Row, Col, ListGroup, Card, Media, Button, Badge, Alert } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import { FiRefreshCcw } from 'react-icons/fi';
import { PulseLoader } from 'react-spinners';
import classNames from 'classnames';
import get from 'lodash.get';
import { toast } from 'react-toastify';

import { useTransactionsQuery, useDoneTransactionMutation } from '@/apollo';
import { INIT, WAITING, REFUNDED } from '@/constants/transactionStatus';
import { LOADING, FETCH_MORE } from '@/constants/apolloNetworkStatus';

import styles from './ListTransactions.module.scss';

const ListTransaction = ({ className }) => {
  const [processingTrans, setProcessingTrans] = useState([]);
  const { data, loading, error, networkStatus, refetch, hasMore, fetchMore } = useTransactionsQuery(
    {
      offset: 0,
      limit: 20,
    },
  );
  const transactions = data.data || [];

  const [doneTransaction] = useDoneTransactionMutation({
    onCompleted: () => toast('Giao dịch đã được hoàn tất'),
    onError: e => alert(e.message),
  });

  const onDoneTransaction = async ({ id, staff }) => {
    if (!window.confirm(`Xác nhận hoàn thành giao dịch với ${staff.name || 'N/A'}?`)) {
      return;
    }
    setProcessingTrans(processingTrans.concat(id));
    await doneTransaction(id);
    setProcessingTrans(processingTrans.filter(pt => pt.id !== id));
  };

  const rendeStatusBadge = (status) => {
    if (status === INIT || status === WAITING) {
      return (
        <Badge pill variant="secondary">
          Đang chờ
        </Badge>
      );
    }
    if (status === REFUNDED) {
      return (
        <Badge pill variant="danger">
          Đã hoàn trả
        </Badge>
      );
    }
    return (
      <Badge pill variant="primary">
        Đã hoàn thành
      </Badge>
    );
  };

  const renderListTransaction = () => {
    if (error) {
      return (
        <Alert className="m-0" variant="danger">
          {error.message || 'Đã có lỗi xảy ra'}
        </Alert>
      );
    }

    if (networkStatus === LOADING) {
      return (
        <div className="text-center">
          <PulseLoader color="#FFF" />
        </div>
      );
    }

    if (transactions.length === 0) {
      return (
        <Alert className="m-0" variant="secondary">
          Chưa có giao dịch nào
        </Alert>
      );
    }

    return transactions.map(t => (
      <Card key={t.id} className="shadow mb-3">
        <Card.Body>
          <Card.Title>
            <Media>
              <img className="staff-avatar mr-3" src={get(t, 'staff.avatar')} alt="avatar" />
              <Media.Body className="align-self-center">
                <h5 className="mb-1">{get(t, 'staff.name', 'N/A')}</h5>
                {rendeStatusBadge(t.status)}
              </Media.Body>
            </Media>
          </Card.Title>
          <ListGroup variant="flush">
            {(t.products || []).map(p => (
              <ListGroup.Item key={p.id}>
                <Row>
                  <Col className="d-flex">
                    <div className="product-name mr-1">{p.name}</div>
                    <div>x{p.quantity}</div>
                  </Col>
                  <Col className="text-right">{p.price}</Col>
                </Row>
              </ListGroup.Item>
            ))}
            <ListGroup.Item variant="secondary" className="border-0">
              <Row>
                <Col>Phí</Col>
                <Col className="text-right">{t.fee}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item variant="secondary" className="border-0">
              <Row>
                <Col>
                  <h5>TỔNG</h5>
                </Col>
                <Col className="text-right">
                  <h5>{t.total}</h5>
                </Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
        {(t.status === INIT || t.status === WAITING) && (
          <Card.Footer className="text-right">
            <Button disabled={processingTrans.includes(t.id)} onClick={() => onDoneTransaction(t)}>
              Hoàn thành
            </Button>
          </Card.Footer>
        )}
      </Card>
    ));
  };

  return (
    <div className={classNames(styles.ListTransaction, className)}>
      <div className="header">
        <h4 className="mb-0">Danh sách giao dịch</h4>
        <Button className="refresh-button" onClick={() => refetch()}>
          <FiRefreshCcw />
        </Button>
      </div>
      <Scrollbars
        noscrollx="true"
        className="scrollbar"
        style={{ width: '100%', height: '100%' }}
        onScroll={({ target: { scrollTop, scrollHeight, clientHeight } }) => {
          const bottomReached = scrollTop === scrollHeight - clientHeight;
          if (bottomReached && hasMore && !loading) {
            fetchMore();
          }
        }}
      >
        <div className="p-3">{renderListTransaction()}</div>
        {networkStatus === FETCH_MORE && (
          <div className="text-center">
            <PulseLoader color="#FFF" />
          </div>
        )}
      </Scrollbars>
    </div>
  );
};

ListTransaction.propTypes = {
  className: string,
};

export default ListTransaction;
