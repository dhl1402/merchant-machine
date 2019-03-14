import React from 'react';

import Main from '@/screens/Main';
import Config from '@/screens/Config';

import configs from '@/constants/configs';

const App = () => {
  if (!configs) {
    return <Config />;
  }

  return (
    <Main />
  );
};

export default App;
