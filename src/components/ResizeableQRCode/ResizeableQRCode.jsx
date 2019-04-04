import React, { useState, useImperativeMethods, forwardRef } from 'react';
import { func, string } from 'prop-types';
import QRCode from 'qrcode.react';

const ResizeableQRCode = forwardRef(({ getSize, value, className }, ref) => {
  /* eslint-disable no-unused-vars */
  const [_, forceUpdate] = useState();
  useImperativeMethods(ref, () => ({
    redraw: () => forceUpdate(new Date().getTime()),
  }));

  return <QRCode size={getSize()} value={value} className={className} />;
});

ResizeableQRCode.propTypes = {
  getSize: func.isRequired,
  value: string.isRequired,
  className: string,
};

ResizeableQRCode.displayName = 'ResizeableQRCode';

export default ResizeableQRCode;
