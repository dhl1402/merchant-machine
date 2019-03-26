import React, { useState, useEffect, useRef } from 'react';
import { string } from 'prop-types';
import debounce from 'lodash.debounce';
import elementResizeEvent from 'element-resize-event';
import classNames from 'classnames';
import DragScroll from 'react-dragscroll';
import { PulseLoader } from 'react-spinners';
import { Alert } from 'react-bootstrap';

import { ResizeableQRCode } from '@/components';
import { useProductsQuery } from '@/apollo';
import { LOADING } from '@/constants/apolloNetworkStatus';

import styles from './ListProduct.module.scss';
import placeholder from '@/static/images/placeholder.png';

const ListProduct = ({ className }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const container = useRef();
  const resizeDebounce = useRef();
  const qrCode = useRef();

  const { data, error, networkStatus } = useProductsQuery({ offset: 0, limit: 20 });
  const products = data.data || [];

  useEffect(() => {
    if (!selectedProduct && products.length > 0) {
      setSelectedProduct(products[0]);
    }
  }, [products]);

  useEffect(() => {
    elementResizeEvent(container.current, () => {
      if (resizeDebounce.current) {
        resizeDebounce.current.cancel();
      }
      resizeDebounce.current = debounce(() => qrCode.current.redraw(), 200);
      resizeDebounce.current();
    });

    return () => {
      elementResizeEvent.unbind(container.current);
      if (resizeDebounce.current) {
        resizeDebounce.current.cancel();
      }
    };
  }, []);

  const getQRCodeSize = () => {
    if (document.documentElement.clientWidth / 4 > 100) {
      return document.documentElement.clientWidth / 4;
    }
    return 100;
  };

  const renderListProduct = () => {
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

    if (products.length === 0) {
      return (
        <Alert className="m-0" variant="secondary">
          Chưa có giao sản phẩm nào
        </Alert>
      );
    }

    return products.map(p => (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        key={p.id}
        className={classNames('product-item', { selected: selectedProduct && selectedProduct.id === p.id })}
        onClick={() => setSelectedProduct(p)}
      >
        <img
          className="product-image"
          src={p.image_url || placeholder}
          alt="product"
        />
        <div className="product-title">
          <h5 className="text-light mb-1">{p.name}</h5>
          <div className="text-light">{p.price}</div>
        </div>
      </div>
    ));
  };

  return (
    <div ref={container} className={classNames(styles.ListProduct, className)}>
      <DragScroll className="drag-zone">
        <div className="h-100">{renderListProduct()}</div>
      </DragScroll>
      {selectedProduct && (
        <div className="text-center">
          <h1 className="mb-4 text-light">QR CODE</h1>
          <ResizeableQRCode
            ref={qrCode}
            getSize={getQRCodeSize}
            value={selectedProduct.qrcode_data}
            className="qrcode"
          />
        </div>
      )}
    </div>
  );
};

ListProduct.propTypes = {
  className: string,
};

export default ListProduct;
