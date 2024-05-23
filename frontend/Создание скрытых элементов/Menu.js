import React from 'react';

function Menu({ toggleVisibility }) {
  return (
    <button onClick={toggleVisibility}>
      Toggle List
    </button>
  );
}

export default Menu;
