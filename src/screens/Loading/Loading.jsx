import React from 'react';
import classNames from 'classnames';

import styles from './Loading.module.scss';

const Loading = () => {
  return (
    <div className={classNames(styles.Loading, 'root-layout')}>
      <h1 className="text-light">Initializing...</h1>
    </div>
  );
};

export default Loading;
