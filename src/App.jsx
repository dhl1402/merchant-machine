import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import elementResizeEvent from 'element-resize-event';

import ResizeableQRCode from './components/ResizeableQRCode';
import ListTransaction from './components/ListTransaction';

import styles from './App.module.scss';

const App = () => {
  const container = useRef();
  const resizeDebounce = useRef();
  const qrCode = useRef();

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

  return (
    <div ref={container} className={classNames(styles.App, 'h-100 d-flex')}>
      <div className="main">
        <div className="text-center">
          <h1 className="mb-4 text-light">QR CODE</h1>
          <ResizeableQRCode
            ref={qrCode}
            getSize={getQRCodeSize}
            value="12313123123"
            className="qrcode"
          />
        </div>
      </div>
      <div className="list-transaction">
        <ListTransaction />
      </div>
    </div>
  );
};

export default App;
