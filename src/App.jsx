import React from 'react';
import QRCode from 'qrcode.react';

import styles from './App.module.scss';

const App = () => (
  <div className={styles.App}>
    <header className="App-header">
      <QRCode size={200} value={`checkin://${123}`} />
    </header>
  </div>
);

export default App;
