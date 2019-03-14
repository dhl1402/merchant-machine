import React from 'react';

import styles from './Loading.module.scss';

const Loading = () => {
  return (
    <div className={styles.Loading}>
      <h1 className="text-light">Initializing...</h1>
    </div>
  );
};

export default Loading;
