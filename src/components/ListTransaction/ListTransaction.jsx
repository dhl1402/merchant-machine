import React from 'react';
import { string } from 'prop-types';
import { Row, Col, ListGroup, Card, Media, Button, Badge } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import classNames from 'classnames';

import { INIT, WAITING, RECEIVED, REFUNDED } from '../../constants/transactionStatus';

import styles from './ListTransactions.module.scss';

const ListTransaction = ({ className }) => {
  const rendeStatusBadge = (status) => {
    if (status === INIT || status === WAITING) {
      return <Badge pill variant="secondary">Đang chờ</Badge>;
    }
    if (status === REFUNDED) {
      return <Badge pill variant="danger">Đã hoàn trả</Badge>;
    }
    return <Badge pill variant="primary">Đã hoàn thành</Badge>;
  };

  return (
    <div className={classNames(styles.ListTransaction, className)}>
      <div className="header">
        <h4>Danh sách giao dịch</h4>
      </div>
      <Scrollbars className="scrollbar" style={{ width: '100%', height: '100%' }} noscrollx="true">
        <div className="p-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => (
            <Card className="shadow mb-3">
              <Card.Body>
                <Card.Title>
                  <Media>
                    <img
                      className="staff-avatar mr-3"
                      src="http://jeanbaptiste.bayle.free.fr/AVATAR/grey_81618-default-avatar-200x200.jpg"
                      alt="avatar"
                    />
                    <Media.Body className="align-self-center">
                      <h5 className="mb-1">Đặng Hoàng Long</h5>
                      {rendeStatusBadge(RECEIVED)}
                    </Media.Body>
                  </Media>
                </Card.Title>
                <ListGroup variant="flush">
                  {[1, 2, 3].map(() => (
                    <ListGroup.Item>
                      <Row>
                        <Col className="d-flex">
                          <div className="product-name mr-1">asdasd</div>
                          <div>x1</div>
                        </Col>
                        <Col className="text-right">12312312VNĐ</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item variant="secondary" className="border-0">
                    <Row>
                      <Col>Phí</Col>
                      <Col className="text-right">1312VNĐ</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item variant="secondary" className="border-0">
                    <Row>
                      <Col>
                        <h5>TỔNG</h5>
                      </Col>
                      <Col className="text-right">
                        <h5>12312312VNĐ</h5>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
              <Card.Footer className="text-right">
                <Button>Hoàn thành</Button>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </Scrollbars>
    </div>
  );
};

ListTransaction.propTypes = {
  className: string,
};

export default ListTransaction;
