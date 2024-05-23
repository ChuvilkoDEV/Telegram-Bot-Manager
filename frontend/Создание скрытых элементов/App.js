import React, { useState } from 'react';
import Menu from './Menu';
import List from './List';

function App() {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <Menu toggleVisibility={toggleVisibility} />
      <List isVisible={isVisible} />
    </div>
  );
}

export default App;
