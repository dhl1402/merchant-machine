import React from 'react';
import classNames from 'classnames';

import { ListProduct, ListTransaction } from '@/components';

import styles from './Main.module.scss';

const Main = () => {
  return (
    <div className={classNames(styles.Main, 'h-100 d-flex')}>
      <ListProduct className="list-product" />
      <ListTransaction className="list-transaction" />
    </div>
  );
};

export default Main;
